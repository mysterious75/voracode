import { Global } from "@voracode-ai/core/global"
import fs from "fs/promises"
import path from "path"

const DANGEROUS_COMMANDS = [
  /\brm\s+-rf\b/,
  /\bformat\b/,
  /\bshutdown\b/,
  /\breboot\b/,
  /\bmkfs\b/,
  /\bdd\b.*of=\/dev\//,
  /\bsudo\b/,
  /\bkill\b/,
  /\bpkill\b/,
]

export interface Task {
  id: string
  name: string
  command: string
  interval?: number
  cron?: string
  lastRun?: number
  nextRun: number
  enabled: boolean
}

const TASKS_PATH = path.join(Global.Path.data, "scheduler", "tasks.json")
let tasks: Map<string, Task> = new Map()

async function ensureDir() {
  await fs.mkdir(path.dirname(TASKS_PATH), { recursive: true })
}

async function loadTasks(): Promise<Map<string, Task>> {
  try {
    const raw = await Bun.file(TASKS_PATH).text()
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Map()
    const map = new Map<string, Task>()
    for (const entry of parsed) {
      if (
        entry &&
        typeof entry === "object" &&
        typeof (entry as Task).id === "string" &&
        typeof (entry as Task).name === "string" &&
        typeof (entry as Task).command === "string" &&
        typeof (entry as Task).nextRun === "number"
      ) {
        map.set((entry as Task).id, entry as Task)
      }
    }
    return map
  } catch {
    return new Map()
  }
}

async function saveTasks() {
  await ensureDir()
  const entries = Array.from(tasks.values())
  await Bun.write(TASKS_PATH, JSON.stringify(entries, null, 2))
}

function parseCronField(field: string, min: number, max: number): number[] {
  if (field === "*") {
    return Array.from({ length: max - min + 1 }, (_, i) => min + i)
  }
  if (field.startsWith("*/")) {
    const step = parseInt(field.slice(2), 10)
    if (Number.isNaN(step) || step <= 0) return []
    return Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => min + i * step)
  }
  if (field.includes(",")) {
    return field.split(",").flatMap((f) => parseCronField(f.trim(), min, max))
  }
  if (field.includes("-")) {
    const [start, end] = field.split("-").map((s) => parseInt(s.trim(), 10))
    if (Number.isNaN(start) || Number.isNaN(end)) return []
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }
  const val = parseInt(field, 10)
  if (Number.isNaN(val) || val < min || val > max) return []
  return [val]
}

function parseCronExpression(expr: string): ((date: Date) => boolean) | undefined {
  const parts = expr.trim().split(/\s+/)
  if (parts.length !== 5) return undefined

  const [minuteField, hourField, domField, monthField, dowField] = parts

  const minutes = parseCronField(minuteField ?? "*", 0, 59)
  const hours = parseCronField(hourField ?? "*", 0, 23)
  const doms = parseCronField(domField ?? "*", 1, 31)
  const months = parseCronField(monthField ?? "*", 1, 12)
  const dows = parseCronField(dowField ?? "*", 0, 6)

  return (date: Date) => {
    return (
      minutes.includes(date.getMinutes()) &&
      hours.includes(date.getHours()) &&
      doms.includes(date.getDate()) &&
      months.includes(date.getMonth() + 1) &&
      dows.includes(date.getDay())
    )
  }
}

function resolveCronAlias(expr: string): string {
  const aliases: Record<string, string> = {
    "@daily": "0 0 * * *",
    "@hourly": "0 * * * *",
    "@weekly": "0 0 * * 0",
    "@monthly": "0 0 1 * *",
    "@yearly": "0 0 1 1 *",
    "@annually": "0 0 1 1 *",
  }
  return aliases[expr] ?? expr
}

function computeNextRun(task: Task, now: number): number {
  if (task.interval) {
    return now + task.interval
  }

  if (task.cron) {
    const expr = resolveCronAlias(task.cron)
    const matcher = parseCronExpression(expr)
    if (!matcher) return now + 60_000

    const candidate = new Date(now)
    candidate.setSeconds(0)
    candidate.setMilliseconds(0)

    for (let i = 0; i < 366 * 24 * 60; i++) {
      candidate.setMinutes(candidate.getMinutes() + 1)
      if (matcher(candidate)) {
        return candidate.getTime()
      }
    }
  }

  return now + 60_000
}

export async function init() {
  tasks = await loadTasks()
}

function isDangerousCommand(command: string): boolean {
  return DANGEROUS_COMMANDS.some((p) => p.test(command))
}

export async function scheduleTask(task: Task): Promise<Task> {
  if (isDangerousCommand(task.command)) {
    throw new Error(`Refusing to schedule dangerous command: ${task.command}`)
  }
  const now = Date.now()
  const entry: Task = {
    ...task,
    nextRun: task.nextRun ?? computeNextRun({ ...task, nextRun: task.nextRun ?? now }, now),
  }
  tasks.set(entry.id, entry)
  await saveTasks()
  return entry
}

export async function cancelTask(id: string): Promise<boolean> {
  const existed = tasks.has(id)
  tasks.delete(id)
  if (existed) await saveTasks()
  return existed
}

export async function listTasks(): Promise<Task[]> {
  return Array.from(tasks.values())
}

export async function runDueTasks(): Promise<Task[]> {
  const now = Date.now()
  const due: Task[] = []

  for (const task of tasks.values()) {
    if (!task.enabled) continue
    if (task.nextRun <= now) {
      due.push(task)
    }
  }

  const executed: Task[] = []
  for (const task of due) {
    try {
      const args = task.command.split(/\s+/)
      const proc = Bun.spawn(args, { stdout: "inherit", stderr: "inherit" })
      await proc.exited
      task.lastRun = now
      task.nextRun = computeNextRun(task, now)
      executed.push(task)
    } catch {
      task.nextRun = computeNextRun(task, now)
    }
  }

  if (executed.length) await saveTasks()
  return executed
}

export * as Scheduler from "."
