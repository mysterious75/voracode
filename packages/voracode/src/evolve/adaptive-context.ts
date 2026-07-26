/**
 * EVOLVE Adaptive Context Loading
 *
 * Adjusts context loading based on query complexity.
 * Simple queries get minimal context; complex queries get full context.
 *
 * Based on: Adaptive-RAG (Jeong et al., NAACL 2024)
 */

import { Memory } from "./memory"
import { Conventions, type ProjectConventions } from "./conventions"
import { SkillLibrary } from "./skills"
import { Reflection } from "./reflection"

// ─── Types ───────────────────────────────────────────────────────────────────

export type QueryComplexity = "simple" | "medium" | "complex"

export interface ContextStrategy {
  complexity: QueryComplexity
  loadMemory: boolean
  loadConventions: boolean
  loadSkills: boolean
  loadReflections: boolean
  maxMemoryEntries: number
  maxSkills: number
  maxReflections: number
  deepSearch: boolean
}

export interface ContextBundle {
  systemPrompt: string
  memoryContext: string
  conventionsContext: string
  skillsContext: string
  reflectionsContext: string
  totalTokens: number // Approximate
}

// ─── Constants ───────────────────────────────────────────────────────────────

// Keywords that indicate query complexity
const SIMPLE_INDICATORS = [
  "fix typo",
  "add semicolon",
  "rename",
  "format",
  "lint",
  "whitespace",
  "comment",
  "uncomment",
  "delete line",
  "add import",
  "remove import",
  "update version",
  "bump",
]

const COMPLEX_INDICATORS = [
  "refactor",
  "redesign",
  "migrate",
  "architecture",
  "system",
  "performance",
  "optimize",
  "scale",
  "security",
  "authentication",
  "authorization",
  "database schema",
  "api design",
  "microservice",
  "caching",
  "migration",
  "breaking change",
  "major",
  "overhaul",
  "rewrite",
]

const MEDIUM_INDICATORS = [
  "add feature",
  "implement",
  "create",
  "build",
  "fix bug",
  "error handling",
  "test",
  "endpoint",
  "component",
  "function",
  "class",
  "module",
  "integration",
  "validation",
  "logging",
]

// ─── Complexity Classifier ───────────────────────────────────────────────────

/**
 * Classify a query's complexity based on keyword analysis.
 * This is a fast, deterministic classifier that doesn't require an LLM call.
 */
export function classifyComplexity(query: string): QueryComplexity {
  const lowerQuery = query.toLowerCase()

  // Check for simple indicators
  for (const indicator of SIMPLE_INDICATORS) {
    if (lowerQuery.includes(indicator)) return "simple"
  }

  // Check for complex indicators
  for (const indicator of COMPLEX_INDICATORS) {
    if (lowerQuery.includes(indicator)) return "complex"
  }

  // Check for medium indicators
  for (const indicator of MEDIUM_INDICATORS) {
    if (lowerQuery.includes(indicator)) return "medium"
  }

  // Default based on query length
  if (lowerQuery.length < 30) return "simple"
  if (lowerQuery.length > 150) return "complex"
  return "medium"
}

// ─── AdaptiveContext Class ───────────────────────────────────────────────────

export class AdaptiveContext {
  private memory: Memory
  private conventions: Conventions
  private skills: SkillLibrary
  private reflection: Reflection

  constructor(
    memory: Memory,
    conventions: Conventions,
    skills: SkillLibrary,
    reflection: Reflection,
  ) {
    this.memory = memory
    this.conventions = conventions
    this.skills = skills
    this.reflection = reflection
  }

  /**
   * Select the optimal context strategy for a query.
   */
  selectStrategy(query: string): ContextStrategy {
    const complexity = classifyComplexity(query)

    switch (complexity) {
      case "simple":
        return {
          complexity,
          loadMemory: false,
          loadConventions: true, // Always load conventions
          loadSkills: false,
          loadReflections: false,
          maxMemoryEntries: 0,
          maxSkills: 0,
          maxReflections: 0,
          deepSearch: false,
        }

      case "medium":
        return {
          complexity,
          loadMemory: true,
          loadConventions: true,
          loadSkills: true,
          loadReflections: true,
          maxMemoryEntries: 10,
          maxSkills: 2,
          maxReflections: 3,
          deepSearch: false,
        }

      case "complex":
        return {
          complexity,
          loadMemory: true,
          loadConventions: true,
          loadSkills: true,
          loadReflections: true,
          maxMemoryEntries: 25,
          maxSkills: 5,
          maxReflections: 5,
          deepSearch: true,
        }
    }
  }

  /**
   * Build a context bundle based on the selected strategy.
   */
  async buildContext(query: string, strategy?: ContextStrategy): Promise<ContextBundle> {
    const ctx = strategy ?? this.selectStrategy(query)

    let memoryContext = ""
    let conventionsContext = ""
    let skillsContext = ""
    let reflectionsContext = ""

    // Load memory
    if (ctx.loadMemory) {
      memoryContext = this.memory.toContext(ctx.maxMemoryEntries)
    }

    // Load conventions
    if (ctx.loadConventions) {
      // Try to load from memory first, otherwise analyze
      const conventionEntries = this.memory.getEntries("convention")
      if (conventionEntries.length > 0) {
        conventionsContext = conventionEntries
          .slice(0, 10)
          .map((e) => `- ${e.content}`)
          .join("\n")
      }
      // If no stored conventions, the conventions module should be called separately
    }

    // Load skills
    if (ctx.loadSkills) {
      skillsContext = this.skills.toContextInjection(query, ctx.maxSkills)
    }

    // Load reflections
    if (ctx.loadReflections) {
      reflectionsContext = this.reflection.toContextInjection(query)
    }

    // Estimate token count (rough: 1 token ≈ 4 chars)
    const totalChars =
      memoryContext.length +
      conventionsContext.length +
      skillsContext.length +
      reflectionsContext.length
    const totalTokens = Math.ceil(totalChars / 4)

    // Build combined system prompt
    const systemPrompt = [
      memoryContext,
      conventionsContext,
      skillsContext,
      reflectionsContext,
    ]
      .filter(Boolean)
      .join("\n\n---\n\n")

    return {
      systemPrompt,
      memoryContext,
      conventionsContext,
      skillsContext,
      reflectionsContext,
      totalTokens,
    }
  }

  /**
   * Get a summary of what context was loaded (for debugging).
   */
  describeStrategy(strategy: ContextStrategy): string {
    const parts: string[] = [
      `Complexity: ${strategy.complexity}`,
      `Memory: ${strategy.loadMemory ? `${strategy.maxMemoryEntries} entries` : "off"}`,
      `Conventions: ${strategy.loadConventions ? "on" : "off"}`,
      `Skills: ${strategy.loadSkills ? `${strategy.maxSkills} max` : "off"}`,
      `Reflections: ${strategy.loadReflections ? `${strategy.maxReflections} max` : "off"}`,
      `Deep search: ${strategy.deepSearch ? "on" : "off"}`,
    ]
    return parts.join(" | ")
  }
}
