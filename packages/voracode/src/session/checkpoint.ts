import path from "path"
import fs from "fs/promises"
import { Global } from "@voracode-ai/core/global"

const DEFAULT_SAVE_INTERVAL = 5
const DEFAULT_KEEP_LAST = 3

export interface CheckpointData {
  readonly sessionID: string
  readonly turnNumber: number
  readonly messages: Array<{ role: string; content: string }>
  readonly timestamp: number
  readonly agentName: string
  readonly modelID: string
}

function checkpointDir(sessionID: string) {
  return path.join(Global.Path.data, "checkpoints", sessionID)
}

function checkpointPath(sessionID: string, turnNumber: number) {
  return path.join(checkpointDir(sessionID), `turn-${turnNumber}.json`)
}

export async function saveCheckpoint(sessionID: string, data: CheckpointData) {
  const dir = checkpointDir(sessionID)
  await fs.mkdir(dir, { recursive: true })
  const filePath = checkpointPath(sessionID, data.turnNumber)
  await Bun.write(filePath, JSON.stringify(data, null, 2))
}

export async function loadLastCheckpoint(sessionID: string): Promise<CheckpointData | undefined> {
  const dir = checkpointDir(sessionID)
  const exists = await fs.stat(dir).then(() => true, () => false)
  if (!exists) return undefined

  const files = await fs.readdir(dir)
  const turnFiles = files
    .filter((f) => f.startsWith("turn-") && f.endsWith(".json"))
    .map((f) => {
      const num = Number.parseInt(f.slice("turn-".length, -".json".length), 10)
      return { file: f, num }
    })
    .filter((f) => !Number.isNaN(f.num))
    .sort((a, b) => b.num - a.num)

  if (!turnFiles.length) return undefined

  const latest = turnFiles[0]!
  const content = await Bun.file(path.join(dir, latest.file)).json()
  return content as CheckpointData
}

export async function listCheckpoints(sessionID: string): Promise<CheckpointData[]> {
  const dir = checkpointDir(sessionID)
  const exists = await fs.stat(dir).then(() => true, () => false)
  if (!exists) return []

  const files = await fs.readdir(dir)
  const results: CheckpointData[] = []

  for (const file of files) {
    if (!file.startsWith("turn-") || !file.endsWith(".json")) continue
    const content = await Bun.file(path.join(dir, file)).json()
    results.push(content as CheckpointData)
  }

  return results.sort((a, b) => b.turnNumber - a.turnNumber)
}

export async function deleteOldCheckpoints(sessionID: string, keepLast: number = DEFAULT_KEEP_LAST) {
  const dir = checkpointDir(sessionID)
  const exists = await fs.stat(dir).then(() => true, () => false)
  if (!exists) return

  const files = await fs.readdir(dir)
  const turnFiles = files
    .filter((f) => f.startsWith("turn-") && f.endsWith(".json"))
    .map((f) => {
      const num = Number.parseInt(f.slice("turn-".length, -".json".length), 10)
      return { file: f, num }
    })
    .filter((f) => !Number.isNaN(f.num))
    .sort((a, b) => b.num - a.num)

  const toDelete = turnFiles.slice(keepLast)
  for (const { file } of toDelete) {
    await fs.unlink(path.join(dir, file))
  }
}

export function shouldCheckpoint(turnNumber: number, interval: number = DEFAULT_SAVE_INTERVAL) {
  return turnNumber > 0 && turnNumber % interval === 0
}

export * as SessionCheckpoint from "./checkpoint"
