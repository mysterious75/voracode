import { Global } from "@voracode-ai/core/global"
import fs from "fs/promises"
import path from "path"

interface IndexedEntry {
  path: string
  keywords: Record<string, number>
  timestamp: number
}

const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
  "be", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "shall", "can", "need", "dare",
  "it", "its", "this", "that", "these", "those", "i", "me", "my",
  "we", "our", "you", "your", "he", "him", "his", "she", "her",
  "they", "them", "their", "what", "which", "who", "whom",
])

const INDEX_PATH = path.join(Global.Path.data, "rag", "index.json")

async function ensureDir() {
  await fs.mkdir(path.dirname(INDEX_PATH), { recursive: true })
}

async function loadIndex(): Promise<Map<string, IndexedEntry>> {
  try {
    const raw = await Bun.file(INDEX_PATH).text()
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Map()
    const map = new Map<string, IndexedEntry>()
    for (const entry of parsed) {
      if (
        entry &&
        typeof entry === "object" &&
        typeof (entry as IndexedEntry).path === "string" &&
        typeof (entry as IndexedEntry).keywords === "object" &&
        typeof (entry as IndexedEntry).timestamp === "number"
      ) {
        map.set((entry as IndexedEntry).path, entry as IndexedEntry)
      }
    }
    return map
  } catch {
    return new Map()
  }
}

async function saveIndex(index: Map<string, IndexedEntry>) {
  await ensureDir()
  const entries = Array.from(index.values())
  await Bun.write(INDEX_PATH, JSON.stringify(entries, null, 2))
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s\p{P}]+/u)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token))
}

function extractKeywords(content: string): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const token of tokenize(content)) {
    counts[token] = (counts[token] ?? 0) + 1
  }
  return counts
}

export async function indexFile(filePath: string, content: string): Promise<void> {
  const index = await loadIndex()
  index.set(filePath, {
    path: filePath,
    keywords: extractKeywords(content),
    timestamp: Date.now(),
  })
  await saveIndex(index)
}

export async function searchFiles(query: string, limit: number = 10): Promise<Array<{ path: string; score: number }>> {
  const index = await loadIndex()
  const tokens = tokenize(query)
  if (!tokens.length) return []

  const scores = new Map<string, number>()
  for (const entry of index.values()) {
    let score = 0
    for (const token of tokens) {
      score += entry.keywords[token] ?? 0
    }
    if (score > 0) {
      scores.set(entry.path, score)
    }
  }

  return Array.from(scores.entries())
    .map(([path, score]) => ({ path, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export async function removeFile(filePath: string): Promise<void> {
  const index = await loadIndex()
  index.delete(filePath)
  await saveIndex(index)
}

export * as RAG from "."
