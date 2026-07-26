/**
 * EVOLVE Reflection System
 *
 * After each significant task, generates a reflection on what worked/failed.
 * Stores reflections in memory for future reference.
 *
 * Based on: Reflexion (Shinn et al., 2023) — verbal reinforcement learning
 */

import { Memory, type MemoryCategory } from "./memory"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ReflectionEntry {
  id: string
  timestamp: string
  task: string
  outcome: "success" | "failure" | "partial"
  reflection: string
  lessons: string[]
  tags: string[]
}

export interface ReflectionPrompt {
  task: string
  outcome: "success" | "failure" | "partial"
  userFeedback?: string
  errors?: string[]
  filesModified?: string[]
  testsPass?: boolean
}

// ─── Constants ───────────────────────────────────────────────────────────────

const REFLECTION_PROMPT_TEMPLATE = `You are reflecting on a coding task you just completed. Analyze what happened and extract actionable lessons.

## Task
{task}

## Outcome
{outcome}

{feedback_section}

## Your Reflection

Analyze the following:
1. **What approach worked?** (If anything went well)
2. **What went wrong?** (If there were failures)
3. **What should be done differently next time?**
4. **What did I learn about this project/codebase?**

Provide a concise, actionable reflection. Focus on patterns that will help in future similar tasks.

Format your response as:
REFLECTION: <your reflection text>
LESSONS:
- <lesson 1>
- <lesson 2>
- ...`

// ─── Reflection Class ────────────────────────────────────────────────────────

export class Reflection {
  private memory: Memory

  constructor(memory: Memory) {
    this.memory = memory
  }

  /**
   * Generate a reflection prompt for the LLM.
   * This is what gets sent to the model to generate a reflection.
   */
  generatePrompt(params: ReflectionPrompt): string {
    let feedbackSection = ""

    if (params.userFeedback) {
      feedbackSection += `## User Feedback\n${params.userFeedback}\n`
    }

    if (params.errors && params.errors.length > 0) {
      feedbackSection += `## Errors Encountered\n${params.errors.map((e) => `- ${e}`).join("\n")}\n`
    }

    if (params.filesModified && params.filesModified.length > 0) {
      feedbackSection += `## Files Modified\n${params.filesModified.map((f) => `- ${f}`).join("\n")}\n`
    }

    if (params.testsPass !== undefined) {
      feedbackSection += `## Tests\n${params.testsPass ? "All tests passed" : "Some tests failed"}\n`
    }

    return REFLECTION_PROMPT_TEMPLATE.replace("{task}", params.task)
      .replace("{outcome}", params.outcome)
      .replace("{feedback_section}", feedbackSection)
  }

  /**
   * Parse a reflection response from the LLM.
   */
  parseResponse(response: string): { reflection: string; lessons: string[] } {
    const lines = response.split("\n")

    let reflection = ""
    const lessons: string[] = []
    let inReflection = false
    let inLessons = false

    for (const line of lines) {
      const trimmed = line.trim()

      if (trimmed.startsWith("REFLECTION:")) {
        inReflection = true
        inLessons = false
        reflection = trimmed.replace("REFLECTION:", "").trim()
        continue
      }

      if (trimmed.startsWith("LESSONS:")) {
        inReflection = false
        inLessons = true
        continue
      }

      if (inReflection && trimmed) {
        reflection += (reflection ? " " : "") + trimmed
      }

      if (inLessons && trimmed.startsWith("- ")) {
        lessons.push(trimmed.substring(2))
      }
    }

    // Fallback if parsing fails
    if (!reflection && response.length > 0) {
      reflection = response.substring(0, 500)
    }

    return { reflection, lessons }
  }

  /**
   * Store a reflection in memory.
   */
  async store(params: ReflectionPrompt, reflectionText: string, lessons: string[]): Promise<ReflectionEntry> {
    const entry: ReflectionEntry = {
      id: Date.now().toString(36),
      timestamp: new Date().toISOString(),
      task: params.task,
      outcome: params.outcome,
      reflection: reflectionText,
      lessons,
      tags: this.extractTags(params.task),
    }

    // Store in memory
    const content = [
      `**Task:** ${params.task}`,
      `**Outcome:** ${params.outcome}`,
      `**Reflection:** ${reflectionText}`,
      lessons.length > 0 ? `**Lessons:**\n${lessons.map((l) => `  - ${l}`).join("\n")}` : "",
    ]
      .filter(Boolean)
      .join("\n")

    await this.memory.add("reflection" as MemoryCategory, content, {
      confidence: params.outcome === "success" ? 0.7 : 0.5,
      source: "inferred",
      tags: entry.tags,
    })

    return entry
  }

  /**
   * Extract relevant tags from a task description.
   */
  private extractTags(task: string): string[] {
    const tags: string[] = []
    const lowerTask = task.toLowerCase()

    // Framework tags
    if (lowerTask.includes("react") || lowerTask.includes("jsx") || lowerTask.includes("tsx")) tags.push("react")
    if (lowerTask.includes("vue")) tags.push("vue")
    if (lowerTask.includes("angular")) tags.push("angular")
    if (lowerTask.includes("next")) tags.push("nextjs")
    if (lowerTask.includes("express") || lowerTask.includes("fastify")) tags.push("server")

    // Task type tags
    if (lowerTask.includes("test") || lowerTask.includes("spec")) tags.push("testing")
    if (lowerTask.includes("bug") || lowerTask.includes("fix") || lowerTask.includes("error")) tags.push("debugging")
    if (lowerTask.includes("refactor")) tags.push("refactoring")
    if (lowerTask.includes("api") || lowerTask.includes("endpoint")) tags.push("api")
    if (lowerTask.includes("database") || lowerTask.includes("sql") || lowerTask.includes("query")) tags.push("database")
    if (lowerTask.includes("style") || lowerTask.includes("css") || lowerTask.includes("ui")) tags.push("ui")
    if (lowerTask.includes("auth") || lowerTask.includes("login") || lowerTask.includes("permission")) tags.push("auth")
    if (lowerTask.includes("deploy") || lowerTask.includes("ci") || lowerTask.includes("docker")) tags.push("devops")

    return tags
  }

  /**
   * Retrieve relevant reflections for a given task.
   */
  getRelevant(taskDescription: string, limit: number = 5): string[] {
    const tags = this.extractTags(taskDescription)
    const allReflections = this.memory.getEntries("reflection" as MemoryCategory)

    // Score reflections by tag overlap
    const scored = allReflections.map((entry) => {
      let score = 0
      if (entry.tags) {
        for (const tag of tags) {
          if (entry.tags.includes(tag)) score += 2
        }
      }
      // Also check content similarity (simple keyword matching)
      const lowerContent = entry.content.toLowerCase()
      for (const tag of tags) {
        if (lowerContent.includes(tag)) score += 1
      }
      return { entry, score }
    })

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => s.entry.content)
  }

  /**
   * Generate a context injection string for similar past reflections.
   */
  toContextInjection(taskDescription: string): string {
    const relevant = this.getRelevant(taskDescription)
    if (relevant.length === 0) return ""

    const lines: string[] = [
      "# Relevant Past Reflections",
      "",
      "The following reflections are from similar past tasks. Use them to avoid repeating mistakes.",
      "",
    ]

    for (const reflection of relevant) {
      lines.push(reflection)
      lines.push("")
    }

    return lines.join("\n")
  }
}
