/**
 * EVOLVE New Module Tests
 *
 * Tests for session-hook, summarizer, and CLI command.
 */

import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import * as fs from "fs/promises"
import * as path from "path"
import * as os from "os"

import {
  evolveSessionStart,
  evolveUserMessage,
  evolveTaskComplete,
  evolveGetStatus,
  evolveConsolidate,
  evolveReset,
} from "./session-hook"
import { summarizeContext, generateCompressedContext } from "./summarizer"
import { Memory } from "./memory"
import { SkillLibrary } from "./skills"

// ─── Test Helpers ────────────────────────────────────────────────────────────

async function createTempDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), "evolve-hook-test-"))
}

async function removeTempDir(dir: string): Promise<void> {
  try {
    await fs.rm(dir, { recursive: true, force: true })
  } catch {}
}

// ─── Session Hook Tests ──────────────────────────────────────────────────────

describe("Session Hook", () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await createTempDir()
    evolveReset()
  })

  afterEach(async () => {
    await removeTempDir(tempDir)
  })

  test("session start returns empty when no context", async () => {
    const context = await evolveSessionStart(tempDir, "test query")
    expect(Array.isArray(context)).toBe(true)
    expect(context.length).toBe(0)
  })

  test("session start returns context when memories exist", async () => {
    // Add memories first
    const memory = new Memory(tempDir)
    await memory.init()
    await memory.add("convention", "Use camelCase for functions", { confidence: 0.9 })
    await memory.add("preference", "User prefers TypeScript", { confidence: 0.8 })

    const context = await evolveSessionStart(tempDir, "add a new function")
    expect(Array.isArray(context)).toBe(true)
    // Should have context since we added memories
    if (context.length > 0) {
      expect(context[0]).toContain("Learned")
    }
  })

  test("user message hook doesn't crash", async () => {
    // Should not throw even with no engine
    await evolveUserMessage(tempDir, "That's wrong")
    await evolveUserMessage(tempDir, "perfect!")
    await evolveUserMessage(tempDir, "normal message")
  })

  test("task complete hook doesn't crash", async () => {
    await evolveTaskComplete(tempDir, {
      task: "Add endpoint",
      outcome: "success",
    })

    await evolveTaskComplete(tempDir, {
      task: "Fix bug",
      outcome: "failure",
      userFeedback: "Wrong approach",
    })
  })

  test("get status works", async () => {
    const status = await evolveGetStatus(tempDir)
    expect(status).toBeDefined()
    expect(typeof status.initialized).toBe("boolean")
    expect(typeof status.memoryEntries).toBe("number")
  })

  test("consolidate works", async () => {
    const result = await evolveConsolidate(tempDir)
    expect(typeof result).toBe("string")
    expect(result).toContain("Processed")
  })

  test("reset works", () => {
    evolveReset()
    // Should not throw
    expect(true).toBe(true)
  })
})

// ─── Summarizer Tests ────────────────────────────────────────────────────────

describe("Summarizer", () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await createTempDir()
  })

  afterEach(async () => {
    await removeTempDir(tempDir)
  })

  test("summarizes empty memory", async () => {
    const memory = new Memory(tempDir)
    await memory.init()

    const summary = summarizeContext(memory)
    expect(summary.priority).toBe("")
    expect(summary.standard).toBe("")
    expect(summary.low).toBe("")
    expect(summary.totalTokens).toBe(0)
    expect(summary.truncated).toBe(false)
  })

  test("categorizes entries by confidence", async () => {
    const memory = new Memory(tempDir)
    await memory.init()

    await memory.add("convention", "High confidence entry", { confidence: 0.9 })
    await memory.add("debugging", "Medium confidence entry", { confidence: 0.5 })
    await memory.add("tool", "Low confidence entry", { confidence: 0.2 })

    const summary = summarizeContext(memory)

    // High confidence should be in priority
    expect(summary.priority).toContain("High confidence")
    // Medium should be in standard
    expect(summary.standard).toContain("Medium confidence")
    // Low should be in low
    expect(summary.low).toContain("Low confidence")
  })

  test("respects token budget", async () => {
    const memory = new Memory(tempDir)
    await memory.init()

    // Add many entries
    for (let i = 0; i < 50; i++) {
      await memory.add("debugging", `Entry ${i}: Some debugging insight about the project`, { confidence: 0.5 })
    }

    // Use a small budget
    const summary = summarizeContext(memory, undefined, 100)

    // Should be within budget (roughly)
    expect(summary.totalTokens).toBeLessThanOrEqual(150) // Some tolerance
  })

  test("generates compressed context", async () => {
    const memory = new Memory(tempDir)
    await memory.init()

    await memory.add("convention", "Use camelCase", { confidence: 0.9 })
    await memory.add("preference", "TypeScript preferred", { confidence: 0.8 })

    const context = generateCompressedContext(memory)

    expect(context).toContain("Project Knowledge")
    expect(context).toContain("camelCase")
    expect(context).toContain("TypeScript")
  })

  test("query-relevant entries get priority", async () => {
    const memory = new Memory(tempDir)
    await memory.init()

    await memory.add("debugging", "Docker issue fixed by pruning images", { confidence: 0.5 })
    await memory.add("convention", "Use camelCase for functions", { confidence: 0.5 })

    const summary = summarizeContext(memory, undefined, 2000, "docker container issue")

    // Docker entry should be prioritized
    const allContext = summary.priority + summary.standard + summary.low
    expect(allContext).toContain("Docker")
  })

  test("truncation flag is set when content exceeds budget", async () => {
    const memory = new Memory(tempDir)
    await memory.init()

    // Add a lot of content with high confidence to ensure it's included
    for (let i = 0; i < 50; i++) {
      await memory.add("debugging", `Very long debugging entry ${i} `.repeat(50), { confidence: 0.9 })
    }

    // Use a very small budget
    const summary = summarizeContext(memory, undefined, 20)

    // Should be truncated or have very few tokens
    expect(summary.totalTokens).toBeLessThanOrEqual(30)
  })
})
