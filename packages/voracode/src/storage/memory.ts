import path from "path"
import fs from "fs/promises"
import { Global } from "@voracode-ai/core/global"

export interface MemoryEntry {
  key: string
  value: unknown
  timestamp: number
  tags: string[]
}

const memoryDir = path.join(Global.Path.data, "memory")

function memoryFile(key: string): string {
  return path.join(memoryDir, `${key}.json`)
}

async function ensureMemoryDir(): Promise<void> {
  await fs.mkdir(memoryDir, { recursive: true })
}

export async function saveMemory(key: string, value: unknown, tags: string[] = []): Promise<void> {
  await ensureMemoryDir()
  const entry: MemoryEntry = { key, value, timestamp: Date.now(), tags }
  await fs.writeFile(memoryFile(key), JSON.stringify(entry, null, 2), "utf-8")
}

export async function getMemory(key: string): Promise<MemoryEntry | null> {
  try {
    const content = await fs.readFile(memoryFile(key), "utf-8")
    return JSON.parse(content) as MemoryEntry
  } catch {
    return null
  }
}

export async function getAllMemory(): Promise<MemoryEntry[]> {
  await ensureMemoryDir()
  let files: string[]
  try {
    files = await fs.readdir(memoryDir)
  } catch {
    return []
  }
  const entries: MemoryEntry[] = []
  for (const file of files) {
    if (!file.endsWith(".json")) continue
    try {
      const content = await fs.readFile(path.join(memoryDir, file), "utf-8")
      entries.push(JSON.parse(content) as MemoryEntry)
    } catch {
      // skip corrupt entries
    }
  }
  return entries.sort((a, b) => b.timestamp - a.timestamp)
}

export async function addMemory(key: string, value: unknown, tags: string[] = []): Promise<MemoryEntry> {
  const existing = await getMemory(key)
  const mergedTags = existing ? [...new Set([...existing.tags, ...tags])] : tags
  const entry: MemoryEntry = { key, value, timestamp: Date.now(), tags: mergedTags }
  await fs.writeFile(memoryFile(key), JSON.stringify(entry, null, 2), "utf-8")
  return entry
}

export async function searchMemory(query: string): Promise<MemoryEntry[]> {
  const all = await getAllMemory()
  const lower = query.toLowerCase()
  return all.filter(
    (entry) =>
      entry.key.toLowerCase().includes(lower) ||
      JSON.stringify(entry.value).toLowerCase().includes(lower) ||
      entry.tags.some((t) => t.toLowerCase().includes(lower)),
  )
}

export * as Memory from "./memory"
