import { Effect } from "effect"
import { effectCmd } from "../effect-cmd"
import { Database } from "@voracode-ai/core/database/database"
import { SessionTable } from "@voracode-ai/core/session/sql"
import { Global } from "@voracode-ai/core/global"
import { sql } from "drizzle-orm"
import path from "path"
import fs from "fs/promises"

interface Suggestion {
  category: string
  priority: "low" | "medium" | "high"
  message: string
}

const suggest = (category: string, priority: "low" | "medium" | "high", message: string): Suggestion => ({
  category,
  priority,
  message,
})

const analyzeModelUsage = Effect.fn("Cli.improve.models")(function* () {
  const { db } = yield* Database.Service
  const rows = yield* db
    .select({ model: SessionTable.model })
    .from(SessionTable)
    .all()
    .pipe(Effect.orDie)

  const modelCounts = new Map<string, number>()
  for (const r of rows) {
    if (!r.model) continue
    const key = r.model.providerID + "/" + r.model.id
    modelCounts.set(key, (modelCounts.get(key) || 0) + 1)
  }

  const suggestions: Suggestion[] = []
  const sorted = [...modelCounts.entries()].sort((a, b) => b[1] - a[1])
  if (sorted.length === 0) return suggestions

  const top = sorted[0]

  const fastPairs: Record<string, string> = {
    "anthropic/claude-sonnet-4-20250514": "anthropic/claude-haiku-3-5-20241022",
    "openai/gpt-4o": "openai/gpt-4o-mini",
    "openai/gpt-4-turbo": "openai/gpt-4o-mini",
  }

  const faster = fastPairs[top[0]]
  if (faster) {
    suggestions.push(
      suggest("model-optimization", "medium",
        "Most used model is " + top[0] + " (" + top[1] + " sessions). Consider " + faster + " for simpler tasks to reduce cost"),
    )
  }

  if (sorted.length > 3) {
    suggestions.push(
      suggest("model-consolidation", "low",
        "Using " + sorted.length + " different models. Consolidating to 2-3 models simplifies provider configuration"),
    )
  }

  return suggestions
})

const analyzeAgentConfig = Effect.fn("Cli.improve.agents")(function* () {
  const suggestions: Suggestion[] = []

  const agentDirs = [
    path.join(Global.Path.config, "agents"),
    path.join(process.cwd(), ".voracode", "agents"),
  ]

  for (const dir of agentDirs) {
    let files: string[]
    try {
      files = yield* Effect.promise(() => fs.readdir(dir))
    } catch {
      continue
    }

    const agentFiles = files.filter((f) => f.endsWith(".md"))
    if (agentFiles.length === 0) {
      suggestions.push(
        suggest("agent-discovery", "low",
          "No custom agents found. Create agents for repetitive tasks to save time and improve consistency via 'voracode agent create'"),
      )
    }
    break
  }

  return suggestions
})

const analyzeSessionPatterns = Effect.fn("Cli.improve.patterns")(function* () {
  const { db } = yield* Database.Service
  const countRow = yield* db
    .select({ count: sql<number>`count(*)` })
    .from(SessionTable)
    .all()
    .pipe(Effect.orDie)

  const totalSessions = countRow[0]?.count ?? 0
  const suggestions: Suggestion[] = []

  if (totalSessions === 0) {
    suggestions.push(
      suggest("onboarding", "high",
        "No sessions recorded yet. Start your first session to begin collecting optimization data"),
    )
    return suggestions
  }

  const recentRow = yield* db
    .select({ count: sql<number>`count(*)` })
    .from(SessionTable)
    .where(sql`time_created > ${Date.now() - 7 * 24 * 60 * 60 * 1000}`)
    .all()
    .pipe(Effect.orDie)

  const recentSessions = recentRow[0]?.count ?? 0
  if (recentSessions === 0 && totalSessions > 0) {
    suggestions.push(
      suggest("engagement", "low",
        "No sessions in the last 7 days. Use 'voracode' to start a new session and make the most of your configured tools"),
    )
  }

  if (totalSessions > 100) {
    suggestions.push(
      suggest("session-cleanup", "low",
        totalSessions + " sessions accumulated. Old sessions can be archived or deleted via 'voracode session delete'"),
    )
  }

  return suggestions
})

export const ImproveCommand = effectCmd({
  command: "improve",
  describe: "analyze usage and suggest optimizations",
  instance: false,
  handler: Effect.fn("Cli.improve")(function* () {
    const modelSuggestions = yield* analyzeModelUsage()
    const agentSuggestions = yield* analyzeAgentConfig()
    const patternSuggestions = yield* analyzeSessionPatterns()

    const all = [...modelSuggestions, ...agentSuggestions, ...patternSuggestions]

    if (all.length === 0) {
      console.log("No optimization suggestions available yet.")
      return
    }

    const byPriority = (p: string) => all.filter((s) => s.priority === p)
    const high = byPriority("high")
    const med = byPriority("medium")
    const low = byPriority("low")

    const render = (label: string, items: Suggestion[]) => {
      if (items.length === 0) return
      console.log(label)
      for (const s of items) {
        console.log("  [" + s.category + "] " + s.message)
      }
      console.log()
    }

    render("High Priority:", high)
    render("Medium Priority:", med)
    render("Low Priority:", low)
  }),
})
