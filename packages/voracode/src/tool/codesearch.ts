import path from "path"
import { Effect, Schema } from "effect"
import { InstanceState } from "@/effect/instance-state"
import { FSUtil } from "@voracode-ai/core/fs-util"
import { Ripgrep } from "@voracode-ai/core/ripgrep"
import { assertExternalDirectoryEffect } from "./external-directory"
import DESCRIPTION from "./codesearch.txt"
import * as Tool from "./tool"
import { Glob } from "@voracode-ai/core/util/glob"

export const Parameters = Schema.Struct({
  query: Schema.String.annotate({
    description: "Natural language search query (e.g. 'authentication flow', 'error handling patterns', 'how does the session work')",
  }),
  path: Schema.optional(Schema.String).annotate({
    description: "Directory to search in. Defaults to the current working directory.",
  }),
  include: Schema.optional(Schema.String).annotate({
    description: 'File pattern to include (e.g. "*.ts", "*.{ts,tsx}", "src/**/*.go")',
  }),
  maxResults: Schema.optional(Schema.Number).annotate({
    description: "Maximum number of results to return (default: 10)",
  }),
})

interface IndexedFile {
  path: string
  content: string
  lines: string[]
  tokens: Map<string, number>
  totalTokens: number
}

interface SearchResult {
  file: string
  line: number
  snippet: string
  score: number
  matchType: "exact" | "partial" | "semantic"
}

const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "shall", "can", "need", "dare", "ought",
  "used", "to", "of", "in", "for", "on", "with", "at", "by", "from",
  "as", "into", "through", "during", "before", "after", "above", "below",
  "between", "out", "off", "over", "under", "again", "further", "then",
  "once", "here", "there", "when", "where", "why", "how", "all", "both",
  "each", "few", "more", "most", "other", "some", "such", "no", "nor",
  "not", "only", "own", "same", "so", "than", "too", "very", "just",
  "don", "now", "and", "but", "or", "if", "while", "that", "this",
  "it", "its", "i", "me", "my", "we", "our", "you", "your", "he",
  "him", "his", "she", "her", "they", "them", "their", "what", "which",
  "who", "whom", "these", "those", "am",
])

function tokenize(text: string): Map<string, number> {
  const tokens = new Map<string, number>()
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w))

  for (const word of words) {
    tokens.set(word, (tokens.get(word) ?? 0) + 1)
  }
  return tokens
}

function extractIdentifiers(content: string): string[] {
  const identifiers: string[] = []
  const patterns = [
    /(?:function|class|interface|type|enum|const|let|var|export|import)\s+(\w+)/g,
    /(\w+)\s*(?:\(|=<|:)/g,
    /(?:def|class|import|from|return|if|else|for|while)\s+(\w+)/g,
  ]

  for (const pattern of patterns) {
    let match
    while ((match = pattern.exec(content)) !== null) {
      if (match[1] && match[1].length > 1) {
        identifiers.push(match[1].toLowerCase())
      }
    }
  }
  return identifiers
}

function scoreResult(query: string, file: IndexedFile, line: number): SearchResult {
  const queryTokens = tokenize(query)
  const queryIdentifiers = query.split(/\s+/).map((w) => w.toLowerCase().replace(/[^a-z0-9_]/g, "")).filter(Boolean)
  const lineContent = file.lines[line] ?? ""
  const lineLower = lineContent.toLowerCase()

  let score = 0
  let matchType: SearchResult["matchType"] = "partial"

  for (const [token, queryCount] of queryTokens) {
    const fileCount = file.tokens.get(token) ?? 0
    if (fileCount > 0) {
      score += queryCount * (1 + Math.log(fileCount))
      matchType = "partial"
    }

    if (lineLower.includes(token)) {
      score += 3 * queryCount
    }
  }

  for (const identifier of queryIdentifiers) {
    if (identifier.length < 2) continue
    if (lineLower.includes(identifier)) {
      score += 5
      matchType = "exact"
    }
  }

  const lineTrimmed = lineContent.trim()
  if (lineTrimmed.startsWith("export ") || lineTrimmed.startsWith("function ") || lineTrimmed.startsWith("class ")) {
    score += 2
  }
  if (lineTrimmed.includes("function") || lineTrimmed.includes("=>") || lineTrimmed.includes("async")) {
    score += 1
  }

  const contextStart = Math.max(0, line - 2)
  const contextEnd = Math.min(file.lines.length, line + 3)
  const snippet = file.lines.slice(contextStart, contextEnd).join("\n")

  return {
    file: file.path,
    line: line + 1,
    snippet,
    score,
    matchType,
  }
}

async function indexFiles(
  directory: string,
  include?: string,
): Promise<IndexedFile[]> {
  const pattern = include ?? "**/*.{ts,tsx,js,jsx,go,py,rs,java,rb,c,cpp,h,hpp,cs,swift,kt,scala,lua,r,sql,md,json,yaml,yml,toml,xml,html,css,scss,less,vue,svelte}"

  const files: IndexedFile[] = []
  const MAX_FILE_SIZE = 100 * 1024
  const MAX_FILES = 500

  let entries: string[]
  try {
    entries = await Glob.scan(pattern, { cwd: directory, absolute: true, dot: false, include: "file" })
  } catch {
    return files
  }

  let count = 0
  for (const entry of entries) {
    if (count >= MAX_FILES) break

    try {
      const stat = Bun.file(entry).size
      if (stat > MAX_FILE_SIZE || stat === 0) continue

      const content = await Bun.file(entry).text()
      if (!content || content.length === 0) continue

      const lines = content.split("\n")
      const tokens = tokenize(content)
      const identifiers = extractIdentifiers(content)
      for (const id of identifiers) {
        tokens.set(id, (tokens.get(id) ?? 0) + 2)
      }

      files.push({
        path: entry,
        content,
        lines,
        tokens,
        totalTokens: lines.length,
      })
      count++
    } catch {
      continue
    }
  }

  return files
}

function searchIndex(
  files: IndexedFile[],
  query: string,
  maxResults: number,
): SearchResult[] {
  const results: SearchResult[] = []

  for (const file of files) {
    for (let i = 0; i < file.lines.length; i++) {
      const result = scoreResult(query, file, i)
      if (result.score > 0) {
        results.push(result)
      }
    }
  }

  results.sort((a, b) => b.score - a.score)

  const seen = new Set<string>()
  const unique: SearchResult[] = []
  for (const r of results) {
    const key = `${r.file}:${r.line}`
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(r)
    if (unique.length >= maxResults) break
  }

  return unique
}

const indexCache = new Map<string, { files: IndexedFile[]; timestamp: number }>()
const CACHE_TTL = 60_000

export const CodesearchTool = Tool.define(
  "codesearch",
  Effect.gen(function* () {
    const fs = yield* FSUtil.Service
    const ripgrep = yield* Ripgrep.Service

    return {
      description: DESCRIPTION,
      parameters: Parameters,
      execute: (params: { query: string; path?: string; include?: string; maxResults?: number }, ctx: Tool.Context) =>
        Effect.gen(function* () {
          if (!params.query) {
            throw new Error("query is required")
          }

          yield* ctx.ask({
            permission: "grep",
            patterns: [params.query],
            always: ["*"],
            metadata: {
              query: params.query,
              path: params.path,
              include: params.include,
            },
          })

          const ins = yield* InstanceState.context
          const requested = path.isAbsolute(params.path ?? ins.directory)
            ? (params.path ?? ins.directory)
            : path.join(ins.directory, params.path ?? ".")
          const requestedInfo = yield* fs.stat(requested).pipe(Effect.catch(() => Effect.succeed(undefined)))
          yield* assertExternalDirectoryEffect(ctx, requested, {
            bypass: false,
            kind: requestedInfo?.type === "Directory" ? "directory" : "file",
          })

          const search = FSUtil.resolve(requested)
          const info = yield* fs.stat(search).pipe(Effect.catch(() => Effect.succeed(undefined)))
          const cwd = info?.type === "Directory" ? search : path.dirname(search)

          yield* ctx.metadata({ title: `Codesearch: "${params.query}"`, metadata: { query: params.query } })

          const now = Date.now()
          const cached = indexCache.get(cwd)
          let files: IndexedFile[]

          if (cached && now - cached.timestamp < CACHE_TTL) {
            files = cached.files
          } else {
            files = yield* Effect.promise(() => indexFiles(cwd, params.include))
            indexCache.set(cwd, { files, timestamp: now })
          }

          if (files.length === 0) {
            return {
              title: `Codesearch: ${params.query}`,
              metadata: { indexedFiles: 0, results: 0, query: params.query },
              output: "No code files found to index. Try adjusting the path or include pattern.",
            }
          }

          const maxResults = params.maxResults ?? 10
          const results = searchIndex(files, params.query, maxResults)

          if (results.length === 0) {
            return {
              title: `Codesearch: ${params.query}`,
              metadata: { indexedFiles: files.length, results: 0, query: params.query },
              output: `No relevant code found for "${params.query}" across ${files.length} indexed files. Try different keywords or use grep for exact text search.`,
            }
          }

          const output: string[] = [
            `Found ${results.length} relevant code sections across ${files.length} indexed files.`,
            "",
          ]

          for (const result of results) {
            const relPath = path.relative(cwd, result.file)
            const scoreStr = `score: ${result.score.toFixed(1)}`
            const matchStr = `[${result.matchType}]`

            output.push(`--- ${relPath}:${result.line} (${scoreStr} ${matchStr}) ---`)
            output.push(result.snippet)
            output.push("")
          }

          return {
            title: `Codesearch: ${params.query}`,
            metadata: {
              indexedFiles: files.length,
              results: results.length,
              query: params.query,
            },
            output: output.join("\n"),
          }
        }).pipe(Effect.orDie),
    }
  }),
)
