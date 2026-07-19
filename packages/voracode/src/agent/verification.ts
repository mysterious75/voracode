import { stat } from "fs/promises"
import { existsSync } from "fs"

export interface VerificationResult {
  success: boolean
  message: string
  details?: Record<string, unknown>
}

function isEnoent(e: unknown): e is { code: "ENOENT" } {
  return typeof e === "object" && e !== null && "code" in e && (e as { code: string }).code === "ENOENT"
}

export async function verifyFileWritten(filePath: string): Promise<VerificationResult> {
  try {
    const stats = await stat(filePath)
    return {
      success: stats.isFile(),
      message: `File exists at ${filePath} (${stats.size} bytes)`,
      details: { size: stats.size },
    }
  } catch (e) {
    if (isEnoent(e)) {
      return {
        success: false,
        message: `File not found at ${filePath}`,
      }
    }
    throw e
  }
}

export async function verifyFileDeleted(filePath: string): Promise<VerificationResult> {
  if (!existsSync(filePath)) {
    return {
      success: true,
      message: `File deleted at ${filePath}`,
    }
  }
  return {
    success: false,
    message: `File still exists at ${filePath}`,
  }
}

export async function verifyDirectoryCreated(dirPath: string): Promise<VerificationResult> {
  try {
    const stats = await stat(dirPath)
    return {
      success: stats.isDirectory(),
      message: `Directory exists at ${dirPath}`,
      details: {},
    }
  } catch (e) {
    if (isEnoent(e)) {
      return {
        success: false,
        message: `Directory not found at ${dirPath}`,
      }
    }
    throw e
  }
}

export function verifyCommandSuccess(command: string, exitCode: number): VerificationResult {
  return {
    success: exitCode === 0,
    message:
      exitCode === 0
        ? `Command succeeded: ${command}`
        : `Command failed with exit code ${exitCode}: ${command}`,
    details: { exitCode },
  }
}

export async function autoVerifyToolCall(
  toolName: string,
  args: Record<string, unknown>,
  result?: { exitCode?: number },
): Promise<VerificationResult> {
  switch (toolName) {
    case "write":
    case "createFile":
    case "edit":
    case "applyDiff":
      return verifyFileWritten((args.filePath ?? args.path) as string)
    case "deleteFile":
    case "removeFile":
      return verifyFileDeleted((args.filePath ?? args.path) as string)
    case "createDirectory":
    case "mkdir":
    case "makeDirectory":
      return verifyDirectoryCreated((args.dirPath ?? args.path) as string)
    case "bash":
    case "shell":
    case "runCommand":
      return verifyCommandSuccess(
        (args.command ?? args.cmd) as string,
        result?.exitCode ?? 0,
      )
    default:
      return {
        success: false,
        message: `No verifier available for tool: ${toolName}`,
      }
  }
}

export * as Verification from "./verification"
