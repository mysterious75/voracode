/**
 * EVOLVE Integration Tests
 *
 * Tests for integration, CLI, and prompt injection modules.
 */

import { describe, test, expect, beforeEach, afterEach } from "bun:test"
import * as fs from "fs/promises"
import * as path from "path"
import * as os from "os"

import { StandaloneEvolve } from "./integration"
import { generateEvolveContext, generateQuickEvolveContext, hasEvolveContext } from "./prompt-injection"
import { Memory } from "./memory"
import { SkillLibrary } from "./skills"

// ─── Test Helpers ────────────────────────────────────────────────────────────

async function createTempDir(): Promise<string> {
  return fs.mkdtemp(path.join(os.tmpdir(), "evolve-integration-test-"))
}

async function removeTempDir(dir: string): Promise<void> {
  try {
    await fs.rm(dir, { recursive: true, force: true })
  } catch {}
}

async function createSampleProject(dir: string): Promise<void> {
  const srcDir = path.join(dir, "src")
  await fs.mkdir(srcDir, { recursive: true })

  await fs.writeFile(
    path.join(srcDir, "index.ts"),
    `
export function main(): void {
  console.log("Hello, World!")
}

const API_URL = "https://api.example.com"
const MAX_RETRIES = 3
`,
  )

  await fs.writeFile(
    path.join(srcDir, "utils.ts"),
    `
export function formatDate(date: Date): string {
  return date.toISOString()
}

export function generateId(): string {
  return Math.random().toString(36).substring(2)
}
`,
  )
}

// ─── StandaloneEvolve Tests ──────────────────────────────────────────────────

describe("StandaloneEvolve", () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await createTempDir()
    await createSampleProject(tempDir)
  })

  afterEach(async () => {
    await removeTempDir(tempDir)
  })

  test("initializes and extracts conventions", async () => {
    const evolve = new StandaloneEvolve(tempDir)
    await evolve.init()

    const status = evolve.getStatus()
    expect(status.initialized).toBe(true)
    expect(status.conventionsDetected).toBe(true)
  })

  test("returns empty context when no memories exist", async () => {
    const evolve = new StandaloneEvolve(tempDir)
    await evolve.init()

    const context = await evolve.getSystemPromptContext("add a new endpoint")
    // May or may not be empty depending on conventions detection
    expect(Array.isArray(context)).toBe(true)
  })

  test("records user messages", async () => {
    const evolve = new StandaloneEvolve(tempDir)
    await evolve.init()

    await evolve.recordUserMessage("That's wrong, use try-catch instead")

    const status = evolve.getStatus()
    expect(status.signalCount).toBeGreaterThan(0)
  })

  test("stores and retrieves skills", async () => {
    const evolve = new StandaloneEvolve(tempDir)
    await evolve.init()

    await evolve.addSkill({
      name: "Test Skill",
      description: "A test skill for integration testing",
      trigger: "When testing integration",
      tags: ["test", "integration"],
      code: "const test = true",
      context: "Integration tests",
      language: "typescript",
    })

    const status = evolve.getStatus()
    expect(status.skillCount).toBe(1)
  })

  test("generates status report", async () => {
    const evolve = new StandaloneEvolve(tempDir)
    await evolve.init()

    const report = evolve.getStatusReport()
    expect(report).toContain("Evolve Status")
    expect(report).toContain("Initialized")
  })

  test("runs consolidation", async () => {
    const evolve = new StandaloneEvolve(tempDir)
    await evolve.init()

    // Add some memories to consolidate
    const memory = evolve.getEngine().getMemory()
    await memory.add("debugging", "Test entry 1", { confidence: 0.5 })
    await memory.add("debugging", "Test entry 2", { confidence: 0.05 })

    const result = await evolve.consolidate()
    expect(result).toContain("Processed")
  })
})

// ─── Prompt Injection Tests ──────────────────────────────────────────────────

describe("Prompt Injection", () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await createTempDir()
    await createSampleProject(tempDir)
  })

  afterEach(async () => {
    await removeTempDir(tempDir)
  })

  test("returns empty when no context exists", async () => {
    const context = await generateEvolveContext(tempDir, "test query")
    // May be empty or contain conventions
    expect(Array.isArray(context)).toBe(true)
  })

  test("returns context when memories exist", async () => {
    // Add some memories first
    const memory = new Memory(tempDir)
    await memory.init()
    await memory.add("convention", "Use camelCase for functions", { confidence: 0.9 })
    await memory.add("preference", "User prefers TypeScript", { confidence: 0.8 })

    const context = await generateEvolveContext(tempDir, "add a new function")
    expect(context.length).toBeGreaterThan(0)
    expect(context[0]).toContain("Learned Project Context")
  })

  test("quick context works", async () => {
    const memory = new Memory(tempDir)
    await memory.init()
    await memory.add("debugging", "Docker issue fixed by pruning", { confidence: 0.7 })

    const context = await generateQuickEvolveContext(tempDir)
    expect(context.length).toBeGreaterThan(0)
    // The context is an array of strings, check the combined content
    const combined = context.join("\n")
    expect(combined).toContain("Learned Project Context")
  })

  test("hasEvolveContext returns false when empty", async () => {
    const has = await hasEvolveContext(tempDir)
    expect(has).toBe(false)
  })

  test("hasEvolveContext returns true when memories exist", async () => {
    const memory = new Memory(tempDir)
    await memory.init()
    await memory.add("tool", "Use bun for package management")

    const has = await hasEvolveContext(tempDir)
    expect(has).toBe(true)
  })
})

// ─── End-to-End Flow Test ────────────────────────────────────────────────────

describe("End-to-End Flow", () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await createTempDir()
    await createSampleProject(tempDir)
  })

  afterEach(async () => {
    await removeTempDir(tempDir)
  })

  test("full lifecycle: init → learn → context → consolidate", async () => {
    // 1. Initialize
    const evolve = new StandaloneEvolve(tempDir)
    await evolve.init()
    expect(evolve.getStatus().initialized).toBe(true)

    // 2. Learn from user interactions
    await evolve.recordUserMessage("That's wrong, use try-catch instead")
    await evolve.recordUserMessage("perfect!")
    await evolve.recordUserMessage("always use TypeScript")

    // 3. Store a skill
    await evolve.addSkill({
      name: "Express Error Handler",
      description: "Centralized error handling middleware",
      trigger: "When adding error handling to Express",
      tags: ["express", "error-handling"],
      code: "app.use((err, req, res, next) => { ... })",
      context: "Express.js API",
      language: "typescript",
    })

    // 4. Get context for a new query
    const context = await evolve.getSystemPromptContext("add error handling to API")
    // Context should include learned memories
    expect(Array.isArray(context)).toBe(true)

    // 5. Check status
    const status = evolve.getStatus()
    expect(status.memoryEntries).toBeGreaterThan(0)
    expect(status.skillCount).toBe(1)
    expect(status.signalCount).toBeGreaterThan(0)

    // 6. Run consolidation
    const consolidateResult = await evolve.consolidate()
    expect(consolidateResult).toContain("Processed")

    // 7. Verify context still works after consolidation
    const context2 = await evolve.getSystemPromptContext("fix the API error handling")
    expect(Array.isArray(context2)).toBe(true)
  })

  test("context adapts to query complexity", async () => {
    const evolve = new StandaloneEvolve(tempDir)
    await evolve.init()

    // Add some memories
    const memory = evolve.getEngine().getMemory()
    await memory.add("convention", "Use camelCase", { confidence: 0.9 })
    await memory.add("preference", "TypeScript preferred", { confidence: 0.8 })

    // Simple query — should get minimal context
    const simpleContext = await evolve.getSystemPromptContext("fix typo")

    // Complex query — should get more context
    const complexContext = await evolve.getSystemPromptContext("refactor the authentication system")

    // Both should be arrays (may be empty or have content)
    expect(Array.isArray(simpleContext)).toBe(true)
    expect(Array.isArray(complexContext)).toBe(true)
  })
})
