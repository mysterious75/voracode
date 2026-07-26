/**
 * EVOLVE Session Hook
 *
 * Integrates Evolve into Voracode's session lifecycle.
 * This module is called by the session processor to inject Evolve context
 * and collect feedback signals.
 *
 * Integration points:
 *   1. Session start → Load memory + conventions + skills → Inject into system prompt
 *   2. User message → Analyze for feedback signals
 *   3. Task complete → Generate reflection + store skill
 *
 * This module is designed to be NON-BLOCKING — Evolve errors never crash the session.
 */

import { EvolveEngine, type EvolveConfig } from "./engine"
import { generateEvolveContext, hasEvolveContext } from "./prompt-injection"

// ─── Singleton Engine ────────────────────────────────────────────────────────

let engineInstance: EvolveEngine | null = null
let engineProjectPath: string | null = null

/**
 * Get or create the Evolve engine for a project.
 * Uses singleton pattern to avoid re-initialization.
 */
function getEngine(projectPath: string): EvolveEngine {
  if (engineInstance && engineProjectPath === projectPath) {
    return engineInstance
  }

  engineInstance = new EvolveEngine(projectPath)
  engineProjectPath = projectPath
  return engineInstance
}

// ─── Session Lifecycle Hooks ─────────────────────────────────────────────────

/**
 * Hook 1: Called at session start.
 * Returns Evolve context strings to inject into the system prompt.
 *
 * @param projectPath - The project directory
 * @param query - The user's initial query (for adaptive context)
 * @returns Array of strings to append to system prompt
 */
export async function evolveSessionStart(
  projectPath: string,
  query?: string,
): Promise<string[]> {
  try {
    // Quick check: does Evolve have any learned context?
    const hasContext = await hasEvolveContext(projectPath)
    if (!hasContext) return []

    // Generate context
    const context = await generateEvolveContext(projectPath, query)
    return context
  } catch (error) {
    // Non-fatal: log and continue without Evolve context
    console.error("[Evolve] Session start hook error:", error)
    return []
  }
}

/**
 * Hook 2: Called when user sends a message.
 * Analyzes the message for feedback signals.
 *
 * @param projectPath - The project directory
 * @param message - The user's message
 * @param taskId - Optional task identifier
 */
export async function evolveUserMessage(
  projectPath: string,
  message: string,
  taskId?: string,
): Promise<void> {
  try {
    const engine = getEngine(projectPath)
    await engine.init()
    await engine.onUserMessage(message, taskId)
  } catch (error) {
    // Non-fatal
  }
}

/**
 * Hook 3: Called when a task is completed.
 * Generates reflection and optionally stores a skill.
 *
 * @param projectPath - The project directory
 * @param params - Task completion parameters
 */
export async function evolveTaskComplete(
  projectPath: string,
  params: {
    task: string
    outcome: "success" | "failure" | "partial"
    userFeedback?: string
    filesModified?: string[]
    testsPass?: boolean
  },
): Promise<void> {
  try {
    const engine = getEngine(projectPath)
    await engine.init()
    await engine.onTaskComplete(params)
  } catch (error) {
    // Non-fatal
  }
}

/**
 * Hook 4: Store a skill after successful task.
 *
 * @param projectPath - The project directory
 * @param params - Skill parameters
 */
export async function evolveStoreSkill(
  projectPath: string,
  params: {
    name: string
    description: string
    trigger: string
    tags: string[]
    code: string
    context: string
    language: string
  },
): Promise<void> {
  try {
    const engine = getEngine(projectPath)
    await engine.init()
    await engine.storeSkill(params)
  } catch (error) {
    // Non-fatal
  }
}

/**
 * Get the current Evolve engine status.
 */
export async function evolveGetStatus(projectPath: string) {
  try {
    const engine = getEngine(projectPath)
    await engine.init()
    return engine.getStatus()
  } catch {
    return {
      initialized: false,
      memoryEntries: 0,
      skillCount: 0,
      signalCount: 0,
      reflectionCount: 0,
      conventionsDetected: false,
      lastConsolidation: null,
      qualityScore: 0,
    }
  }
}

/**
 * Run memory consolidation.
 */
export async function evolveConsolidate(projectPath: string): Promise<string> {
  try {
    const engine = getEngine(projectPath)
    await engine.init()
    const result = await engine.runConsolidation()
    return [
      `Processed: ${result.entriesProcessed}`,
      `Merged: ${result.entriesMerged}`,
      `Pruned: ${result.entriesPruned}`,
    ].join(" | ")
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : String(error)}`
  }
}

/**
 * Reset the engine singleton (for testing).
 */
export function evolveReset(): void {
  engineInstance = null
  engineProjectPath = null
}
