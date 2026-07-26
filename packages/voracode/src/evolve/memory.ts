/**
 * EVOLVE Memory System
 *
 * Structured auto-memory that persists lessons across sessions.
 * Stores conventions, debugging insights, preferences, and reflections
 * as markdown files in .voracode/memory/
 *
 * Inspired by: Claude Code auto-memory, Mem0, MemGPT/Letta
 */

import * as fs from "fs/promises"
import * as path from "path"

// ─── Types ───────────────────────────────────────────────────────────────────

export type MemoryCategory =
  | "convention"
  | "debugging"
  | "preference"
  | "architecture"
  | "tool"
  | "reflection"
  | "skill"

export type MemorySource = "explicit" | "inferred"

export interface MemoryEntry {
  id: string
  timestamp: string // ISO 8601
  category: MemoryCategory
  content: string
  confidence: number // 0.0 - 1.0
  source: MemorySource
  context?: string // When/where this was learned
  tags?: string[]
}

export interface MemoryIndex {
  version: number
  projectPath: string
  lastUpdated: string
  entryCount: number
  categories: Record<MemoryCategory, number>
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MEMORY_DIR = ".voracode/memory"
const INDEX_FILE = "index.json"
const CATEGORY_FILES: Record<MemoryCategory, string> = {
  convention: "conventions.md",
  debugging: "debugging.md",
  preference: "preferences.md",
  architecture: "architecture.md",
  tool: "tools.md",
  reflection: "reflections.md",
  skill: "skills.md",
}

const MAX_ENTRIES_PER_CATEGORY = 200
const MIN_CONFIDENCE = 0.1
const ID_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateId(): string {
  let id = ""
  for (let i = 0; i < 8; i++) {
    id += ID_ALPHABET[Math.floor(Math.random() * ID_ALPHABET.length)]
  }
  return id
}

function ensureDir(dir: string): Promise<void> {
  return fs.mkdir(dir, { recursive: true })
}

// ─── Memory Class ────────────────────────────────────────────────────────────

export class Memory {
  private projectPath: string
  private memoryDir: string
  private entries: Map<MemoryCategory, MemoryEntry[]> = new Map()
  private loaded = false

  constructor(projectPath: string) {
    this.projectPath = projectPath
    this.memoryDir = path.join(projectPath, MEMORY_DIR)
  }

  // ── Initialization ──────────────────────────────────────────────────────

  /**
   * Initialize the memory system. Creates directories if needed.
   */
  async init(): Promise<void> {
    await ensureDir(this.memoryDir)

    // Initialize category maps
    for (const category of Object.keys(CATEGORY_FILES) as MemoryCategory[]) {
      this.entries.set(category, [])
    }

    // Load existing memories
    await this.load()
    this.loaded = true
  }

  /**
   * Load all memory entries from disk.
   */
  private async load(): Promise<void> {
    for (const [category, filename] of Object.entries(CATEGORY_FILES) as [MemoryCategory, string][]) {
      const filePath = path.join(this.memoryDir, filename)
      try {
        const content = await fs.readFile(filePath, "utf-8")
        const entries = this.parseMarkdownEntries(content, category)
        this.entries.set(category, entries)
      } catch {
        // File doesn't exist yet — that's fine
      }
    }
  }

  /**
   * Parse memory entries from a markdown file.
   * Format: Each entry is a section starting with ### and containing metadata.
   */
  private parseMarkdownEntries(content: string, category: MemoryCategory): MemoryEntry[] {
    const entries: MemoryEntry[] = []
    const sections = content.split(/^### /m).filter(Boolean)

    for (const section of sections) {
      const lines = section.trim().split("\n")
      if (lines.length < 2) continue

      // Parse the header line for metadata
      const headerLine = lines[0]
      const idMatch = headerLine.match(/\{id:([a-z0-9]+)\}/)
      const confMatch = headerLine.match(/\{conf:([0-9.]+)\}/)
      const srcMatch = headerLine.match(/\{src:(explicit|inferred)\}/)
      const tsMatch = headerLine.match(/\{ts:([^}]+)\}/)
      const tagsMatch = headerLine.match(/\{tags:([^}]+)\}/)

      if (!idMatch) continue

      const contentLines = lines.slice(1).filter((l) => !l.startsWith("<!--"))
      const entryContent = contentLines.join("\n").trim()

      if (!entryContent) continue

      entries.push({
        id: idMatch[1],
        timestamp: tsMatch ? tsMatch[1] : new Date().toISOString(),
        category,
        content: entryContent,
        confidence: confMatch ? parseFloat(confMatch[1]) : 0.5,
        source: srcMatch ? (srcMatch[1] as MemorySource) : "inferred",
        tags: tagsMatch ? tagsMatch[1].split(",").map((t) => t.trim()) : undefined,
      })
    }

    return entries
  }

  // ── Read Operations ─────────────────────────────────────────────────────

  /**
   * Get all entries for a category.
   */
  getEntries(category: MemoryCategory): MemoryEntry[] {
    return this.entries.get(category) ?? []
  }

  /**
   * Get all entries across all categories.
   */
  getAllEntries(): MemoryEntry[] {
    const all: MemoryEntry[] = []
    for (const entries of this.entries.values()) {
      all.push(...entries)
    }
    return all
  }

  /**
   * Get entries sorted by confidence (highest first).
   */
  getTopEntries(category: MemoryCategory, limit: number = 10): MemoryEntry[] {
    return this.getEntries(category)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit)
  }

  /**
   * Search entries by keyword in content.
   */
  search(query: string): MemoryEntry[] {
    const lowerQuery = query.toLowerCase()
    return this.getAllEntries().filter((e) => e.content.toLowerCase().includes(lowerQuery))
  }

  /**
   * Get the memory index (summary stats).
   */
  getIndex(): MemoryIndex {
    const categories: Record<string, number> = {}
    for (const [category, entries] of this.entries.entries()) {
      categories[category] = entries.length
    }
    return {
      version: 1,
      projectPath: this.projectPath,
      lastUpdated: new Date().toISOString(),
      entryCount: this.getAllEntries().length,
      categories: categories as Record<MemoryCategory, number>,
    }
  }

  // ── Write Operations ────────────────────────────────────────────────────

  /**
   * Add a new memory entry.
   * Validates input and sanitizes content.
   */
  async add(
    category: MemoryCategory,
    content: string,
    options: {
      confidence?: number
      source?: MemorySource
      context?: string
      tags?: string[]
    } = {},
  ): Promise<MemoryEntry> {
    // Validate and sanitize inputs
    if (!content || typeof content !== "string") {
      throw new Error("Memory content must be a non-empty string")
    }

    const sanitizedContent = content
      .substring(0, 5000) // Max 5000 chars per entry
      .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "") // Remove control characters

    const confidence = Math.max(0, Math.min(1, options.confidence ?? 0.5))

    const sanitizedTags = options.tags
      ?.filter((t) => typeof t === "string" && t.length > 0 && t.length < 50)
      .map((t) => t.toLowerCase().trim())
      .slice(0, 10) // Max 10 tags

    const entry: MemoryEntry = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      category,
      content: sanitizedContent,
      confidence,
      source: options.source ?? "inferred",
      context: options.context?.substring(0, 500),
      tags: sanitizedTags,
    }

    const entries = this.entries.get(category) ?? []
    entries.push(entry)
    this.entries.set(category, entries)

    await this.persistCategory(category)
    await this.updateIndex()

    return entry
  }

  /**
   * Update an existing entry's confidence (e.g., after repeated observation).
   */
  async boostConfidence(id: string, amount: number = 0.1): Promise<void> {
    for (const [category, entries] of this.entries.entries()) {
      const entry = entries.find((e) => e.id === id)
      if (entry) {
        entry.confidence = Math.min(1.0, entry.confidence + amount)
        await this.persistCategory(category)
        return
      }
    }
  }

  /**
   * Remove an entry by ID.
   */
  async remove(id: string): Promise<boolean> {
    for (const [category, entries] of this.entries.entries()) {
      const index = entries.findIndex((e) => e.id === id)
      if (index !== -1) {
        entries.splice(index, 1)
        this.entries.set(category, entries)
        await this.persistCategory(category)
        await this.updateIndex()
        return true
      }
    }
    return false
  }

  /**
   * Prune low-confidence and old entries.
   */
  async prune(options: { minConfidence?: number; maxAgeDays?: number } = {}): Promise<number> {
    const minConf = options.minConfidence ?? MIN_CONFIDENCE
    const maxAgeMs = (options.maxAgeDays ?? 90) * 24 * 60 * 60 * 1000
    const now = Date.now()
    let pruned = 0

    for (const [category, entries] of this.entries.entries()) {
      const filtered = entries.filter((e) => {
        if (e.confidence < minConf) {
          pruned++
          return false
        }
        const age = now - new Date(e.timestamp).getTime()
        if (age > maxAgeMs) {
          pruned++
          return false
        }
        return true
      })
      this.entries.set(category, filtered)
    }

    // Persist all categories
    for (const category of this.entries.keys()) {
      await this.persistCategory(category)
    }
    await this.updateIndex()

    return pruned
  }

  // ── Persistence ─────────────────────────────────────────────────────────

  /**
   * Persist a category to its markdown file.
   */
  private async persistCategory(category: MemoryCategory): Promise<void> {
    const entries = this.entries.get(category) ?? []
    const filename = CATEGORY_FILES[category]
    const filePath = path.join(this.memoryDir, filename)

    // Enforce max entries per category
    const sorted = entries.sort((a, b) => b.confidence - a.confidence).slice(0, MAX_ENTRIES_PER_CATEGORY)
    this.entries.set(category, sorted)

    const markdown = this.entriesToMarkdown(sorted, category)
    await fs.writeFile(filePath, markdown, "utf-8")
  }

  /**
   * Convert entries to markdown format.
   */
  private entriesToMarkdown(entries: MemoryEntry[], category: MemoryCategory): string {
    const header = `# ${category.charAt(0).toUpperCase() + category.slice(1)} Memories\n\n` + `> Auto-generated by Voracode Evolve. Edit with care.\n\n`

    const sections = entries.map((entry) => {
      const meta = `{id:${entry.id}} {conf:${entry.confidence.toFixed(2)}} {src:${entry.source}} {ts:${entry.timestamp}}${entry.tags ? ` {tags:${entry.tags.join(",")}}` : ""}`
      return `### ${meta}\n${entry.content}\n`
    })

    return header + sections.join("\n")
  }

  /**
   * Update the index file.
   */
  private async updateIndex(): Promise<void> {
    const index = this.getIndex()
    const indexPath = path.join(this.memoryDir, INDEX_FILE)
    await fs.writeFile(indexPath, JSON.stringify(index, null, 2), "utf-8")
  }

  // ── Context Generation ──────────────────────────────────────────────────

  /**
   * Generate a context string for injection into the system prompt.
   * This is what the LLM sees at session start.
   */
  toContext(maxEntries: number = 50): string {
    const allEntries = this.getAllEntries()
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxEntries)

    if (allEntries.length === 0) return ""

    const lines: string[] = [
      "# Project Memory (Auto-Learned)",
      "",
      "The following memories were learned from previous sessions in this project.",
      "Use them to provide better, more consistent assistance.",
      "",
    ]

    // Group by category
    const grouped = new Map<MemoryCategory, MemoryEntry[]>()
    for (const entry of allEntries) {
      const existing = grouped.get(entry.category) ?? []
      existing.push(entry)
      grouped.set(entry.category, existing)
    }

    for (const [category, entries] of grouped) {
      lines.push(`## ${category.charAt(0).toUpperCase() + category.slice(1)}`)
      lines.push("")
      for (const entry of entries) {
        const conf = Math.round(entry.confidence * 100)
        lines.push(`- [${conf}%] ${entry.content}`)
      }
      lines.push("")
    }

    return lines.join("\n")
  }
}
