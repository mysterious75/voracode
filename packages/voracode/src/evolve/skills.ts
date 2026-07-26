/**
 * EVOLVE Skill Library
 *
 * Stores successful code patterns as reusable, searchable skills.
 * Like Voyager's skill library — solutions are saved and retrieved for future tasks.
 *
 * Based on: Voyager (Wang et al., 2023) — open-ended learning agent with skill library
 */

import * as fs from "fs/promises"
import * as path from "path"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Skill {
  id: string
  name: string
  description: string
  trigger: string // Natural language description of when to use
  tags: string[]
  code: string
  context: string // What project/framework this was for
  language: string // Programming language
  successCount: number
  failCount: number
  lastUsed: string // ISO 8601
  createdAt: string // ISO 8601
  confidence: number // 0.0 - 1.0, based on success rate
  metadata?: Record<string, unknown>
}

export interface SkillSearchResult {
  skill: Skill
  score: number
  reason: string
}

export interface SkillIndex {
  version: number
  skillCount: number
  lastUpdated: string
  tagCloud: Record<string, number>
}

// ─── Constants ───────────────────────────────────────────────────────────────

const SKILLS_DIR = ".voracode/skills"
const INDEX_FILE = "index.json"
const MAX_SKILLS = 500
const MIN_CONFIDENCE = 0.2
const ID_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateId(): string {
  let id = ""
  for (let i = 0; i < 8; i++) {
    id += ID_ALPHABET[Math.floor(Math.random() * ID_ALPHABET.length)]
  }
  return id
}

function calculateConfidence(successCount: number, failCount: number): number {
  const total = successCount + failCount
  if (total === 0) return 0.5 // Default confidence
  return successCount / total
}

// ─── SkillLibrary Class ──────────────────────────────────────────────────────

export class SkillLibrary {
  private projectPath: string
  private skillsDir: string
  private skills: Map<string, Skill> = new Map()
  private loaded = false

  constructor(projectPath: string) {
    this.projectPath = projectPath
    this.skillsDir = path.join(projectPath, SKILLS_DIR)
  }

  // ── Initialization ──────────────────────────────────────────────────────

  async init(): Promise<void> {
    await fs.mkdir(this.skillsDir, { recursive: true })
    await this.load()
    this.loaded = true
  }

  private async load(): Promise<void> {
    try {
      const entries = await fs.readdir(this.skillsDir)
      for (const entry of entries) {
        if (entry === INDEX_FILE || !entry.endsWith(".json")) continue
        try {
          const content = await fs.readFile(path.join(this.skillsDir, entry), "utf-8")
          const skill = JSON.parse(content) as Skill
          this.skills.set(skill.id, skill)
        } catch {
          // Skip malformed files
        }
      }
    } catch {
      // Directory doesn't exist yet
    }
  }

  // ── CRUD Operations ─────────────────────────────────────────────────────

  /**
   * Add a new skill to the library.
   * Validates and sanitizes all inputs.
   */
  async add(params: {
    name: string
    description: string
    trigger: string
    tags: string[]
    code: string
    context: string
    language: string
  }): Promise<Skill> {
    // Validate required fields
    if (!params.name || typeof params.name !== "string") {
      throw new Error("Skill name must be a non-empty string")
    }
    if (!params.code || typeof params.code !== "string") {
      throw new Error("Skill code must be a non-empty string")
    }

    // Sanitize inputs
    const name = params.name.substring(0, 200).trim()
    const description = (params.description || "").substring(0, 1000).trim()
    const trigger = (params.trigger || "").substring(0, 500).trim()
    const code = params.code.substring(0, 50000) // Max 50KB per skill
    const context = (params.context || "").substring(0, 500).trim()
    const language = (params.language || "unknown").substring(0, 50).trim()

    const tags = (params.tags || [])
      .filter((t) => typeof t === "string" && t.length > 0 && t.length < 50)
      .map((t) => t.toLowerCase().trim())
      .slice(0, 20) // Max 20 tags

    const skill: Skill = {
      id: generateId(),
      name,
      description,
      trigger,
      tags,
      code,
      context,
      language,
      successCount: 0,
      failCount: 0,
      lastUsed: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      confidence: 0.5,
    }

    this.skills.set(skill.id, skill)
    await this.persistSkill(skill)
    await this.updateIndex()

    return skill
  }

  /**
   * Get a skill by ID.
   */
  get(id: string): Skill | undefined {
    return this.skills.get(id)
  }

  /**
   * Get all skills.
   */
  getAll(): Skill[] {
    return Array.from(this.skills.values())
  }

  /**
   * Update a skill.
   */
  async update(id: string, updates: Partial<Skill>): Promise<Skill | null> {
    const skill = this.skills.get(id)
    if (!skill) return null

    Object.assign(skill, updates)
    skill.confidence = calculateConfidence(skill.successCount, skill.failCount)

    this.skills.set(id, skill)
    await this.persistSkill(skill)

    return skill
  }

  /**
   * Delete a skill.
   */
  async delete(id: string): Promise<boolean> {
    const skill = this.skills.get(id)
    if (!skill) return false

    this.skills.delete(id)
    try {
      await fs.unlink(path.join(this.skillsDir, `${id}.json`))
    } catch {
      // File might not exist
    }
    await this.updateIndex()

    return true
  }

  // ── Usage Tracking ──────────────────────────────────────────────────────

  /**
   * Record a successful use of a skill.
   */
  async recordSuccess(id: string): Promise<void> {
    const skill = this.skills.get(id)
    if (!skill) return

    skill.successCount++
    skill.lastUsed = new Date().toISOString()
    skill.confidence = calculateConfidence(skill.successCount, skill.failCount)

    await this.persistSkill(skill)
  }

  /**
   * Record a failed use of a skill.
   */
  async recordFailure(id: string): Promise<void> {
    const skill = this.skills.get(id)
    if (!skill) return

    skill.failCount++
    skill.lastUsed = new Date().toISOString()
    skill.confidence = calculateConfidence(skill.successCount, skill.failCount)

    await this.persistSkill(skill)
  }

  // ── Search & Retrieval ──────────────────────────────────────────────────

  /**
   * Search skills by natural language query.
   * Uses keyword matching and tag overlap for scoring.
   */
  search(query: string, options: { limit?: number; minConfidence?: number } = {}): SkillSearchResult[] {
    const limit = options.limit ?? 10
    const minConf = options.minConfidence ?? MIN_CONFIDENCE
    const lowerQuery = query.toLowerCase()
    const queryWords = lowerQuery.split(/\s+/).filter((w) => w.length > 2)

    const results: SkillSearchResult[] = []

    for (const skill of this.skills.values()) {
      if (skill.confidence < minConf) continue

      let score = 0
      const reasons: string[] = []

      // Exact trigger match
      if (skill.trigger.toLowerCase().includes(lowerQuery)) {
        score += 10
        reasons.push("trigger match")
      }

      // Name match
      if (skill.name.toLowerCase().includes(lowerQuery)) {
        score += 5
        reasons.push("name match")
      }

      // Description match
      if (skill.description.toLowerCase().includes(lowerQuery)) {
        score += 3
        reasons.push("description match")
      }

      // Tag overlap
      for (const tag of skill.tags) {
        if (lowerQuery.includes(tag.toLowerCase())) {
          score += 2
          reasons.push(`tag: ${tag}`)
        }
      }

      // Keyword overlap in code
      for (const word of queryWords) {
        if (skill.code.toLowerCase().includes(word)) {
          score += 1
        }
      }

      // Keyword overlap in trigger
      for (const word of queryWords) {
        if (skill.trigger.toLowerCase().includes(word)) {
          score += 1
        }
      }

      // Confidence bonus
      score *= 0.5 + skill.confidence * 0.5

      // Recency bonus (used recently = higher score)
      const daysSinceUse = (Date.now() - new Date(skill.lastUsed).getTime()) / (1000 * 60 * 60 * 24)
      if (daysSinceUse < 7) score *= 1.2
      else if (daysSinceUse < 30) score *= 1.1

      if (score > 0) {
        results.push({
          skill,
          score,
          reason: reasons.join(", "),
        })
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, limit)
  }

  /**
   * Search by tags.
   */
  searchByTags(tags: string[], limit: number = 10): Skill[] {
    const results: Array<{ skill: Skill; matches: number }> = []

    for (const skill of this.skills.values()) {
      let matches = 0
      for (const tag of tags) {
        if (skill.tags.includes(tag)) matches++
      }
      if (matches > 0) {
        results.push({ skill, matches })
      }
    }

    return results
      .sort((a, b) => b.matches - a.matches || b.skill.confidence - a.skill.confidence)
      .slice(0, limit)
      .map((r) => r.skill)
  }

  /**
   * Get the most used skills.
   */
  getMostUsed(limit: number = 10): Skill[] {
    return Array.from(this.skills.values())
      .sort((a, b) => b.successCount - a.successCount)
      .slice(0, limit)
  }

  /**
   * Get skills with highest confidence.
   */
  getMostReliable(limit: number = 10): Skill[] {
    return Array.from(this.skills.values())
      .filter((s) => s.successCount + s.failCount >= 3) // Need minimum usage
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit)
  }

  // ── Context Generation ──────────────────────────────────────────────────

  /**
   * Generate a context injection string with relevant skills for a task.
   */
  toContextInjection(taskDescription: string, maxSkills: number = 3): string {
    const results = this.search(taskDescription, { limit: maxSkills, minConfidence: 0.3 })

    if (results.length === 0) return ""

    const lines: string[] = [
      "# Relevant Skills (From Past Solutions)",
      "",
      "The following skills were learned from successful past tasks.",
      "Use them as reference when solving similar problems.",
      "",
    ]

    for (const result of results) {
      const skill = result.skill
      const conf = Math.round(skill.confidence * 100)
      lines.push(`## ${skill.name} (${conf}% confidence)`)
      lines.push(`> ${skill.description}`)
      lines.push(`> Used ${skill.successCount} times successfully`)
      lines.push("")
      lines.push("```" + skill.language)
      lines.push(skill.code)
      lines.push("```")
      lines.push("")
    }

    return lines.join("\n")
  }

  // ── Persistence ─────────────────────────────────────────────────────────

  private async persistSkill(skill: Skill): Promise<void> {
    const filePath = path.join(this.skillsDir, `${skill.id}.json`)
    await fs.writeFile(filePath, JSON.stringify(skill, null, 2), "utf-8")
  }

  private async updateIndex(): Promise<void> {
    const tagCloud: Record<string, number> = {}
    for (const skill of this.skills.values()) {
      for (const tag of skill.tags) {
        tagCloud[tag] = (tagCloud[tag] ?? 0) + 1
      }
    }

    const index: SkillIndex = {
      version: 1,
      skillCount: this.skills.size,
      lastUpdated: new Date().toISOString(),
      tagCloud,
    }

    const indexPath = path.join(this.skillsDir, INDEX_FILE)
    await fs.writeFile(indexPath, JSON.stringify(index, null, 2), "utf-8")
  }

  // ── Maintenance ─────────────────────────────────────────────────────────

  /**
   * Prune low-confidence and unused skills.
   */
  async prune(options: { minConfidence?: number; maxAgeDays?: number } = {}): Promise<number> {
    const minConf = options.minConfidence ?? MIN_CONFIDENCE
    const maxAgeMs = (options.maxAgeDays ?? 180) * 24 * 60 * 60 * 1000
    const now = Date.now()
    let pruned = 0

    for (const [id, skill] of this.skills) {
      const age = now - new Date(skill.lastUsed).getTime()

      if (skill.confidence < minConf || age > maxAgeMs) {
        this.skills.delete(id)
        try {
          await fs.unlink(path.join(this.skillsDir, `${id}.json`))
        } catch {}
        pruned++
      }
    }

    await this.updateIndex()
    return pruned
  }

  /**
   * Export all skills as a JSON array (for sharing).
   */
  async exportAll(): Promise<string> {
    return JSON.stringify(Array.from(this.skills.values()), null, 2)
  }

  /**
   * Import skills from a JSON string.
   */
  async importSkills(json: string): Promise<number> {
    const skills = JSON.parse(json) as Skill[]
    let imported = 0

    for (const skill of skills) {
      if (!this.skills.has(skill.id)) {
        this.skills.set(skill.id, skill)
        await this.persistSkill(skill)
        imported++
      }
    }

    if (imported > 0) {
      await this.updateIndex()
    }

    return imported
  }
}
