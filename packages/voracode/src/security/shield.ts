import path from "path"
import os from "os"

export interface ValidationResult {
  valid: boolean
  reason?: string
  sanitized?: Record<string, unknown>
}

const DANGEROUS_COMMAND_PATTERNS = [
  /\brm\s+(-[a-zA-Z]*f[a-zA-Z]*\s+|-[a-zA-Z]*r[a-zA-Z]*\s+).*\//,
  /\brm\s+-rf\s+\//,
  /\bformat\s+[a-zA-Z]:/i,
  /\bshutdown\b/,
  /\breboot\b/,
  /\binit\s+[06]\b/,
  /\bmkfs\b/,
  /\bdd\s+.*of=\/dev\//,
  /\b:\(\)\s*\{\s*:\|:\s*&\s*\};\s*:/,
  /\bchmod\s+-R\s+777\s+\//,
  /\bchown\s+-R\s+.*\//,
  />\s*\/dev\/sd[a-z]/,
  /\bkill\s+-9\s+-1/,
  /\bpkill\s+-9/,
  /\bkillall\b/,
  /\bsudo\s+rm\b/,
  /\bsudo\s+chmod\b/,
  /\bsudo\s+chown\b/,
  /\bsudo\s+mv\s+.*\s+\//,
  /\bnohup\b.*&/,
]

const DANGEROUS_URL_PATTERNS = [
  /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|::1)(:\d+)?/i,
  /^https?:\/\/(10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|192\.168\.\d+\.\d+)(:\d+)?/i,
  /^https?:\/\/\[::1\]/i,
  /^https?:\/\/\[::ffff:(127\.0\.0\.1|0\.0\.0\.0|localhost)\]/i,
  /^https?:\/\/.*@/i,
  /^file:\/\//i,
]

const SECRET_ENV_VAR_PATTERNS = [
  /password/i,
  /secret/i,
  /token/i,
  /api[_-]?key/i,
  /auth/i,
  /credential/i,
  /private[_-]?key/i,
  /access[_-]?key/i,
  /client[_-]?secret/i,
  /database[_-]?url/i,
  /dsn/i,
]

const WORKSPACE_TRAVERSAL_PATTERNS = [
  /\.\./,
  /^~\//,
  /^\//,
]

function validateFilePath(filePath: string, workspaceDir: string): ValidationResult {
  const normalized = path.normalize(filePath)
  for (const pattern of WORKSPACE_TRAVERSAL_PATTERNS) {
    if (pattern.test(normalized)) {
      if (normalized.startsWith("..") || path.isAbsolute(normalized)) {
        const resolved = path.resolve(workspaceDir, normalized)
        if (!resolved.startsWith(workspaceDir)) {
          return { valid: false, reason: `Path traversal detected: ${filePath}` }
        }
      }
    }
  }
  return { valid: true }
}

function validateUrl(url: string): ValidationResult {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return { valid: false, reason: `Invalid URL: ${url}` }
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { valid: false, reason: `Only HTTP/HTTPS URLs allowed: ${parsed.protocol}` }
  }

  for (const pattern of DANGEROUS_URL_PATTERNS) {
    if (pattern.test(url)) {
      return { valid: false, reason: `Blocked URL pattern: ${url}` }
    }
  }

  const hostname = parsed.hostname.toLowerCase()
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "0.0.0.0" || hostname === "::1") {
    return { valid: false, reason: `SSRF blocked: localhost/internal address` }
  }

  const ipMatch = hostname.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/)
  if (ipMatch) {
    const [, a, b] = ipMatch.map(Number)
    if (
      a === 10 ||
      (a === 172 && b !== undefined && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a === 169 ||
      (a === 100 && b !== undefined && b >= 64 && b <= 127)
    ) {
      return { valid: false, reason: `SSRF blocked: private/link-local IP address` }
    }
  }

  return { valid: true }
}

function validateCommand(command: string): ValidationResult {
  for (const pattern of DANGEROUS_COMMAND_PATTERNS) {
    if (pattern.test(command)) {
      return { valid: false, reason: `Dangerous command pattern detected: ${pattern.source}` }
    }
  }
  return { valid: true }
}

function validateEnvVars(env: Record<string, unknown>): ValidationResult {
  const sanitized: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(env)) {
    const isSecret = SECRET_ENV_VAR_PATTERNS.some((p) => p.test(key))
    if (isSecret) {
      sanitized[key] = "***REDACTED***"
    } else {
      sanitized[key] = value
    }
  }
  return { valid: true, sanitized }
}

export function validateToolInput(
  toolName: string,
  args: Record<string, unknown>,
  workspaceDir: string,
): ValidationResult {
  if (toolName === "bash" || toolName === "shell") {
    const command = typeof args.command === "string" ? args.command : typeof args.cmd === "string" ? args.cmd : undefined
    if (command) {
      const result = validateCommand(command)
      if (!result.valid) return result
    }
  }

  const pathArgs = ["path", "file", "filePath", "target", "source", "dest"]
  for (const key of pathArgs) {
    const value = args[key]
    if (typeof value === "string") {
      const result = validateFilePath(value, workspaceDir)
      if (!result.valid) return result
    }
  }

  const urlArgs = ["url", "uri", "href", "endpoint"]
  for (const key of urlArgs) {
    const value = args[key]
    if (typeof value === "string") {
      const result = validateUrl(value)
      if (!result.valid) return result
    }
  }

  const env = args.env
  if (env && typeof env === "object" && !Array.isArray(env)) {
    const result = validateEnvVars(env as Record<string, unknown>)
    if (result.sanitized) {
      return { valid: true, sanitized: { ...args, env: result.sanitized } }
    }
  }

  return { valid: true }
}

export * as Shield from "./shield"
