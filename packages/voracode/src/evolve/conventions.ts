/**
 * EVOLVE Convention Extraction
 *
 * Automatically detects coding conventions from a project's codebase.
 * Analyzes naming patterns, imports, error handling, testing, and architecture.
 *
 * Inspired by: Aider's repo map, Cursor's .cursorrules
 */

import * as fs from "fs/promises"
import * as path from "path"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface NamingConventions {
  functions: PatternDetection
  variables: PatternDetection
  files: PatternDetection
  components: PatternDetection
  classes: PatternDetection
  constants: PatternDetection
  interfaces: PatternDetection
}

export interface PatternDetection {
  pattern: string
  confidence: number // 0.0 - 1.0
  samples: number // How many samples were analyzed
}

export interface ImportConventions {
  style: "relative" | "absolute" | "barrel" | "mixed"
  sorting: "alphabetical" | "grouped" | "none"
  confidence: number
}

export interface ErrorHandlingConventions {
  pattern: "try-catch" | "result-type" | "mixed"
  customErrorClass?: string
  confidence: number
}

export interface TestingConventions {
  framework: string
  pattern: "describe-it" | "test" | "flat" | "unknown"
  assertion: string
  coLocated: boolean
  confidence: number
}

export interface FormattingConventions {
  semicolons: boolean
  quotes: "single" | "double" | "mixed"
  trailingComma: boolean
  indentStyle: "tabs" | "spaces"
  indentSize: number
  confidence: number
}

export interface ArchitectureConventions {
  pattern: "layered" | "feature-based" | "clean" | "flat" | "monorepo" | "unknown"
  srcDir: boolean // Has src/ directory
  testDir: boolean // Has test/ or tests/ directory
  confidence: number
}

export interface ProjectConventions {
  naming: NamingConventions
  imports: ImportConventions
  errorHandling: ErrorHandlingConventions
  testing: TestingConventions
  formatting: FormattingConventions
  architecture: ArchitectureConventions
  detectedAt: string // ISO 8601
  filesAnalyzed: number
}

// ─── Constants ───────────────────────────────────────────────────────────────

const SAMPLE_SIZE = 50
const MIN_SAMPLES_FOR_CONFIDENCE = 2

const CODE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]
const TEST_PATTERNS = [".test.", ".spec.", "__tests__/"]
const IGNORE_DIRS = ["node_modules", ".git", "dist", "build", ".next", ".voracode", ".openclaw"]

// Path traversal protection
function isSafePath(filePath: string, basePath: string): boolean {
  const resolved = path.resolve(basePath, filePath)
  return resolved.startsWith(path.resolve(basePath))
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function collectFiles(dir: string, extensions: string[], maxFiles: number): Promise<string[]> {
  const files: string[] = []
  const resolvedDir = path.resolve(dir)

  async function walk(currentDir: string): Promise<void> {
    if (files.length >= maxFiles) return

    // Path traversal protection
    if (!currentDir.startsWith(resolvedDir)) return

    let entries: fs.Dirent[]
    try {
      entries = await fs.readdir(currentDir, { withFileTypes: true })
    } catch {
      return // Permission denied or similar
    }

    for (const entry of entries) {
      if (files.length >= maxFiles) break
      if (entry.isDirectory()) {
        if (IGNORE_DIRS.includes(entry.name)) continue
        if (entry.name.startsWith(".")) continue // Skip hidden dirs
        await walk(path.join(currentDir, entry.name))
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name)
        if (extensions.includes(ext)) {
          files.push(path.join(currentDir, entry.name))
        }
      }
    }
  }

  await walk(resolvedDir)
  return files
}

async function readFileSafe(filePath: string): Promise<string> {
  try {
    return await fs.readFile(filePath, "utf-8")
  } catch {
    return ""
  }
}

// ─── Pattern Detection ───────────────────────────────────────────────────────

function detectNamingPattern(names: string[]): PatternDetection {
  if (names.length < MIN_SAMPLES_FOR_CONFIDENCE) {
    return { pattern: "unknown", confidence: 0, samples: names.length }
  }

  let camelCase = 0
  let snakeCase = 0
  let pascalCase = 0
  let kebabCase = 0

  for (const name of names) {
    if (/^[a-z][a-zA-Z0-9]*$/.test(name)) camelCase++
    else if (/^[a-z][a-z0-9_]*$/.test(name)) snakeCase++
    else if (/^[A-Z][a-zA-Z0-9]*$/.test(name)) pascalCase++
    else if (/^[a-z][a-z0-9-]*$/.test(name)) kebabCase++
  }

  const total = names.length
  const patterns = [
    { name: "camelCase", count: camelCase },
    { name: "snake_case", count: snakeCase },
    { name: "PascalCase", count: pascalCase },
    { name: "kebab-case", count: kebabCase },
  ]

  const best = patterns.sort((a, b) => b.count - a.count)[0]
  if (!best || total === 0) {
    return { pattern: "unknown", confidence: 0, samples: total }
  }

  return {
    pattern: best.name,
    confidence: best.count / total,
    samples: total,
  }
}

function extractFunctions(content: string): string[] {
  const names: string[] = []

  // function declarations: function myFunc(...)
  const funcDecl = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g
  let match: RegExpExecArray | null
  while ((match = funcDecl.exec(content)) !== null) {
    names.push(match[1])
  }

  // arrow functions: const myFunc = (...) =>
  const arrowFunc = /(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s*)?\(/g
  while ((match = arrowFunc.exec(content)) !== null) {
    names.push(match[1])
  }

  // method definitions: myMethod(...) {
  const methodDef = /^\s*(?:async\s+)?([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/gm
  while ((match = methodDef.exec(content)) !== null) {
    if (!["if", "for", "while", "switch", "catch", "function", "class", "return"].includes(match[1])) {
      names.push(match[1])
    }
  }

  return names
}

function extractVariables(content: string): string[] {
  const names: string[] = []

  // const/let/var declarations
  const varDecl = /(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*[=:]/g
  let match: RegExpExecArray | null
  while ((match = varDecl.exec(content)) !== null) {
    names.push(match[1])
  }

  return names
}

function extractClasses(content: string): string[] {
  const names: string[] = []
  // Match: class ClassName ...
  const classDecl = /^\s*class\s+([A-Z][a-zA-Z0-9_$]*)/gm
  let match: RegExpExecArray | null
  while ((match = classDecl.exec(content)) !== null) {
    names.push(match[1])
  }
  return names
}

function extractInterfaces(content: string): string[] {
  const names: string[] = []
  const ifaceDecl = /interface\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g
  let match: RegExpExecArray | null
  while ((match = ifaceDecl.exec(content)) !== null) {
    names.push(match[1])
  }
  return names
}

function extractConstants(content: string): string[] {
  const names: string[] = []
  // Match: const NAME = or const NAME:
  // Also match: export const NAME =
  const constDecl = /(?:^|\s|;)const\s+([A-Z][A-Z0-9_]*)\s*[=:]/gm
  let match: RegExpExecArray | null
  while ((match = constDecl.exec(content)) !== null) {
    names.push(match[1])
  }
  return names
}

// ─── Convention Detectors ────────────────────────────────────────────────────

function detectImports(files: Array<{ path: string; content: string }>): ImportConventions {
  let relative = 0
  let absolute = 0
  let barrel = 0
  let total = 0

  for (const file of files) {
    const importLines = file.content.match(/import\s+.*?from\s+["']([^"']+)["']/g) ?? []
    for (const line of importLines) {
      const match = line.match(/from\s+["']([^"']+)["']/)
      if (!match) continue
      const importPath = match[1]
      total++

      if (importPath.startsWith(".")) relative++
      else if (importPath.endsWith("/index") || importPath.endsWith("/")) barrel++
      else absolute++
    }
  }

  if (total < MIN_SAMPLES_FOR_CONFIDENCE) {
    return { style: "mixed", sorting: "none", confidence: 0 }
  }

  const bestStyle = relative > absolute ? "relative" : absolute > relative ? "absolute" : "barrel"
  const confidence = Math.max(relative, absolute, barrel) / total

  return {
    style: bestStyle as ImportConventions["style"],
    sorting: "grouped", // Harder to detect, default to grouped
    confidence,
  }
}

function detectErrorHandling(files: Array<{ path: string; content: string }>): ErrorHandlingConventions {
  let tryCatch = 0
  let resultType = 0
  let customError: string | undefined

  for (const file of files) {
    // try-catch pattern
    const tryCount = (file.content.match(/try\s*\{/g) ?? []).length
    tryCatch += tryCount

    // Result type pattern (Either, Result, etc.)
    const resultCount = (file.content.match(/Result<|Either<|\.isOk\(\)|\.isErr\(\)|\.unwrap\(\)/g) ?? []).length
    resultType += resultCount

    // Custom error class
    const errorClass = file.content.match(/class\s+(\w*Error)\s+extends/)
    if (errorClass && !customError) {
      customError = errorClass[1]
    }
  }

  const total = tryCatch + resultType
  if (total < MIN_SAMPLES_FOR_CONFIDENCE) {
    return { pattern: "mixed", confidence: 0 }
  }

  return {
    pattern: tryCatch > resultType ? "try-catch" : resultType > tryCatch ? "result-type" : "mixed",
    customErrorClass: customError,
    confidence: Math.max(tryCatch, resultType) / total,
  }
}

function detectTesting(files: Array<{ path: string; content: string }>): TestingConventions {
  let jest = 0
  let vitest = 0
  let mocha = 0
  let bun = 0
  let describeIt = 0
  let testFn = 0
  let flat = 0
  let expect = 0
  let assert = 0
  let coLocated = 0
  let testFiles = 0

  for (const file of files) {
    const isTest = TEST_PATTERNS.some((p) => file.path.includes(p))
    if (!isTest) continue
    testFiles++

    // Check if co-located (test file next to source)
    const dir = path.dirname(file.path)
    const baseName = path.basename(file.path).replace(/\.(test|spec)\.(ts|tsx|js|jsx)$/, "")
    // Simple heuristic: if there's a matching source file
    if (files.some((f) => f.path !== file.path && f.path.includes(baseName) && !TEST_PATTERNS.some((p) => f.path.includes(p)))) {
      coLocated++
    }

    // Framework detection
    if (file.content.includes("from 'vitest'") || file.content.includes('from "vitest"')) vitest++
    else if (file.content.includes("from 'jest'") || file.content.includes('from "jest"')) jest++
    else if (file.content.includes("from 'mocha'") || file.content.includes('from "mocha"')) mocha++
    else if (file.content.includes("from 'bun:test'") || file.content.includes('from "bun:test"')) bun++

    // Pattern detection
    if (file.content.includes("describe(") || file.content.includes("it(")) describeIt++
    else if (file.content.match(/\btest\s*\(/)) testFn++
    else flat++

    // Assertion detection
    if (file.content.includes("expect(")) expect++
    if (file.content.includes("assert(") || file.content.includes("assert.")) assert++
  }

  if (testFiles === 0) {
    return { framework: "unknown", pattern: "unknown", assertion: "unknown", coLocated: false, confidence: 0 }
  }

  const frameworks = [
    { name: "vitest", count: vitest },
    { name: "jest", count: jest },
    { name: "mocha", count: mocha },
    { name: "bun", count: bun },
  ].sort((a, b) => b.count - a.count)

  const patterns = [
    { name: "describe-it" as const, count: describeIt },
    { name: "test" as const, count: testFn },
    { name: "flat" as const, count: flat },
  ].sort((a, b) => b.count - a.count)

  return {
    framework: frameworks[0].name,
    pattern: patterns[0].name,
    assertion: expect >= assert ? "expect" : "assert",
    coLocated: coLocated > testFiles / 2,
    confidence: frameworks[0].count / testFiles,
  }
}

function detectFormatting(files: Array<{ path: string; content: string }>): FormattingConventions {
  let semicolons = 0
  let noSemicolons = 0
  let singleQuotes = 0
  let doubleQuotes = 0
  let trailingComma = 0
  let noTrailingComma = 0
  let tabs = 0
  let spaces = 0
  let indentSizes: Map<number, number> = new Map()

  for (const file of files) {
    const lines = file.content.split("\n")

    // Semicolons at end of statements
    const codeLines = lines.filter((l) => l.trim() && !l.trim().startsWith("//") && !l.trim().startsWith("*"))
    for (const line of codeLines) {
      const trimmed = line.trimEnd()
      if (trimmed.endsWith(";") && !trimmed.endsWith("};") && !trimmed.endsWith(");")) {
        semicolons++
      } else if (trimmed.length > 0 && !trimmed.endsWith("{") && !trimmed.endsWith("}") && !trimmed.endsWith(",") && !trimmed.endsWith("(")) {
        noSemicolons++
      }
    }

    // Quotes
    const singleCount = (file.content.match(/(?<!=)'/g) ?? []).length
    const doubleCount = (file.content.match(/(?<!=)"/g) ?? []).length
    singleQuotes += singleCount
    doubleQuotes += doubleCount

    // Trailing commas
    const trailingCount = (file.content.match(/,\s*[\])}]/g) ?? []).length
    const noTrailingCount = (file.content.match(/[^,\s]\s*[\])}]/g) ?? []).length
    trailingComma += trailingCount
    noTrailingComma += noTrailingCount

    // Indentation
    for (const line of lines) {
      if (line.startsWith("\t")) tabs++
      else if (line.startsWith("  ")) {
        spaces++
        const match = line.match(/^( +)/)
        if (match) {
          const size = match[1].length
          indentSizes.set(size, (indentSizes.get(size) ?? 0) + 1)
        }
      }
    }
  }

  const totalLines = semicolons + noSemicolons
  const totalQuotes = singleQuotes + doubleQuotes
  const totalTrailing = trailingComma + noTrailingComma
  const totalIndent = tabs + spaces

  const bestIndentSize = [...indentSizes.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 2

  return {
    semicolons: semicolons > noSemicolons,
    quotes: singleQuotes > doubleQuotes ? "single" : doubleQuotes > singleQuotes ? "double" : "mixed",
    trailingComma: trailingComma > noTrailingComma,
    indentStyle: tabs > spaces ? "tabs" : "spaces",
    indentSize: bestIndentSize,
    confidence: totalLines > 0 ? Math.max(semicolons, noSemicolons) / totalLines : 0,
  }
}

function detectArchitecture(dir: string, files: string[]): ArchitectureConventions {
  const relativeFiles = files.map((f) => path.relative(dir, f))
  const hasSrcDir = relativeFiles.some((f) => f.startsWith("src/"))
  const hasTestDir = relativeFiles.some((f) => f.startsWith("test/") || f.startsWith("tests/"))
  const hasLibDir = relativeFiles.some((f) => f.startsWith("lib/"))
  const hasPackagesDir = relativeFiles.some((f) => f.startsWith("packages/"))

  // Feature-based: files organized by feature (e.g., user/user.ts, user/user.test.ts)
  const dirs = new Set(relativeFiles.map((f) => path.dirname(f).split("/")[0]))
  const featureDirs = [...dirs].filter((d) => {
    const dirFiles = relativeFiles.filter((f) => f.startsWith(d + "/"))
    return dirFiles.length > 2 // Multiple files in same directory = feature
  })

  let pattern: ArchitectureConventions["pattern"] = "flat"
  if (hasPackagesDir) pattern = "monorepo"
  else if (featureDirs.length > 3) pattern = "feature-based"
  else if (hasSrcDir && hasLibDir) pattern = "layered"
  else if (hasSrcDir) pattern = "clean"

  return {
    pattern,
    srcDir: hasSrcDir,
    testDir: hasTestDir,
    confidence: 0.7, // Architecture is harder to detect with high confidence
  }
}

// ─── Main Convention Extraction ──────────────────────────────────────────────

export class Conventions {
  private projectPath: string

  constructor(projectPath: string) {
    this.projectPath = projectPath
  }

  /**
   * Analyze the project and extract conventions.
   */
  async analyze(): Promise<ProjectConventions> {
    // Collect code files
    const files = await collectFiles(this.projectPath, CODE_EXTENSIONS, SAMPLE_SIZE)

    // Read all files
    const fileContents: Array<{ path: string; content: string }> = []
    for (const filePath of files) {
      const content = await readFileSafe(filePath)
      if (content) {
        fileContents.push({ path: filePath, content })
      }
    }

    // Extract all naming samples
    const allFunctions: string[] = []
    const allVariables: string[] = []
    const allClasses: string[] = []
    const allInterfaces: string[] = []
    const allConstants: string[] = []

    for (const file of fileContents) {
      allFunctions.push(...extractFunctions(file.content))
      allVariables.push(...extractVariables(file.content))
      allClasses.push(...extractClasses(file.content))
      allInterfaces.push(...extractInterfaces(file.content))
      allConstants.push(...extractConstants(file.content))
    }

    // Extract file names (without extension)
    const fileNames = files.map((f) => path.basename(f).replace(/\.[^.]+$/, ""))

    // Detect component names (PascalCase files that might be React components)
    const componentNames = fileNames.filter((n) => /^[A-Z][a-zA-Z0-9]+$/.test(n))

    // Run all detectors
    const naming: NamingConventions = {
      functions: detectNamingPattern(allFunctions),
      variables: detectNamingPattern(allVariables),
      files: detectNamingPattern(fileNames),
      components: detectNamingPattern(componentNames),
      classes: detectNamingPattern(allClasses),
      constants: detectNamingPattern(allConstants),
      interfaces: detectNamingPattern(allInterfaces),
    }

    const imports = detectImports(fileContents)
    const errorHandling = detectErrorHandling(fileContents)
    const testing = detectTesting(fileContents)
    const formatting = detectFormatting(fileContents)
    const architecture = detectArchitecture(this.projectPath, files)

    return {
      naming,
      imports,
      errorHandling,
      testing,
      formatting,
      architecture,
      detectedAt: new Date().toISOString(),
      filesAnalyzed: fileContents.length,
    }
  }

  /**
   * Convert conventions to a human-readable markdown format for memory storage.
   */
  static toMarkdown(conventions: ProjectConventions): string {
    const lines: string[] = [
      "# Project Conventions (Auto-Detected)",
      "",
      `> Analyzed ${conventions.filesAnalyzed} files on ${conventions.detectedAt}`,
      "",
    ]

    // Naming
    lines.push("## Naming Conventions")
    lines.push("")
    const namingEntries = Object.entries(conventions.naming) as [string, PatternDetection][]
    for (const [key, detection] of namingEntries) {
      if (detection.pattern !== "unknown") {
        const conf = Math.round(detection.confidence * 100)
        lines.push(`- **${key}:** ${detection.pattern} (${conf}% confidence, ${detection.samples} samples)`)
      }
    }
    lines.push("")

    // Imports
    lines.push("## Import Style")
    lines.push("")
    lines.push(`- **Style:** ${conventions.imports.style} (${Math.round(conventions.imports.confidence * 100)}% confidence)`)
    lines.push(`- **Sorting:** ${conventions.imports.sorting}`)
    lines.push("")

    // Error Handling
    lines.push("## Error Handling")
    lines.push("")
    lines.push(`- **Pattern:** ${conventions.errorHandling.pattern} (${Math.round(conventions.errorHandling.confidence * 100)}% confidence)`)
    if (conventions.errorHandling.customErrorClass) {
      lines.push(`- **Custom Error Class:** ${conventions.errorHandling.customErrorClass}`)
    }
    lines.push("")

    // Testing
    lines.push("## Testing")
    lines.push("")
    lines.push(`- **Framework:** ${conventions.testing.framework}`)
    lines.push(`- **Pattern:** ${conventions.testing.pattern}`)
    lines.push(`- **Assertion:** ${conventions.testing.assertion}`)
    lines.push(`- **Co-located:** ${conventions.testing.coLocated ? "Yes" : "No"}`)
    lines.push("")

    // Formatting
    lines.push("## Formatting")
    lines.push("")
    lines.push(`- **Semicolons:** ${conventions.formatting.semicolons ? "Yes" : "No"}`)
    lines.push(`- **Quotes:** ${conventions.formatting.quotes}`)
    lines.push(`- **Trailing commas:** ${conventions.formatting.trailingComma ? "Yes" : "No"}`)
    lines.push(`- **Indentation:** ${conventions.formatting.indentStyle === "tabs" ? "Tabs" : `${conventions.formatting.indentSize} spaces`}`)
    lines.push("")

    // Architecture
    lines.push("## Architecture")
    lines.push("")
    lines.push(`- **Pattern:** ${conventions.architecture.pattern}`)
    lines.push(`- **src/ directory:** ${conventions.architecture.srcDir ? "Yes" : "No"}`)
    lines.push(`- **test/ directory:** ${conventions.architecture.testDir ? "Yes" : "No"}`)
    lines.push("")

    return lines.join("\n")
  }

  /**
   * Convert conventions to a concise system prompt injection.
   */
  static toPromptInjection(conventions: ProjectConventions): string {
    const lines: string[] = [
      "# Project Conventions (Auto-Detected)",
      "",
      "Follow these conventions when writing code for this project:",
      "",
    ]

    const n = conventions.naming
    if (n.functions.pattern !== "unknown") {
      lines.push(`- Use ${n.functions.pattern} for function names`)
    }
    if (n.variables.pattern !== "unknown") {
      lines.push(`- Use ${n.variables.pattern} for variable names`)
    }
    if (n.files.pattern !== "unknown") {
      lines.push(`- Use ${n.files.pattern} for file names`)
    }
    if (n.classes.pattern !== "unknown") {
      lines.push(`- Use ${n.classes.pattern} for class names`)
    }

    if (conventions.imports.style !== "mixed") {
      lines.push(`- Use ${conventions.imports.style} imports`)
    }

    if (conventions.errorHandling.pattern !== "mixed") {
      lines.push(`- Use ${conventions.errorHandling.pattern} for error handling`)
    }

    if (conventions.testing.framework !== "unknown") {
      lines.push(`- Use ${conventions.testing.framework} for testing`)
    }

    lines.push(`- ${conventions.formatting.semicolons ? "Use" : "Omit"} semicolons`)
    lines.push(`- Use ${conventions.formatting.quotes} quotes`)

    return lines.join("\n")
  }
}
