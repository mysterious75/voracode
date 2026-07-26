/**
 * EVOLVE CLI Command for Voracode
 *
 * Integrates Evolve self-learning engine into Voracode's CLI.
 *
 * Usage:
 *   voracode evolve status
 *   voracode evolve memory list
 *   voracode evolve memory prune
 *   voracode evolve skills list
 *   voracode evolve skills search <query>
 *   voracode evolve conventions
 *   voracode evolve consolidate
 *   voracode evolve feedback
 *   voracode evolve context <query>
 */

import { cmd } from "../cmd"
import { StandaloneEvolve } from "@/evolve/integration"
import { Memory } from "@/evolve/memory"
import { Conventions } from "@/evolve/conventions"
import { SkillLibrary } from "@/evolve/skills"
import { Feedback } from "@/evolve/feedback"
import { AdaptiveContext, classifyComplexity } from "@/evolve/adaptive-context"
import { Reflection } from "@/evolve/reflection"
import * as path from "path"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getProjectPath(cwd?: string): string {
  return path.resolve(cwd || process.cwd())
}

function formatConfidence(conf: number): string {
  return `${Math.round(conf * 100)}%`
}

function printHeader(text: string) {
  console.log(`\n🧠 ${text}\n`)
}

function printError(context: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Error ${context}: ${message}`)
}

// ─── Sub-Commands ────────────────────────────────────────────────────────────

async function showStatus(projectPath: string) {
  try {
    const evolve = new StandaloneEvolve(projectPath)
    await evolve.init()
    const report = evolve.getStatusReport()
    console.log(report)
  } catch (error) {
    printError("loading status", error)
  }
}

async function listMemories(projectPath: string) {
  try {
    const memory = new Memory(projectPath)
    await memory.init()

    const index = memory.getIndex()
    printHeader("Memory Index")
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
    printError("listing memories", error)
  }
}

async function pruneMemories(projectPath: string) {
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
    printError("pruning memories", error)
  }
}

async function listSkills(projectPath: string) {
  try {
    const skills = new SkillLibrary(projectPath)
    await skills.init()

    const allSkills = skills.getAll()

    if (allSkills.length === 0) {
      console.log(`\n📦 No skills stored yet.`)
      console.log(`  Skills are automatically created when tasks complete successfully.`)
      return
    }

    printHeader(`Skill Library (${allSkills.length} skills)`)

    for (const skill of allSkills) {
      const conf = formatConfidence(skill.confidence)
      const uses = skill.successCount + skill.failCount
      console.log(`  ${skill.name} [${conf}] (${uses} uses)`)
      console.log(`    ${skill.description}`)
      console.log(`    Tags: ${skill.tags.join(", ")}`)
      console.log()
    }
  } catch (error) {
    printError("listing skills", error)
  }
}

async function searchSkills(projectPath: string, query: string) {
  try {
    if (!query || query.trim().length === 0) {
      console.log("Usage: voracode evolve skills search <query>")
      return
    }

    const skills = new SkillLibrary(projectPath)
    await skills.init()

    const results = skills.search(query)

    if (results.length === 0) {
      console.log(`\n🔍 No skills found for "${query}"`)
      return
    }

    printHeader(`Skills matching "${query}" (${results.length} results)`)

    for (const result of results) {
      const conf = formatConfidence(result.skill.confidence)
      console.log(`  ${result.skill.name} [${conf}] (score: ${result.score.toFixed(1)})`)
      console.log(`    ${result.reason}`)
      console.log(`    ${result.skill.trigger}`)
      console.log()
    }
  } catch (error) {
    printError("searching skills", error)
  }
}

async function showConventions(projectPath: string) {
  try {
    const conventions = new Conventions(projectPath)
    console.log(`\n🔍 Analyzing project conventions...\n`)
    const result = await conventions.analyze()
    const markdown = Conventions.toMarkdown(result)
    console.log(markdown)
  } catch (error) {
    printError("analyzing conventions", error)
  }
}

async function runConsolidation(projectPath: string) {
  try {
    const evolve = new StandaloneEvolve(projectPath)
    await evolve.init()

    console.log(`\n🧹 Running memory consolidation...\n`)
    const result = await evolve.consolidate()
    console.log(`  ${result}`)
  } catch (error) {
    printError("running consolidation", error)
  }
}

async function showFeedback(projectPath: string) {
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
    printError("loading feedback", error)
  }
}

async function showContext(projectPath: string, query: string) {
  try {
    if (!query || query.trim().length === 0) {
      console.log("Usage: voracode evolve context <query>")
      return
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
    printError("building context", error)
  }
}

// ─── Main Command ────────────────────────────────────────────────────────────

export const EvolveCommand = cmd({
  command: "evolve [subcommand] [args...]",
  describe: "self-learning AI system — manages memory, skills, conventions, and feedback",
  builder: (yargs) =>
    yargs
      .positional("subcommand", {
        describe: "sub-command to run",
        type: "string",
        choices: ["status", "memory", "skills", "conventions", "consolidate", "feedback", "context"],
      })
      .positional("args", {
        describe: "additional arguments",
        type: "string",
        array: true,
      })
      .option("project", {
        describe: "project directory path",
        type: "string",
        alias: "p",
      })
      .help(false)
      .version(false),
  handler: async (args) => {
    const projectPath = getProjectPath(args.project as string)
    const subcommand = (args.subcommand as string) || "status"
    const extraArgs = (args.args as string[]) || []

    switch (subcommand) {
      case "status":
        await showStatus(projectPath)
        break

      case "memory":
        if (extraArgs[0] === "prune") {
          await pruneMemories(projectPath)
        } else {
          await listMemories(projectPath)
        }
        break

      case "skills":
        if (extraArgs[0] === "search") {
          await searchSkills(projectPath, extraArgs.slice(1).join(" "))
        } else {
          await listSkills(projectPath)
        }
        break

      case "conventions":
        await showConventions(projectPath)
        break

      case "consolidate":
        await runConsolidation(projectPath)
        break

      case "feedback":
        await showFeedback(projectPath)
        break

      case "context":
        await showContext(projectPath, extraArgs.join(" "))
        break

      default:
        console.log(`Unknown subcommand: ${subcommand}`)
        console.log(`Usage: voracode evolve [status|memory|skills|conventions|consolidate|feedback|context]`)
    }
  },
})
