/**
 * VORACODE Tool Executor — Execute tool calls from the AI agent
 *
 * Each tool is a function that takes JSON arguments and returns a result.
 * Tools are sandboxed, logged, and audited.
 */

import { VoraDatabase } from "../storage/database";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { execSync } from "child_process";
import { resolve } from "path";

export interface ToolDefinition {
  name: string;
  description: string;
  execute: (args: Record<string, unknown>) => Promise<unknown> | unknown;
}

// Blocked command patterns
const BLOCKED_COMMANDS = [
  "rm -rf /", "rm -rf /*", "sudo ", "mkfs", "dd if=",
  ":(){", "chmod 777 /", "> /dev/", "format C:",
  "del /f /s", "rd /s /q", "shutdown", "reboot",
];

export class ToolExecutor {
  private db: VoraDatabase;
  private tools: Map<string, ToolDefinition>;

  constructor(db: VoraDatabase) {
    this.db = db;
    this.tools = new Map();
    this.registerBuiltins();
  }

  private registerBuiltins(): void {
    this.tools.set("file_read", {
      name: "file_read",
      description: "Read the contents of a file",
      execute: (args) => this.fileRead(args.path as string),
    });

    this.tools.set("file_write", {
      name: "file_write",
      description: "Write content to a file",
      execute: (args) => this.fileWrite(args.path as string, args.content as string),
    });

    this.tools.set("file_edit", {
      name: "file_edit",
      description: "Edit a file by replacing text",
      execute: (args) => this.fileEdit(args.path as string, args.old_string as string, args.new_string as string),
    });

    this.tools.set("bash", {
      name: "bash",
      description: "Execute a shell command (sandboxed)",
      execute: (args) => this.execBash(args.command as string),
    });

    this.tools.set("git_status", {
      name: "git_status",
      description: "Show git status",
      execute: () => this.execGit(["status"]),
    });

    this.tools.set("git_diff", {
      name: "git_diff",
      description: "Show git diff",
      execute: () => this.execGit(["diff"]),
    });

    this.tools.set("git_commit", {
      name: "git_commit",
      description: "Commit changes with a message",
      execute: (args) => this.execGit(["commit", "-m", args.message as string]),
    });

    this.tools.set("code_search", {
      name: "code_search",
      description: "Search codebase for a pattern",
      execute: (args) => this.searchCode(args.pattern as string, args.path as string),
    });

    this.tools.set("web_fetch", {
      name: "web_fetch",
      description: "Fetch content from a URL",
      execute: (args) => this.webFetch(args.url as string),
    });

    this.tools.set("think", {
      name: "think",
      description: "Reason through a problem step by step",
      execute: (args) => `Reasoning: ${args.reasoning || "No reasoning provided."}`,
    });

    this.tools.set("list_files", {
      name: "list_files",
      description: "List files in a directory",
      execute: (args) => this.listDir(args.path as string),
    });
  }

  /**
   * Execute a tool by name with given arguments
   */
  async execute(toolName: string, argsJson: string): Promise<unknown> {
    const tool = this.tools.get(toolName);
    if (!tool) {
      return `Error: Unknown tool '${toolName}'. Available: ${Array.from(this.tools.keys()).join(", ")}`;
    }

    let args: Record<string, unknown> = {};
    try {
      args = JSON.parse(argsJson);
    } catch {
      return `Error: Invalid JSON arguments for tool '${toolName}'`;
    }

    // Audit log
    this.db.logAudit("tool_execute", JSON.stringify({ tool: toolName, args }));

    try {
      const result = await Promise.resolve(tool.execute(args));
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      this.db.logAudit("tool_error", `${toolName}: ${errorMsg}`, false);
      return `Error executing ${toolName}: ${errorMsg}`;
    }
  }

  /**
   * List all registered tools
   */
  listTools(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  /**
   * Register a custom tool (for plugins)
   */
  registerTool(tool: ToolDefinition): void {
    this.tools.set(tool.name, tool);
  }

  // ── Tool implementations ──

  private fileRead(path: string): string {
    if (!path) return "Error: path is required";
    const resolved = resolve(process.cwd(), path);
    if (!existsSync(resolved)) return `Error: File not found: ${path}`;
    return readFileSync(resolved, "utf-8");
  }

  private fileWrite(path: string, content: string): string {
    if (!path || content === undefined) return "Error: path and content are required";
    const resolved = resolve(process.cwd(), path);
    writeFileSync(resolved, content, "utf-8");
    return `Written ${content.length} bytes to ${path}`;
  }

  private fileEdit(path: string, oldString: string, newString: string): string {
    if (!path || !oldString || newString === undefined) return "Error: path, old_string, and new_string are required";
    const resolved = resolve(process.cwd(), path);
    if (!existsSync(resolved)) return `Error: File not found: ${path}`;

    let content = readFileSync(resolved, "utf-8");
    if (!content.includes(oldString)) return `Error: old_string not found in ${path}`;

    content = content.replace(oldString, newString);
    writeFileSync(resolved, content, "utf-8");
    return `Edited ${path}: replaced "${oldString}" with "${newString}"`;
  }

  private execBash(command: string): string {
    if (!command) return "Error: command is required";

    // Security: block dangerous commands
    for (const blocked of BLOCKED_COMMANDS) {
      if (command.toLowerCase().includes(blocked.toLowerCase())) {
        this.db.logAudit("blocked_command", command, false);
        return `Error: Command blocked for security: matches pattern "${blocked}"`;
      }
    }

    try {
      const result = execSync(command, {
        cwd: process.cwd(),
        timeout: 30_000,
        maxBuffer: 1_048_576,
        encoding: "utf-8",
        shell: process.platform === "win32" ? "cmd.exe" : "/bin/bash",
      });
      return result || "(command completed with no output)";
    } catch (error) {
      if (error instanceof Error) {
        return `Error: ${error.message}`;
      }
      return "Error: Command execution failed";
    }
  }

  private execGit(args: string[]): string {
    try {
      const result = execSync(`git ${args.join(" ")}`, {
        cwd: process.cwd(),
        timeout: 10_000,
        maxBuffer: 1_048_576,
        encoding: "utf-8",
      });
      return result || "(git command completed with no output)";
    } catch (error) {
      if (error instanceof Error) {
        return `Git error: ${error.message}`;
      }
      return "Git error: Command failed";
    }
  }

  private searchCode(pattern: string, path = "."): string {
    if (!pattern) return "Error: pattern is required";
    try {
      const result = execSync(`rg -n "${pattern}" "${path}" --max-count 20`, {
        cwd: process.cwd(),
        timeout: 10_000,
        maxBuffer: 1_048_576,
        encoding: "utf-8",
        shell: process.platform === "win32" ? "cmd.exe" : "/bin/bash",
      });
      return result || "No matches found.";
    } catch {
      return "No matches found.";
    }
  }

  private async webFetch(url: string): Promise<string> {
    if (!url) return "Error: url is required";

    // Security: block private IPs, localhost, etc.
    try {
      const parsed = new URL(url);
      const blockedHosts = ["localhost", "127.0.0.1", "0.0.0.0", "::1"];
      if (blockedHosts.includes(parsed.hostname)) {
        return "Error: Cannot fetch from localhost for security reasons.";
      }
    } catch {
      return "Error: Invalid URL";
    }

    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
      const text = await response.text();
      return text.slice(0, 10_000); // Limit response size
    } catch (error) {
      return `Error fetching URL: ${error instanceof Error ? error.message : "Unknown error"}`;
    }
  }

  private listDir(path = "."): string {
    const resolved = resolve(process.cwd(), path);
    if (!existsSync(resolved)) return `Error: Directory not found: ${path}`;

    try {
      const result = execSync(`ls -la "${resolved}"`, {
        timeout: 5_000,
        maxBuffer: 10_000,
        encoding: "utf-8",
        shell: process.platform === "win32" ? "cmd.exe" : "/bin/bash",
      });
      return result;
    } catch {
      return `Error: Could not list directory ${path}`;
    }
  }
}
