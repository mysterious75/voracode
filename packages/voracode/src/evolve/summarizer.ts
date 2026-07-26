/**
 * EVOLVE Context Summarization
 *
 * Handles the "context too big" problem by summarizing and compressing
 * learned context when it exceeds token limits.
 *
 * Problem: As memory grows, injecting all of it into the system prompt
 * wastes tokens and can cause "context rot" (AI gets confused by too much info).
 *
 * Solution: Summarize, prioritize, and compress context before injection.
 */

import { Memory, type MemoryEntry, type MemoryCategory } from "./memory"
import { SkillLibrary } from "./skills"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SummarizedContext {
  /** High-priority entries (confidence > 0.7, recent) */
  priority: string
  /** Medium-priority entries (confidence 0.4-0.7) */
  standard: string
  /** Low-priority entries (confidence < 0.4) — only included if space allows */
  low: string
  /** Total estimated tokens */
  totalTokens: number
  /** Whether any entries were omitted due to space constraints */
  truncated: boolean
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CHARS_PER_TOKEN = 4 // Rough estimate
const DEFAULT_MAX_TOKENS = 2000 // Default max tokens for Evolve context
const PRIORITY_TOKEN_RATIO = 0.5 // 50% of budget for priority
const STANDARD_TOKEN_RATIO = 0.35 // 35% for standard
const LOW_TOKEN_RATIO = 0.15 // 15% for low priority

// ─── Summarizer ──────────────────────────────────────────────────────────────

/**
 * Summarize and compress memory entries to fit within a token budget.
 *
 * @param memory - The memory instance
 * @param skills - Optional skill library
 * @param maxTokens - Maximum tokens to use (default: 2000)
 * @param query - Optional query to prioritize relevant entries
 */
export function summarizeContext(
  memory: Memory,
  skills?: SkillLibrary,
  maxTokens: number = DEFAULT_MAX_TOKENS,
  query?: string,
): SummarizedContext {
  const maxChars = maxTokens * CHARS_PER_TOKEN
  const priorityBudget = Math.floor(maxChars * PRIORITY_TOKEN_RATIO)
  const standardBudget = Math.floor(maxChars * STANDARD_TOKEN_RATIO)
  const lowBudget = Math.floor(maxChars * LOW_TOKEN_RATIO)

  // Get all entries sorted by relevance
  const allEntries = memory.getAllEntries()

  // Score entries by relevance to query
  const scored = allEntries.map((entry) => {
    let score = entry.confidence

    // Boost recent entries
    const age = Date.now() - new Date(entry.timestamp).getTime()
    const daysSince = age / (1000 * 60 * 60 * 24)
    if (daysSince < 7) score += 0.2
    else if (daysSince < 30) score += 0.1

    // Boost query-relevant entries
    if (query) {
      const lowerQuery = query.toLowerCase()
      const lowerContent = entry.content.toLowerCase()
      const queryWords = lowerQuery.split(/\s+/).filter((w) => w.length > 2)

      for (const word of queryWords) {
        if (lowerContent.includes(word)) {
          score += 0.15
        }
      }

      // Category-specific boosts
      if (lowerQuery.includes("error") && entry.category === "debugging") score += 0.2
      if (lowerQuery.includes("style") && entry.category === "convention") score += 0.2
      if (lowerQuery.includes("prefer") && entry.category === "preference") score += 0.2
    }

    return { entry, score }
  })

  // Sort by score
  scored.sort((a, b) => b.score - a.score)

  // Categorize by priority
  const priorityEntries: MemoryEntry[] = []
  const standardEntries: MemoryEntry[] = []
  const lowEntries: MemoryEntry[] = []

  for (const { entry, score } of scored) {
    if (score > 0.7 || entry.confidence > 0.7) {
      priorityEntries.push(entry)
    } else if (score > 0.4 || entry.confidence > 0.4) {
      standardEntries.push(entry)
    } else {
      lowEntries.push(entry)
    }
  }

  // Generate summaries within budget
  const priority = summarizeEntries(priorityEntries, priorityBudget)
  const standard = summarizeEntries(standardEntries, standardBudget)
  const low = summarizeEntries(lowEntries, lowBudget)

  const totalChars = priority.length + standard.length + low.length
  const totalTokens = Math.ceil(totalChars / CHARS_PER_TOKEN)

  return {
    priority,
    standard,
    low,
    totalTokens,
    truncated: totalChars >= maxChars,
  }
}

/**
 * Summarize entries to fit within a character budget.
 * Uses aggressive summarization for entries that don't fit.
 */
function summarizeEntries(entries: MemoryEntry[], budget: number): string {
  if (entries.length === 0 || budget <= 0) return ""

  const lines: string[] = []
  let usedChars = 0

  for (const entry of entries) {
    // Compact format: just the content, no metadata
    const line = `- ${entry.content}`

    // Truncate individual entries if needed
    const maxLineLen = Math.min(line.length, budget - usedChars)
    if (maxLineLen <= 0) break

    const truncatedLine = maxLineLen < line.length
      ? line.substring(0, maxLineLen - 3) + "..."
      : line

    lines.push(truncatedLine)
    usedChars += truncatedLine.length + 1 // +1 for newline

    if (usedChars >= budget) break
  }

  return lines.join("\n")
}

/**
 * Generate a compressed context string for injection.
 * Prioritizes recent, high-confidence, query-relevant entries.
 */
export function generateCompressedContext(
  memory: Memory,
  skills?: SkillLibrary,
  maxTokens: number = DEFAULT_MAX_TOKENS,
  query?: string,
): string {
  const summary = summarizeContext(memory, skills, maxTokens, query)

  const sections: string[] = []

  if (summary.priority) {
    sections.push("## Key Learnings\n" + summary.priority)
  }

  if (summary.standard) {
    sections.push("## Additional Context\n" + summary.standard)
  }

  if (summary.low && !summary.truncated) {
    sections.push("## Background\n" + summary.low)
  }

  if (sections.length === 0) return ""

  const header = "# Project Knowledge (Auto-Learned)\n\n"
  const footer = summary.truncated ? "\n\n(Context compressed to fit token budget)" : ""

  return header + sections.join("\n\n") + footer
}
