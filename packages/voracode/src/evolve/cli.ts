/**
 * EVOLVE CLI Commands
 *
 * Standalone CLI commands for managing the Evolve engine.
 * All commands have proper error handling and input validation.
 *
 * Usage:
 *   bun run evolve status [project-path]
 *   bun run evolve memory list [project-path]
 *   bun run evolve memory prune [project-path]
 *   bun run evolve skills list [project-path]
 *   bun run evolve skills search <query> [project-path]
 *   bun run evolve conventions [project-path]
 *   bun run evolve consolidate [project-path]
 *   bun run evolve feedback [project-path]
 *   bun run evolve context <query> [project-path]
 */

import { StandaloneEvolve } from "./integration"
import { Memory } from "./memory"
import { Conventions } from "./conventions"
import { SkillLibrary } from "./skills"
import { Feedback } from "./feedback"
import { AdaptiveContext, classifyComplexity } from "./adaptive-context"
import { Reflection } from "./reflection"
import * as path from "path"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getProjectPath(args: string[]): string {
  const p = args[0] || process.cwd()
  // Resolve to absolute path
  return path.resolve(p)
}

function formatConfidence(conf: number): string {
  return `${Math.round(conf * 100)}%`
}

function handleError(context: string, error: unknown): never {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Error ${context}: ${message}`)
  process.exit(1)
}

// ─── Commands ────────────────────────────────────────────────────────────────

async function cmdStatus(projectPath: string) {
  try {
    const evolve = new StandaloneEvolve(projectPath)
    await evolve.init()
    const report = evolve.getStatusReport()
    console.log(report)
  } catch (error) {
    handleError("loading status", error)
  }
}

async function cmdMemoryList(projectPath: string) {
  try {
    const memory = new Memory(projectPath)
    await memory.init()

    const index = memory.getIndex()
    console.log(`\n📚 Memory Index`)
    console.log(`  Project: ${index.projectPath}`)
    console.log(`  Total entries: ${index.entryCount}`)
    console.log(`  Last updated: ${index.lastUpdated}`)
    console.log()

    for (const [category, count] of Object.entries(index.categories)) {
      if (count > 0) {
        console.log(`  ${category}: ${count} entries`)
      }
    }

    console.log(`\n📝 Entries by category:\n`)

    const categories = ["convention", "debugging", "preference", "architecture", "tool", "reflection", "skill"] as const
    for (const category of categories) {
      const entries = memory.getEntries(category as any)
      if (entries.length === 0) continue

      console.log(`── ${category.toUpperCase()} (${entries.length}) ──`)
      for (const entry of entries.slice(0, 5)) {
        const conf = formatConfidence(entry.confidence)
        const preview = entry.content.substring(0, 80).replace(/\n/g, " ")
        console.log(`  [${conf}] ${preview}${entry.content.length > 80 ? "..." : ""}`)
      }
      if (entries.length > 5) {
        console.log(`  ... and ${entries.length - 5} more`)
      }
      console.log()
    }
  } catch (error) {
    handleError("listing memories", error)
  }
}

async function cmdMemoryPrune(projectPath: string) {
  try {
    const memory = new Memory(projectPath)
    await memory.init()

    const before = memory.getAllEntries().length
    const pruned = await memory.prune()
    const after = memory.getAllEntries().length

    console.log(`\n🧹 Memory Pruned`)
    console.log(`  Before: ${before} entries`)
    console.log(`  Removed: ${pruned} entries`)
    console.log(`  After: ${after} entries`)
  } catch (error) {
    handleError("pruning memories", error)
  }
}

async function cmdSkillsList(projectPath: string) {
  try {
    const skills = new SkillLibrary(projectPath)
    await skills.init()

    const allSkills = skills.getAll()

    if (allSkills.length === 0) {
      console.log(`\n📦 No skills stored yet.`)
      console.log(`  Skills are automatically created when tasks complete successfully.`)
      return
    }

    console.log(`\n📦 Skill Library (${allSkills.length} skills)\n`)

    for (const skill of allSkills) {
      const conf = formatConfidence(skill.confidence)
      const uses = skill.successCount + skill.failCount
      console.log(`  ${skill.name} [${conf}] (${uses} uses)`)
      console.log(`    ${skill.description}`)
      console.log(`    Tags: ${skill.tags.join(", ")}`)
      console.log()
    }
  } catch (error) {
    handleError("listing skills", error)
  }
}

async function cmdSkillsSearch(projectPath: string, query: string) {
  try {
    if (!query || query.trim().length === 0) {
      console.log("Usage: evolve skills search <query> [path]")
      process.exit(1)
    }

    const skills = new SkillLibrary(projectPath)
    await skills.init()

    const results = skills.search(query)

    if (results.length === 0) {
      console.log(`\n🔍 No skills found for "${query}"`)
      return
    }

    console.log(`\n🔍 Skills matching "${query}" (${results.length} results)\n`)

    for (const result of results) {
      const conf = formatConfidence(result.skill.confidence)
      console.log(`  ${result.skill.name} [${conf}] (score: ${result.score.toFixed(1)})`)
      console.log(`    ${result.reason}`)
      console.log(`    ${result.skill.trigger}`)
      console.log()
    }
  } catch (error) {
    handleError("searching skills", error)
  }
}

async function cmdConventions(projectPath: string) {
  try {
    const conventions = new Conventions(projectPath)

    console.log(`\n🔍 Analyzing project conventions...\n`)
    const result = await conventions.analyze()
    const markdown = Conventions.toMarkdown(result)

    console.log(markdown)
  } catch (error) {
    handleError("analyzing conventions", error)
  }
}

async function cmdConsolidate(projectPath: string) {
  try {
    const evolve = new StandaloneEvolve(projectPath)
    await evolve.init()

    console.log(`\n🧹 Running memory consolidation...\n`)
    const result = await evolve.consolidate()
    console.log(`  ${result}`)
  } catch (error) {
    handleError("running consolidation", error)
  }
}

async function cmdFeedback(projectPath: string) {
  try {
    const feedback = new Feedback(projectPath)
    await feedback.init()

    const summary = feedback.getSummary()

    console.log(`\n📊 Feedback Summary`)
    console.log(`  Total signals: ${summary.total}`)
    console.log(`  Positive: ${summary.positive}`)
    console.log(`  Negative: ${summary.negative}`)
    console.log(`  Quality score: ${feedback.getQualityScore().toFixed(2)}`)
    console.log(`  Recent trend: ${summary.recentTrend}`)
    console.log()

    if (Object.keys(summary.byType).length > 0) {
      console.log(`  By type:`)
      for (const [type, count] of Object.entries(summary.byType)) {
        console.log(`    ${type}: ${count}`)
      }
    }

    const lessons = feedback.extractLessons()
    if (lessons.length > 0) {
      console.log(`\n  Lessons:`)
      for (const lesson of lessons) {
        console.log(`    - ${lesson}`)
      }
    }
  } catch (error) {
    handleError("loading feedback", error)
  }
}

async function cmdContext(projectPath: string, query: string) {
  try {
    if (!query || query.trim().length === 0) {
      console.log("Usage: evolve context <query> [path]")
      process.exit(1)
    }

    const memory = new Memory(projectPath)
    await memory.init()
    const conventions = new Conventions(projectPath)
    const skills = new SkillLibrary(projectPath)
    await skills.init()
    const reflection = new Reflection(memory)
    const ac = new AdaptiveContext(memory, conventions, skills, reflection)

    const complexity = classifyComplexity(query)
    const strategy = ac.selectStrategy(query)

    console.log(`\n🧠 Context Strategy for: "${query}"`)
    console.log(`  Complexity: ${complexity}`)
    console.log(`  Memory: ${strategy.loadMemory ? `${strategy.maxMemoryEntries} entries` : "off"}`)
    console.log(`  Conventions: ${strategy.loadConventions ? "on" : "off"}`)
    console.log(`  Skills: ${strategy.loadSkills ? `${strategy.maxSkills} max` : "off"}`)
    console.log(`  Reflections: ${strategy.loadReflections ? `${strategy.maxReflections} max` : "off"}`)
    console.log(`  Deep search: ${strategy.deepSearch ? "on" : "off"}`)

    const bundle = await ac.buildContext(query, strategy)
    console.log(`\n  Estimated tokens: ${bundle.totalTokens}`)

    if (bundle.systemPrompt) {
      console.log(`\n📋 Context Preview (first 500 chars):\n`)
      console.log(bundle.systemPrompt.substring(0, 500))
      if (bundle.systemPrompt.length > 500) {
        console.log(`\n  ... (${bundle.systemPrompt.length - 500} more chars)`)
      }
    }
  } catch (error) {
    handleError("building context", error)
  }
}

// ─── Main Entry Point ────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  const command = args[0]
  const rest = args.slice(1)

  if (!command || command === "help" || command === "--help" || command === "-h") {
    console.log(`
🧠 Voracode Evolve — Self-Learning AI System

Commands:
  status [path]              Show Evolve engine status
  memory list [path]         List all memory entries
  memory prune [path]        Prune low-confidence memories
  skills list [path]         List all skills
  skills search <query>      Search skills by query
  conventions [path]         Analyze project conventions
  consolidate [path]         Run memory consolidation
  feedback [path]            Show feedback summary
  context <query> [path]     Show context strategy for a query
  help                       Show this help message

Examples:
  bun run evolve status
  bun run evolve memory list ~/my-project
  bun run evolve skills search "express error handling"
  bun run evolve context "refactor the auth system"
`)
    return
  }

  try {
    switch (command) {
      case "status":
        await cmdStatus(getProjectPath(rest))
        break
      case "memory":
        if (rest[0] === "list") await cmdMemoryList(getProjectPath(rest.slice(1)))
        else if (rest[0] === "prune") await cmdMemoryPrune(getProjectPath(rest.slice(1)))
        else {
          console.log("Usage: evolve memory [list|prune] [path]")
          process.exit(1)
        }
        break
      case "skills":
        if (rest[0] === "list") await cmdSkillsList(getProjectPath(rest.slice(1)))
        else if (rest[0] === "search") await cmdSkillsSearch(getProjectPath(rest.slice(2)), rest[1] || "")
        else {
          console.log("Usage: evolve skills [list|search <query>] [path]")
          process.exit(1)
        }
        break
      case "conventions":
        await cmdConventions(getProjectPath(rest))
        break
      case "consolidate":
        await cmdConsolidate(getProjectPath(rest))
        break
      case "feedback":
        await cmdFeedback(getProjectPath(rest))
        break
      case "context":
        await cmdContext(getProjectPath(rest.slice(1)), rest[0] || "")
        break
      default:
        console.log(`Unknown command: ${command}. Run "evolve help" for usage.`)
        process.exit(1)
    }
  } catch (error) {
    handleError("executing command", error)
  }
}

main()
