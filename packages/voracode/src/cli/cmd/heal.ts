import { Effect } from "effect"
import { effectCmd } from "../effect-cmd"
import { ConfigParse } from "@/config/parse"
import { ConfigV1 } from "@voracode-ai/core/v1/config/config"
import { Database } from "@voracode-ai/core/database/database"
import { Global } from "@voracode-ai/core/global"
import { sql } from "drizzle-orm"
import matter from "gray-matter"
import path from "path"
import fs from "fs/promises"
import { execFile } from "child_process"
import { promisify } from "util"

const execFileAsync = promisify(execFile)

interface CheckResult {
  name: string
  status: "ok" | "warn" | "error"
  message: string
}

const printChecks = (results: CheckResult[]) => {
  const errorCount = results.filter((r) => r.status === "error").length
  const warnCount = results.filter((r) => r.status === "warn").length

  for (const r of results) {
    const icon = r.status === "ok" ? "OK" : r.status === "warn" ? "WW" : "EE"
    console.log("  [" + icon + "] " + r.message)
  }

  console.log()
  if (errorCount > 0 || warnCount > 0) {
    console.log("Found " + errorCount + " error(s), " + warnCount + " warning(s)")
  } else {
    console.log("All checks passed")
  }
}

const checkConfigFiles = Effect.fn("Cli.heal.checkConfig")(function* () {
  const results: CheckResult[] = []
  const candidates = ["voracode.jsonc", "voracode.json", "config.json"]
  const files = candidates.map((f) => path.join(Global.Path.config, f))

  const existing: string[] = []
  for (const file of files) {
    const ok = yield* Effect.promise(() => fs.access(file).then(() => true).catch(() => false))
    if (ok) existing.push(file)
  }

  if (existing.length === 0) {
    results.push({ name: "config-files", status: "warn", message: "No config files found in " + Global.Path.config })
    return results
  }

  for (const file of existing) {
    const text = yield* Effect.promise(() => fs.readFile(file, "utf-8").catch(() => null))
    if (text === null) {
      results.push({ name: "config-file", status: "error", message: "Cannot read " + file })
      continue
    }

    try {
      const parsed = ConfigParse.jsonc(text, file)
      ConfigParse.schema(ConfigV1.Info, parsed, file)
      results.push({ name: "config-file", status: "ok", message: "Valid: " + file })
    } catch (e) {
      results.push({
        name: "config-file",
        status: "error",
        message: "Invalid config " + file + ": " + (e instanceof Error ? e.message : String(e)),
      })
    }
  }

  return results
})

const checkAgentFiles = Effect.fn("Cli.heal.checkAgents")(function* () {
  const results: CheckResult[] = []
  const agentDirs = [
    path.join(Global.Path.config, "agents"),
    path.join(yield* Effect.promise(() => Promise.resolve(process.cwd())), ".voracode", "agents"),
  ]

  for (const dir of agentDirs) {
    let files: string[]
    try {
      files = yield* Effect.promise(() => fs.readdir(dir))
    } catch {
      continue
    }

    for (const file of files) {
      if (!file.endsWith(".md")) continue
      const filepath = path.join(dir, file)
      let content: string
      try {
        content = yield* Effect.promise(() => fs.readFile(filepath, "utf-8"))
      } catch {
        continue
      }

      try {
        const parsed = matter(content)
        if (!parsed.data.description) {
          results.push({
            name: "agent-integrity",
            status: "warn",
            message: "Agent " + file + " is missing description frontmatter",
          })
        }
      } catch (e) {
        results.push({
          name: "agent-integrity",
          status: "error",
          message: "Failed to parse agent " + file + ": " + (e instanceof Error ? e.message : String(e)),
        })
      }
    }
  }

  if (results.length === 0) {
    results.push({ name: "agent-integrity", status: "ok", message: "All agent files look valid" })
  }

  return results
})

const checkDatabaseHealth = Effect.fn("Cli.heal.checkDatabase")(function* () {
  const results: CheckResult[] = []
  const dbPath = Database.path()
  const exists = yield* Effect.promise(() => fs.access(dbPath).then(() => true).catch(() => false))
  if (!exists) {
    results.push({ name: "database", status: "warn", message: "No database file found at " + dbPath })
    return results
  }

  try {
    const { db } = yield* Database.Service
    const rows = yield* db.all<{ integrity_check: string }>(sql.raw("PRAGMA integrity_check")).pipe(Effect.orDie)
    const ok = rows.every((r) => r.integrity_check === "ok")
    if (ok) {
      results.push({ name: "database", status: "ok", message: "Database integrity check passed" })
    } else {
      results.push({
        name: "database",
        status: "error",
        message: "Database integrity check failed: " + JSON.stringify(rows),
      })
    }
  } catch (e) {
    results.push({
      name: "database",
      status: "error",
      message: "Database error: " + (e instanceof Error ? e.message : String(e)),
    })
  }

  return results
})

const checkDiskSpace = Effect.fn("Cli.heal.checkDisk")(function* () {
  const results: CheckResult[] = []
  const dirs = [
    { name: "config-disk", dir: Global.Path.config },
    { name: "data-disk", dir: Global.Path.data },
  ]

  for (const { name, dir } of dirs) {
    try {
      const freeGB = yield* Effect.promise<number>(async () => {
        if (process.platform === "win32") {
          const drive = path.parse(dir).root.replace("\\", "")
          const { stdout } = await execFileAsync("fsutil", ["volume", "diskfree", drive], { timeout: 5000 })
          const m = stdout.match(/Total # of free bytes\s*:\s*(\d+)/i)
          if (m) return Number(m[1]) / 1_073_741_824
          throw new Error("Could not parse fsutil output")
        }
        const { stdout } = await execFileAsync("df", ["-k", dir], { timeout: 5000 })
        const lines = stdout.trim().split("\n")
        if (lines.length < 2) throw new Error("Could not parse df output")
        const parts = lines[1].split(/\s+/)
        return Number(parts[3]) / 1_048_576
      })

      if (freeGB < 1) {
        results.push({ name, status: "error", message: "Low disk space: " + freeGB.toFixed(1) + " GB free" })
      } else if (freeGB < 5) {
        results.push({ name, status: "warn", message: "Low disk space: " + freeGB.toFixed(1) + " GB free" })
      } else {
        results.push({ name, status: "ok", message: freeGB.toFixed(1) + " GB free" })
      }
    } catch (e) {
      results.push({
        name,
        status: "warn",
        message: "Could not check disk space: " + (e instanceof Error ? e.message : String(e)),
      })
    }
  }

  return results
})

const fixConfigFiles = Effect.fn("Cli.heal.fixConfig")(function* () {
  const results: CheckResult[] = []
  const candidates = ["voracode.jsonc", "voracode.json", "config.json"]
  const files = candidates.map((f) => path.join(Global.Path.config, f))

  for (const file of files) {
    const text = yield* Effect.promise(() => fs.readFile(file, "utf-8").catch(() => null))
    if (text === null) continue

    let needsReset = false
    try {
      const parsed = ConfigParse.jsonc(text, file)
      ConfigParse.schema(ConfigV1.Info, parsed, file)
    } catch {
      needsReset = true
    }

    if (needsReset) {
      const backup = file + ".bak." + Date.now()
      yield* Effect.promise(() => fs.copyFile(file, backup))
      yield* Effect.promise(() => fs.writeFile(file, JSON.stringify({ version: 1 }, null, 2), "utf-8"))
      results.push({
        name: "config-fix",
        status: "ok",
        message: "Reset " + file + " to minimal valid config (backup: " + backup + ")",
      })
    }
  }

  return results
})

export const HealCommand = effectCmd({
  command: "heal",
  describe: "system diagnostics and auto-repair",
  instance: false,
  builder: (yargs) =>
    yargs.option("fix", {
      describe: "auto-repair issues found",
      type: "boolean",
      default: false,
    }),
  handler: Effect.fn("Cli.heal")(function* (args) {
    console.log("Running diagnostics...")
    console.log()

    const configResults = yield* checkConfigFiles()
    const agentResults = yield* checkAgentFiles()
    const dbResults = yield* checkDatabaseHealth()
    const diskResults = yield* checkDiskSpace()

    const allResults = [...configResults, ...agentResults, ...dbResults, ...diskResults]
    printChecks(allResults)

    if (args.fix) {
      console.log()
      console.log("Attempting auto-repair...")
      const fixResults = yield* fixConfigFiles()
      for (const r of fixResults) {
        const icon = r.status === "ok" ? "OK" : "EE"
        console.log("  [" + icon + "] " + r.message)
      }
    }
  }),
})
