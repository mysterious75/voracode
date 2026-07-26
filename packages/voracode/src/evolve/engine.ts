/**
 * EVOLVE Engine — Main Orchestrator
 *
 * Coordinates all Evolve sub-systems: memory, conventions, feedback,
 * reflection, skills, git-learning, adaptive context, and consolidation.
 *
 * This is the main entry point for integrating Evolve into Voracode.
 */

import * as path from "path"
import { Memory, type MemoryCategory } from "./memory"
import { Conventions, type ProjectConventions } from "./conventions"
import { Feedback, type FeedbackSignal, type SignalType } from "./feedback"
import { Reflection } from "./reflection"
import { SkillLibrary } from "./skills"
import { GitLearning } from "./git-learning"
import { AdaptiveContext, type ContextStrategy, type ContextBundle } from "./adaptive-context"
import { Consolidator, type ConsolidationResult } from "./consolidation"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface EvolveConfig {
  enabled: boolean
  autoMemory: boolean
  conventionExtraction: boolean
  skillLibrary: boolean
  reflectionLoop: boolean
  adaptiveContext: boolean
  consolidation: {
    interval: number // Run every N sessions
    pruneThreshold: number
    maxAgeDays: number
  }
  privacy: {
    cloudSync: boolean
    telemetry: boolean
  }
}

export interface EvolveStatus {
  initialized: boolean
  memoryEntries: number
  skillCount: number
  signalCount: number
  reflectionCount: number
  conventionsDetected: boolean
  lastConsolidation: string | null
  qualityScore: number
}

export interface SessionStartContext {
  systemPrompt: string
  conventions: ProjectConventions | null
  strategy: ContextStrategy
  tokenCount: number
}

export interface SessionEndFeedback {
  task: string
  outcome: "success" | "failure" | "partial"
  userFeedback?: string
  filesModified?: string[]
  testsPass?: boolean
}

// ─── Default Config ──────────────────────────────────────────────────────────

const DEFAULT_CONFIG: EvolveConfig = {
  enabled: true,
  autoMemory: true,
  conventionExtraction: true,
  skillLibrary: true,
  reflectionLoop: true,
  adaptiveContext: true,
  consolidation: {
    interval: 5,
    pruneThreshold: 0.2,
    maxAgeDays: 90,
  },
  privacy: {
    cloudSync: false,
    telemetry: false,
  },
}

// ─── EvolveEngine Class ──────────────────────────────────────────────────────

export class EvolveEngine {
  private projectPath: string
  private config: EvolveConfig

  // Sub-systems
  private memory: Memory
  private conventions: Conventions
  private feedback: Feedback
  private reflection: Reflection
  private skills: SkillLibrary
  private gitLearning: GitLearning
  private adaptiveContext: AdaptiveContext
  private consolidator: Consolidator

  // State
  private initialized = false
  private sessionCount = 0
  private conventionsCache: ProjectConventions | null = null
  private lastConsolidation: string | null = null

  constructor(projectPath: string, config: Partial<EvolveConfig> = {}) {
    this.projectPath = projectPath
    this.config = { ...DEFAULT_CONFIG, ...config }

    // Initialize sub-systems
    this.memory = new Memory(projectPath)
    this.conventions = new Conventions(projectPath)
    this.feedback = new Feedback(projectPath)
    this.reflection = new Reflection(this.memory)
    this.skills = new SkillLibrary(projectPath)
    this.gitLearning = new GitLearning(projectPath, this.feedback)
    this.adaptiveContext = new AdaptiveContext(
      this.memory,
      this.conventions,
      this.skills,
      this.reflection,
    )
    this.consolidator = new Consolidator(this.memory)
  }

  // ── Lifecycle ───────────────────────────────────────────────────────────

  /**
   * Initialize the Evolve engine. Call this at Voracode startup.
   * Non-blocking: errors are caught and logged, never thrown.
   */
  async init(): Promise<void> {
    if (!this.config.enabled) return

    try {
      // Initialize all sub-systems with individual error handling
      try {
        await this.memory.init()
      } catch (e) {
        console.error("[Evolve] Memory init error:", e)
      }

      try {
        await this.feedback.init()
      } catch (e) {
        console.error("[Evolve] Feedback init error:", e)
      }

      try {
        await this.skills.init()
      } catch (e) {
        console.error("[Evolve] Skills init error:", e)
      }

      // Extract conventions if not already done
      if (this.config.conventionExtraction) {
        try {
          const existingConventions = this.memory.getEntries("convention" as MemoryCategory)
          if (existingConventions.length === 0) {
            await this.extractAndStoreConventions()
          }
        } catch (e) {
          console.error("[Evolve] Convention extraction error:", e)
        }
      }

      // Run git-based learning
      try {
        await this.learnFromGit()
      } catch (e) {
        console.error("[Evolve] Git learning error:", e)
      }

      this.initialized = true
    } catch (error) {
      console.error("[Evolve] Initialization error:", error)
      // Non-fatal: Evolve should not block Voracode from working
    }
  }

  // ── Session Lifecycle ───────────────────────────────────────────────────

  /**
   * Called at the start of a coding session.
   * Returns context to inject into the system prompt.
   */
  async onSessionStart(query?: string): Promise<SessionStartContext> {
    if (!this.initialized || !this.config.enabled) {
      return {
        systemPrompt: "",
        conventions: null,
        strategy: { complexity: "medium", loadMemory: false, loadConventions: false, loadSkills: false, loadReflections: false, maxMemoryEntries: 0, maxSkills: 0, maxReflections: 0, deepSearch: false },
        tokenCount: 0,
      }
    }

    this.sessionCount++

    // Build adaptive context
    const strategy = this.adaptiveContext.selectStrategy(query ?? "")
    const contextBundle = await this.adaptiveContext.buildContext(query ?? "", strategy)

    return {
      systemPrompt: contextBundle.systemPrompt,
      conventions: this.conventionsCache,
      strategy,
      tokenCount: contextBundle.totalTokens,
    }
  }

  /**
   * Called when the user sends a message during a session.
   * Analyzes the message for feedback signals.
   * Non-blocking: errors are caught and logged.
   */
  async onUserMessage(message: string, taskId?: string): Promise<void> {
    if (!this.initialized || !this.config.autoMemory) return
    if (!message || typeof message !== "string" || message.length > 10000) return

    try {
      // Check for correction/approval signals
      const signal = this.feedback.analyzeMessage(message.substring(0, 1000), taskId)
      if (signal) {
        await this.feedback.record(signal.type as SignalType, signal.details, {
          taskId,
        })

        // If it's a correction, store as a lesson
        if (signal.type === "user-correction" && this.config.autoMemory) {
          await this.memory.add("preference" as MemoryCategory, `User correction: ${message.substring(0, 200)}`, {
            confidence: 0.6,
            source: "explicit",
            context: taskId,
          })
        }
      }
    } catch (error) {
      // Non-fatal
      console.error("[Evolve] onUserMessage error:", error)
    }
  }

  /**
   * Called when a coding task is completed.
   * Generates reflection and optionally extracts a skill.
   * Non-blocking: errors are caught and logged.
   */
  async onTaskComplete(params: SessionEndFeedback): Promise<void> {
    if (!this.initialized) return
    if (!params.task || typeof params.task !== "string") return

    try {
      // Generate reflection
      if (this.config.reflectionLoop) {
        const prompt = this.reflection.generatePrompt({
          task: params.task.substring(0, 2000),
          outcome: params.outcome,
          userFeedback: params.userFeedback?.substring(0, 1000),
          filesModified: params.filesModified?.slice(0, 50),
          testsPass: params.testsPass,
        })

        // Store task info for later reflection
        if (params.outcome === "failure" || params.userFeedback) {
          await this.memory.add("reflection" as MemoryCategory,
            `Task: ${params.task.substring(0, 500)}\nOutcome: ${params.outcome}\nFeedback: ${params.userFeedback?.substring(0, 500) ?? "None"}`,
            {
              confidence: params.outcome === "success" ? 0.7 : 0.4,
              source: "inferred",
            }
          )
        }
      }

      // Run consolidation periodically
      if (this.sessionCount % this.config.consolidation.interval === 0) {
        await this.runConsolidation()
      }
    } catch (error) {
      // Non-fatal
      console.error("[Evolve] onTaskComplete error:", error)
    }
  }

  /**
   * Store a reflection after the LLM generates one.
   */
  async storeReflection(
    task: string,
    outcome: "success" | "failure" | "partial",
    reflectionText: string,
    lessons: string[],
  ): Promise<void> {
    if (!this.initialized) return

    await this.reflection.store(
      { task, outcome },
      reflectionText,
      lessons,
    )
  }

  /**
   * Store a new skill after successful task completion.
   */
  async storeSkill(params: {
    name: string
    description: string
    trigger: string
    tags: string[]
    code: string
    context: string
    language: string
  }): Promise<void> {
    if (!this.initialized || !this.config.skillLibrary) return

    await this.skills.add(params)
  }

  // ── Sub-system Operations ───────────────────────────────────────────────

  /**
   * Extract conventions and store them in memory.
   */
  private async extractAndStoreConventions(): Promise<void> {
    try {
      const conventions = await this.conventions.analyze()
      this.conventionsCache = conventions

      const markdown = Conventions.toMarkdown(conventions)
      await this.memory.add("convention" as MemoryCategory, markdown, {
        confidence: 0.8,
        source: "inferred",
        tags: ["auto-detected", "conventions"],
      })
    } catch (error) {
      console.error("[Evolve] Convention extraction error:", error)
    }
  }

  /**
   * Learn from git history.
   */
  private async learnFromGit(): Promise<void> {
    try {
      const lessons = await this.gitLearning.learn()
      for (const lesson of lessons) {
        await this.memory.add("debugging" as MemoryCategory, lesson, {
          confidence: 0.5,
          source: "inferred",
          tags: ["git-analysis"],
        })
      }
    } catch (error) {
      // Non-fatal
    }
  }

  /**
   * Run memory consolidation.
   */
  async runConsolidation(): Promise<ConsolidationResult> {
    const result = await this.consolidator.consolidate({
      minConfidence: this.config.consolidation.pruneThreshold,
      maxAgeDays: this.config.consolidation.maxAgeDays,
    })
    this.lastConsolidation = new Date().toISOString()
    return result
  }

  // ── Status & Diagnostics ────────────────────────────────────────────────

  /**
   * Get the current status of the Evolve engine.
   */
  getStatus(): EvolveStatus {
    const allEntries = this.memory.getAllEntries()
    const signalSummary = this.feedback.getSummary()

    return {
      initialized: this.initialized,
      memoryEntries: allEntries.length,
      skillCount: this.skills.getAll().length,
      signalCount: signalSummary.total,
      reflectionCount: allEntries.filter((e) => e.category === "reflection").length,
      conventionsDetected: this.conventionsCache !== null,
      lastConsolidation: this.lastConsolidation,
      qualityScore: this.feedback.getQualityScore(),
    }
  }

  /**
   * Get a human-readable status report.
   */
  getStatusReport(): string {
    const status = this.getStatus()
    const lines: string[] = [
      "# Voracode Evolve Status",
      "",
      `- **Initialized:** ${status.initialized ? "Yes" : "No"}`,
      `- **Memory entries:** ${status.memoryEntries}`,
      `- **Skills:** ${status.skillCount}`,
      `- **Feedback signals:** ${status.signalCount}`,
      `- **Reflections:** ${status.reflectionCount}`,
      `- **Conventions detected:** ${status.conventionsDetected ? "Yes" : "No"}`,
      `- **Quality score:** ${status.qualityScore.toFixed(2)}`,
      "",
    ]

    const signalSummary = this.feedback.getSummary()
    lines.push(`- **Positive signals:** ${signalSummary.positive}`)
    lines.push(`- **Negative signals:** ${signalSummary.negative}`)
    lines.push(`- **Recent trend:** ${signalSummary.recentTrend}`)

    return lines.join("\n")
  }

  // ── Getters (for testing and advanced usage) ────────────────────────────

  getMemory(): Memory {
    return this.memory
  }

  getConventions(): Conventions {
    return this.conventions
  }

  getFeedback(): Feedback {
    return this.feedback
  }

  getReflection(): Reflection {
    return this.reflection
  }

  getSkills(): SkillLibrary {
    return this.skills
  }

  getGitLearning(): GitLearning {
    return this.gitLearning
  }

  getAdaptiveContext(): AdaptiveContext {
    return this.adaptiveContext
  }

  getConfig(): EvolveConfig {
    return { ...this.config }
  }
}
