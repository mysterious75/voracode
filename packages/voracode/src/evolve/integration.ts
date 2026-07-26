/**
 * EVOLVE Integration — Hooks into Voracode's session lifecycle
 *
 * This module provides the integration layer between the Evolve engine
 * and Voracode's existing architecture.
 *
 * The StandaloneEvolve class works without Effect-TS for CLI/testing.
 * The Effect-TS Service version requires the effect package.
 */

import { EvolveEngine, type EvolveConfig, type SessionStartContext } from "./engine"

// ─── Standalone Integration (works without Effect-TS) ────────────────────────

/**
 * Simple standalone integration that doesn't require Effect-TS.
 * Use this for CLI commands and testing.
 */
export class StandaloneEvolve {
  private engine: EvolveEngine

  constructor(projectPath: string, config?: Partial<EvolveConfig>) {
    this.engine = new EvolveEngine(projectPath, config)
  }

  async init(): Promise<void> {
    await this.engine.init()
  }

  async getSystemPromptContext(query?: string): Promise<string[]> {
    const ctx = await this.engine.onSessionStart(query)
    return ctx.systemPrompt ? [ctx.systemPrompt] : []
  }

  async recordUserMessage(message: string, taskId?: string): Promise<void> {
    await this.engine.onUserMessage(message, taskId)
  }

  async recordTaskComplete(params: {
    task: string
    outcome: "success" | "failure" | "partial"
    userFeedback?: string
    filesModified?: string[]
    testsPass?: boolean
  }): Promise<void> {
    await this.engine.onTaskComplete(params)
  }

  async addSkill(params: {
    name: string
    description: string
    trigger: string
    tags: string[]
    code: string
    context: string
    language: string
  }): Promise<void> {
    await this.engine.storeSkill(params)
  }

  getStatus() {
    return this.engine.getStatus()
  }

  getStatusReport(): string {
    return this.engine.getStatusReport()
  }

  async consolidate(): Promise<string> {
    const result = await this.engine.runConsolidation()
    return [
      `Processed: ${result.entriesProcessed}`,
      `Merged: ${result.entriesMerged}`,
      `Pruned: ${result.entriesPruned}`,
      `Boosted: ${result.entriesBoosted}`,
    ].join(" | ")
  }

  getEngine(): EvolveEngine {
    return this.engine
  }
}
