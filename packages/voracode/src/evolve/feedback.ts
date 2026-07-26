/**
 * EVOLVE Feedback Signal Collection
 *
 * Collects implicit and explicit signals about code quality from user behavior.
 * Analyzes git diffs, test results, lint output, and chat corrections.
 *
 * Inspired by: Mem0 extraction pipeline, Windsurf automated memories
 */

import * as fs from "fs/promises"
import * as path from "path"

// ─── Types ───────────────────────────────────────────────────────────────────

export type SignalType =
  | "edit-after"        // User modified AI-generated code shortly after
  | "kept"              // User kept AI code without changes
  | "deleted"           // User deleted AI-generated code
  | "test-pass"         // Tests passed for AI code
  | "test-fail"         // Tests failed for AI code
  | "lint-error"        // Lint errors in AI code
  | "type-error"        // Type errors in AI code
  | "user-correction"   // User said something was wrong
  | "user-approval"     // User said something was good
  | "revert"            // User reverted AI changes

export interface FeedbackSignal {
  id: string
  type: SignalType
  timestamp: string // ISO 8601
  taskId?: string
  file?: string
  details: string
  weight: number // -1.0 to 1.0
  metadata?: Record<string, unknown>
}

export interface SignalSummary {
  total: number
  positive: number
  negative: number
  byType: Record<SignalType, number>
  recentTrend: "improving" | "declining" | "stable"
}

// ─── Constants ───────────────────────────────────────────────────────────────

const SIGNALS_FILE = ".voracode/signals.jsonl"
const CORRECTION_PATTERNS = [
  /\b(that'?s? (wrong|incorrect|bad|not right))\b/i,
  /\b(don'?t|do not) (do|use|write|generate)\b/i,
  /\b(no|nah|nope|wrong)\b/i,
  /\b(try again|redo|rewrite|fix this)\b/i,
  /\b(use|prefer|should be)\b.*?\b(instead|rather than)\b/i,
]

const APPROVAL_PATTERNS = [
  /\b(perfect|exactly|great|good|nice|thanks|correct|right)\b/i,
  /\b(that'?s? (it|what I (wanted|needed)))\b/i,
  /\b(well done|good job|looks good)\b/i,
]

const ID_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateId(): string {
  let id = ""
  for (let i = 0; i < 8; i++) {
    id += ID_ALPHABET[Math.floor(Math.random() * ID_ALPHABET.length)]
  }
  return id
}

function getSignalWeight(type: SignalType): number {
  const weights: Record<SignalType, number> = {
    "edit-after": -0.5,
    kept: 1.0,
    deleted: -1.0,
    "test-pass": 0.5,
    "test-fail": -0.5,
    "lint-error": -0.3,
    "type-error": -0.3,
    "user-correction": -0.8,
    "user-approval": 0.8,
    revert: -1.0,
  }
  return weights[type]
}

// ─── Feedback Class ──────────────────────────────────────────────────────────

export class Feedback {
  private projectPath: string
  private signalsFile: string
  private signals: FeedbackSignal[] = []

  constructor(projectPath: string) {
    this.projectPath = projectPath
    this.signalsFile = path.join(projectPath, SIGNALS_FILE)
  }

  // ── Initialization ──────────────────────────────────────────────────────

  async init(): Promise<void> {
    await fs.mkdir(path.dirname(this.signalsFile), { recursive: true })
    await this.load()
  }

  private async load(): Promise<void> {
    try {
      const content = await fs.readFile(this.signalsFile, "utf-8")
      const lines = content.split("\n").filter(Boolean)
      this.signals = lines.map((line) => JSON.parse(line) as FeedbackSignal)
    } catch {
      // File doesn't exist yet
    }
  }

  // ── Signal Recording ────────────────────────────────────────────────────

  /**
   * Record a feedback signal.
   */
  async record(
    type: SignalType,
    details: string,
    options: {
      taskId?: string
      file?: string
      metadata?: Record<string, unknown>
    } = {},
  ): Promise<FeedbackSignal> {
    const signal: FeedbackSignal = {
      id: generateId(),
      type,
      timestamp: new Date().toISOString(),
      taskId: options.taskId,
      file: options.file,
      details,
      weight: getSignalWeight(type),
      metadata: options.metadata,
    }

    this.signals.push(signal)
    await this.appendToFile(signal)

    return signal
  }

  private async appendToFile(signal: FeedbackSignal): Promise<void> {
    const line = JSON.stringify(signal) + "\n"
    await fs.appendFile(this.signalsFile, line, "utf-8")
  }

  // ── Signal Analysis ─────────────────────────────────────────────────────

  /**
   * Detect if a user message is a correction.
   */
  static isCorrection(message: string): boolean {
    return CORRECTION_PATTERNS.some((p) => p.test(message))
  }

  /**
   * Detect if a user message is an approval.
   */
  static isApproval(message: string): boolean {
    return APPROVAL_PATTERNS.some((p) => p.test(message))
  }

  /**
   * Analyze a user message for feedback signals.
   */
  analyzeMessage(message: string, taskId?: string): FeedbackSignal | null {
    if (Feedback.isCorrection(message)) {
      return {
        id: generateId(),
        type: "user-correction",
        timestamp: new Date().toISOString(),
        taskId,
        details: message.substring(0, 200),
        weight: getSignalWeight("user-correction"),
      }
    }

    if (Feedback.isApproval(message)) {
      return {
        id: generateId(),
        type: "user-approval",
        timestamp: new Date().toISOString(),
        taskId,
        details: message.substring(0, 200),
        weight: getSignalWeight("user-approval"),
      }
    }

    return null
  }

  /**
   * Analyze a git diff to detect edit-after-generation signals.
   * Returns true if the diff looks like a user correction of AI code.
   */
  static analyzeDiff(diff: string): {
    isEditAfterAI: boolean
    changes: number
    confidence: number
  } {
    const lines = diff.split("\n")
    let additions = 0
    let deletions = 0

    for (const line of lines) {
      if (line.startsWith("+") && !line.startsWith("+++")) additions++
      if (line.startsWith("-") && !line.startsWith("---")) deletions++
    }

    const changes = additions + deletions

    // Heuristic: if there are both additions and deletions in a small diff,
    // it's likely an edit/correction
    const isEditAfterAI = changes > 0 && changes < 50 && additions > 0 && deletions > 0

    return {
      isEditAfterAI,
      changes,
      confidence: isEditAfterAI ? 0.6 : 0.3,
    }
  }

  // ── Summary & Reporting ─────────────────────────────────────────────────

  /**
   * Get a summary of all signals.
   */
  getSummary(): SignalSummary {
    const byType: Record<string, number> = {}
    let positive = 0
    let negative = 0

    for (const signal of this.signals) {
      byType[signal.type] = (byType[signal.type] ?? 0) + 1
      if (signal.weight > 0) positive++
      else if (signal.weight < 0) negative++
    }

    // Calculate recent trend (last 20 signals)
    const recent = this.signals.slice(-20)
    const recentPositive = recent.filter((s) => s.weight > 0).length
    const recentNegative = recent.filter((s) => s.weight < 0).length

    let recentTrend: SignalSummary["recentTrend"] = "stable"
    if (recentPositive > recentNegative * 1.5) recentTrend = "improving"
    else if (recentNegative > recentPositive * 1.5) recentTrend = "declining"

    return {
      total: this.signals.length,
      positive,
      negative,
      byType: byType as Record<SignalType, number>,
      recentTrend,
    }
  }

  /**
   * Get signals for a specific task.
   */
  getTaskSignals(taskId: string): FeedbackSignal[] {
    return this.signals.filter((s) => s.taskId === taskId)
  }

  /**
   * Get recent signals (last N).
   */
  getRecent(count: number = 20): FeedbackSignal[] {
    return this.signals.slice(-count)
  }

  /**
   * Get the average weight of recent signals (quality score).
   */
  getQualityScore(windowSize: number = 50): number {
    const recent = this.signals.slice(-windowSize)
    if (recent.length === 0) return 0
    const totalWeight = recent.reduce((sum, s) => sum + s.weight, 0)
    return totalWeight / recent.length
  }

  /**
   * Convert signals to lessons for memory storage.
   */
  extractLessons(): string[] {
    const lessons: string[] = []
    const summary = this.getSummary()

    // Analyze patterns
    if ((summary.byType["user-correction"] ?? 0) > 3) {
      lessons.push("User frequently corrects AI output — review common correction patterns")
    }

    if ((summary.byType["test-fail"] ?? 0) > (summary.byType["test-pass"] ?? 0)) {
      lessons.push("Test failure rate is high — be more careful with code generation")
    }

    if (summary.recentTrend === "improving") {
      lessons.push("Quality trend is improving — current approach is working")
    } else if (summary.recentTrend === "declining") {
      lessons.push("Quality trend is declining — review recent changes and adapt")
    }

    return lessons
  }

  // ── Pruning ─────────────────────────────────────────────────────────────

  /**
   * Prune old signals to keep the file manageable.
   */
  async prune(maxAgeDays: number = 30, maxSignals: number = 10000): Promise<number> {
    const now = Date.now()
    const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000
    const before = this.signals.length

    this.signals = this.signals.filter((s) => {
      const age = now - new Date(s.timestamp).getTime()
      return age < maxAgeMs
    })

    // Keep only the most recent maxSignals
    if (this.signals.length > maxSignals) {
      this.signals = this.signals.slice(-maxSignals)
    }

    // Rewrite the file
    const content = this.signals.map((s) => JSON.stringify(s)).join("\n") + "\n"
    await fs.writeFile(this.signalsFile, content, "utf-8")

    return before - this.signals.length
  }
}
