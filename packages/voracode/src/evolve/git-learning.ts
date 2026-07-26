/**
 * EVOLVE Git-Based Learning
 *
 * Learns from git history about what the user does with AI-generated code.
 * Detects patterns: kept without edits, edited after generation, deleted, etc.
 *
 * Security: Uses execFile instead of exec to prevent command injection.
 */

import { execFile } from "child_process"
import { promisify } from "util"
import { Feedback, type FeedbackSignal, type SignalType } from "./feedback"

const execFileAsync = promisify(execFile)

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GitCommit {
  hash: string
  author: string
  date: string
  message: string
  files: string[]
}

export interface GitAnalysis {
  commitsAnalyzed: number
  signals: FeedbackSignal[]
  patterns: PatternDetection[]
}

export interface PatternDetection {
  pattern: string
  frequency: number
  confidence: number
  examples: string[]
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_COMMITS_TO_ANALYZE = 100
const TIME_WINDOW_MS = 5 * 60 * 1000 // 5 minutes — window to detect "edit after AI"
const GIT_TIMEOUT_MS = 30000 // 30 second timeout for git commands

// AI-generated commit message patterns (common in AI coding tools)
const AI_COMMIT_PATTERNS = [
  /^(ai|copilot|cursor|voracode|auto)[\s:-]/i,
  /\b(generated|created|added|implemented)\b.*\b(by|with|via)\b.*\b(ai|copilot|cursor|assistant)\b/i,
  /\b(auto|ai)-(generated|created|implemented)\b/i,
]

// ─── GitLearning Class ───────────────────────────────────────────────────────

export class GitLearning {
  private projectPath: string
  private feedback: Feedback

  constructor(projectPath: string, feedback: Feedback) {
    this.projectPath = projectPath
    this.feedback = feedback
  }

  // ── Git Operations ──────────────────────────────────────────────────────

  /**
   * Execute a git command safely using execFile (not exec).
   * Prevents command injection by passing args as array.
   */
  private async git(...args: string[]): Promise<string> {
    try {
      const { stdout } = await execFileAsync("git", args, {
        cwd: this.projectPath,
        maxBuffer: 10 * 1024 * 1024,
        timeout: GIT_TIMEOUT_MS,
      })
      return stdout.trim()
    } catch {
      return ""
    }
  }

  /**
   * Get recent commits with file lists.
   */
  async getRecentCommits(count: number = MAX_COMMITS_TO_ANALYZE): Promise<GitCommit[]> {
    // Sanitize count
    const safeCount = Math.min(Math.max(1, Math.floor(count)), 500)

    const log = await this.git(
      "log",
      "--pretty=format:%H|%an|%aI|%s",
      "--name-only",
      `-${safeCount}`,
    )

    if (!log) return []

    const commits: GitCommit[] = []
    const blocks = log.split(/\n(?=[0-9a-f]{40}\|)/)

    for (const block of blocks) {
      const lines = block.split("\n").filter(Boolean)
      if (lines.length === 0) continue

      const firstLine = lines[0]
      const pipeIndex = firstLine.indexOf("|")
      if (pipeIndex === -1) continue

      const hash = firstLine.substring(0, pipeIndex)
      const rest = firstLine.substring(pipeIndex + 1)

      const secondPipe = rest.indexOf("|")
      if (secondPipe === -1) continue

      const author = rest.substring(0, secondPipe)
      const rest2 = rest.substring(secondPipe + 1)

      const thirdPipe = rest2.indexOf("|")
      if (thirdPipe === -1) continue

      const date = rest2.substring(0, thirdPipe)
      const message = rest2.substring(thirdPipe + 1)
      const files = lines.slice(1).filter((f) => f.trim() && !f.startsWith(" "))

      commits.push({ hash, author, date, message, files })
    }

    return commits
  }

  /**
   * Get the diff for a specific commit.
   */
  async getCommitDiff(hash: string): Promise<string> {
    // Sanitize hash — only allow hex characters
    const safeHash = hash.replace(/[^a-f0-9]/g, "").substring(0, 40)
    if (!safeHash || safeHash.length < 7) return ""
    return this.git("diff", `${safeHash}^..${safeHash}`)
  }

  /**
   * Detect if a commit message looks AI-generated.
   */
  isAICommit(message: string): boolean {
    return AI_COMMIT_PATTERNS.some((p) => p.test(message))
  }

  // ── Analysis ────────────────────────────────────────────────────────────

  /**
   * Analyze recent git history to extract learning signals.
   */
  async analyze(): Promise<GitAnalysis> {
    const commits = await this.getRecentCommits()
    const signals: FeedbackSignal[] = []
    const patterns: PatternDetection[] = []

    // Group commits by file to detect edit patterns
    const fileHistory = new Map<string, GitCommit[]>()

    for (const commit of commits) {
      for (const file of commit.files) {
        // Sanitize file path
        if (file.includes("..") || file.startsWith("/")) continue
        const history = fileHistory.get(file) ?? []
        history.push(commit)
        fileHistory.set(file, history)
      }
    }

    // Analyze file history for patterns
    for (const [file, fileCommits] of fileHistory) {
      if (fileCommits.length < 2) continue

      // Sort by date
      fileCommits.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      // Look for rapid successive edits (potential AI correction pattern)
      for (let i = 1; i < fileCommits.length; i++) {
        const prev = fileCommits[i - 1]
        const curr = fileCommits[i]
        const prevTime = new Date(prev.date).getTime()
        const currTime = new Date(curr.date).getTime()

        if (isNaN(prevTime) || isNaN(currTime)) continue

        const timeDiff = currTime - prevTime

        if (timeDiff < TIME_WINDOW_MS && timeDiff >= 0) {
          // Rapid edit — likely a correction
          if (this.isAICommit(prev.message)) {
            signals.push({
              id: `${prev.hash.substring(0, 8)}-${curr.hash.substring(0, 8)}`,
              type: "edit-after" as SignalType,
              timestamp: curr.date,
              file,
              details: `AI commit "${prev.message}" was quickly followed by "${curr.message}"`,
              weight: -0.5,
              metadata: {
                aiCommit: prev.hash,
                correctionCommit: curr.hash,
                timeDiffMs: timeDiff,
              },
            })
          }
        }
      }

      // Detect files that were committed by AI and never touched again (kept)
      const lastCommit = fileCommits[fileCommits.length - 1]
      if (this.isAICommit(lastCommit.message)) {
        const lastTime = new Date(lastCommit.date).getTime()
        if (isNaN(lastTime)) continue

        const daysSinceCommit = (Date.now() - lastTime) / (1000 * 60 * 60 * 24)

        if (daysSinceCommit > 7 && daysSinceCommit < 365) {
          signals.push({
            id: `kept-${lastCommit.hash.substring(0, 8)}`,
            type: "kept" as SignalType,
            timestamp: lastCommit.date,
            file,
            details: `AI-generated file "${file}" has not been modified for ${Math.round(daysSinceCommit)} days`,
            weight: 1.0,
            metadata: {
              commit: lastCommit.hash,
              daysSinceCommit: Math.round(daysSinceCommit),
            },
          })
        }
      }
    }

    // Detect common patterns
    const editAfterSignals = signals.filter((s) => s.type === "edit-after")
    if (editAfterSignals.length > 3) {
      patterns.push({
        pattern: "Frequent AI corrections detected",
        frequency: editAfterSignals.length,
        confidence: Math.min(editAfterSignals.length / 10, 1),
        examples: editAfterSignals.slice(0, 3).map((s) => s.details),
      })
    }

    const keptSignals = signals.filter((s) => s.type === "kept")
    if (keptSignals.length > 5) {
      patterns.push({
        pattern: "AI code is generally accepted without modifications",
        frequency: keptSignals.length,
        confidence: Math.min(keptSignals.length / 20, 1),
        examples: keptSignals.slice(0, 3).map((s) => s.details),
      })
    }

    return {
      commitsAnalyzed: commits.length,
      signals,
      patterns,
    }
  }

  /**
   * Extract lessons from git analysis and store them in feedback/memory.
   */
  async learn(): Promise<string[]> {
    const analysis = await this.analyze()
    const lessons: string[] = []

    // Record signals
    for (const signal of analysis.signals) {
      try {
        await this.feedback.record(signal.type as SignalType, signal.details, {
          file: signal.file,
          metadata: signal.metadata,
        })
      } catch {
        // Non-fatal: continue with other signals
      }
    }

    // Extract lessons from patterns
    for (const pattern of analysis.patterns) {
      if (pattern.pattern.includes("corrections")) {
        lessons.push(
          `AI code is frequently corrected shortly after generation (${pattern.frequency} times). ` +
          `Review common correction patterns to improve quality.`,
        )
      }

      if (pattern.pattern.includes("accepted")) {
        lessons.push(
          `AI-generated code is generally kept without modifications (${pattern.frequency} files). ` +
          `Current approach is working well.`,
        )
      }
    }

    return lessons
  }

  /**
   * Get a summary of git-based learning.
   */
  async getSummary(): Promise<{
    commitsAnalyzed: number
    aiCommits: number
    editAfterCount: number
    keptCount: number
    patterns: string[]
  }> {
    const commits = await this.getRecentCommits()
    const aiCommits = commits.filter((c) => this.isAICommit(c.message))
    const analysis = await this.analyze()

    return {
      commitsAnalyzed: commits.length,
      aiCommits: aiCommits.length,
      editAfterCount: analysis.signals.filter((s) => s.type === "edit-after").length,
      keptCount: analysis.signals.filter((s) => s.type === "kept").length,
      patterns: analysis.patterns.map((p) => p.pattern),
    }
  }
}
