/**
 * EVOLVE Memory Consolidation
 *
 * Periodically cleans up, merges, and improves stored memories.
 * Like how humans consolidate memories during sleep.
 *
 * Inspired by: Mem0 consolidation pipeline, human memory consolidation
 */

import { Memory, type MemoryEntry, type MemoryCategory } from "./memory"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ConsolidationResult {
  entriesProcessed: number
  entriesMerged: number
  entriesPruned: number
  entriesBoosted: number
  categoriesAffected: MemoryCategory[]
}

export interface ConsolidationOptions {
  /** Minimum similarity score to merge entries (0-1) */
  mergeThreshold?: number
  /** Minimum confidence to keep entries */
  minConfidence?: number
  /** Maximum age in days before pruning */
  maxAgeDays?: number
  /** Whether to run in dry-run mode (no actual changes) */
  dryRun?: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Simple text similarity using Jaccard index on word sets.
 */
function textSimilarity(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().split(/\s+/).filter((w) => w.length > 2))
  const wordsB = new Set(b.toLowerCase().split(/\s+/).filter((w) => w.length > 2))

  if (wordsA.size === 0 || wordsB.size === 0) return 0

  let intersection = 0
  for (const word of wordsA) {
    if (wordsB.has(word)) intersection++
  }

  const union = new Set([...wordsA, ...wordsB]).size
  return union === 0 ? 0 : intersection / union
}

/**
 * Extract the core message from a memory entry (strip metadata, etc.)
 */
function extractCoreMessage(content: string): string {
  return content
    .replace(/\*\*[^*]+\*\*/g, "") // Remove bold markers
    .replace(/^[-*]\s+/gm, "") // Remove list markers
    .replace(/\n+/g, " ") // Collapse newlines
    .trim()
    .substring(0, 500) // Limit length
}

// ─── Consolidator Class ──────────────────────────────────────────────────────

export class Consolidator {
  private memory: Memory

  constructor(memory: Memory) {
    this.memory = memory
  }

  /**
   * Run the full consolidation pipeline.
   */
  async consolidate(options: ConsolidationOptions = {}): Promise<ConsolidationResult> {
    const mergeThreshold = options.mergeThreshold ?? 0.7
    const minConfidence = options.minConfidence ?? 0.15
    const maxAgeDays = options.maxAgeDays ?? 90
    const dryRun = options.dryRun ?? false

    let entriesProcessed = 0
    let entriesMerged = 0
    let entriesPruned = 0
    let entriesBoosted = 0
    const categoriesAffected = new Set<MemoryCategory>()

    const allCategories: MemoryCategory[] = [
      "convention",
      "debugging",
      "preference",
      "architecture",
      "tool",
      "reflection",
      "skill",
    ]

    for (const category of allCategories) {
      const entries = this.memory.getEntries(category)
      if (entries.length === 0) continue

      categoriesAffected.add(category)
      entriesProcessed += entries.length

      // Step 1: Find and merge duplicate entries
      const merged = this.findDuplicates(entries, mergeThreshold)
      if (merged.toMerge.length > 0) {
        entriesMerged += merged.toMerge.length
        if (!dryRun) {
          for (const mergeGroup of merged.toMerge) {
            await this.mergeEntries(mergeGroup, category)
          }
        }
      }

      // Step 2: Boost confidence for entries that appear multiple times
      const boosted = this.findRepeatedEntries(entries)
      entriesBoosted += boosted.length
      if (!dryRun) {
        for (const entry of boosted) {
          await this.memory.boostConfidence(entry.id, 0.1)
        }
      }

      // Step 3: Prune low-confidence and old entries
      const pruned = this.findPrunable(entries, minConfidence, maxAgeDays)
      entriesPruned += pruned.length
      if (!dryRun) {
        for (const entry of pruned) {
          await this.memory.remove(entry.id)
        }
      }
    }

    return {
      entriesProcessed,
      entriesMerged,
      entriesPruned,
      entriesBoosted,
      categoriesAffected: Array.from(categoriesAffected),
    }
  }

  /**
   * Find duplicate entries that should be merged.
   */
  private findDuplicates(
    entries: MemoryEntry[],
    threshold: number,
  ): { toMerge: MemoryEntry[][] } {
    const toMerge: MemoryEntry[][] = []
    const processed = new Set<string>()

    for (let i = 0; i < entries.length; i++) {
      if (processed.has(entries[i].id)) continue

      const group: MemoryEntry[] = [entries[i]]
      const coreI = extractCoreMessage(entries[i].content)

      for (let j = i + 1; j < entries.length; j++) {
        if (processed.has(entries[j].id)) continue

        const coreJ = extractCoreMessage(entries[j].content)
        const similarity = textSimilarity(coreI, coreJ)

        if (similarity >= threshold) {
          group.push(entries[j])
          processed.add(entries[j].id)
        }
      }

      if (group.length > 1) {
        toMerge.push(group)
        processed.add(entries[i].id)
      }
    }

    return { toMerge }
  }

  /**
   * Find entries with similar content that appear multiple times (confidence boost).
   */
  private findRepeatedEntries(entries: MemoryEntry[]): MemoryEntry[] {
    const contentCounts = new Map<string, MemoryEntry[]>()

    for (const entry of entries) {
      const core = extractCoreMessage(entry.content).substring(0, 100)
      const existing = contentCounts.get(core) ?? []
      existing.push(entry)
      contentCounts.set(core, existing)
    }

    const repeated: MemoryEntry[] = []
    for (const group of contentCounts.values()) {
      if (group.length > 1) {
        // Boost the one with highest confidence
        const best = group.sort((a, b) => b.confidence - a.confidence)[0]
        repeated.push(best)
      }
    }

    return repeated
  }

  /**
   * Find entries that should be pruned.
   */
  private findPrunable(
    entries: MemoryEntry[],
    minConfidence: number,
    maxAgeDays: number,
  ): MemoryEntry[] {
    const now = Date.now()
    const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000

    return entries.filter((entry) => {
      // Prune low confidence
      if (entry.confidence < minConfidence) return true

      // Prune old entries
      const age = now - new Date(entry.timestamp).getTime()
      if (age > maxAgeMs) return true

      return false
    })
  }

  /**
   * Merge a group of duplicate entries into one.
   */
  private async mergeEntries(group: MemoryEntry[], category: MemoryCategory): Promise<void> {
    if (group.length < 2) return

    // Sort by confidence (highest first)
    group.sort((a, b) => b.confidence - a.confidence)

    // Keep the best entry, remove the rest
    const best = group[0]

    // Merge tags
    const allTags = new Set<string>()
    for (const entry of group) {
      if (entry.tags) {
        for (const tag of entry.tags) {
          allTags.add(tag)
        }
      }
    }

    // Update the best entry
    best.tags = Array.from(allTags)
    best.confidence = Math.min(1.0, best.confidence + 0.1) // Boost for being confirmed

    // Remove the rest
    for (let i = 1; i < group.length; i++) {
      await this.memory.remove(group[i].id)
    }
  }

  /**
   * Generate a consolidation report (for debugging/user info).
   */
  static formatReport(result: ConsolidationResult): string {
    const lines: string[] = [
      "# Memory Consolidation Report",
      "",
      `- **Entries processed:** ${result.entriesProcessed}`,
      `- **Entries merged:** ${result.entriesMerged}`,
      `- **Entries pruned:** ${result.entriesPruned}`,
      `- **Entries boosted:** ${result.entriesBoosted}`,
      `- **Categories affected:** ${result.categoriesAffected.join(", ")}`,
      "",
    ]

    if (result.entriesMerged === 0 && result.entriesPruned === 0) {
      lines.push("No consolidation needed. Memories are clean.")
    } else {
      lines.push("Consolidation complete.")
    }

    return lines.join("\n")
  }
}
