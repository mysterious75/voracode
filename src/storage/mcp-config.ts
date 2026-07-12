/**
 * VORACODE MCP Config — MCP server configuration management
 *
 * Stores MCP server configs in JSON files.
 * Supports stdio, HTTP, SSE, and WebSocket transports.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, unlinkSync } from "fs";
import { join } from "path";
import { homedir } from "os";

export type TransportType = "stdio" | "http" | "sse" | "ws";

export interface McpServerConfig {
  name: string;
  transport: TransportType;
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
  headers?: Record<string, string>;
  scope: "local" | "project";
  enabled: boolean;
  createdAt: string;
}

export class McpConfigManager {
  private localDir: string;
  private projectDir: string;

  constructor() {
    this.localDir = join(homedir(), ".config", "voracode", "mcp");
    this.projectDir = join(process.cwd(), ".voracode", "mcp");
  }

  private ensureDirs(): void {
    if (!existsSync(this.localDir)) mkdirSync(this.localDir, { recursive: true });
    if (!existsSync(this.projectDir)) mkdirSync(this.projectDir, { recursive: true });
  }

  private getDir(scope: "local" | "project"): string {
    return scope === "project" ? this.projectDir : this.localDir;
  }

  private getFilePath(name: string, scope: "local" | "project"): string {
    return join(this.getDir(scope), `${name}.json`);
  }

  /**
   * Add or update an MCP server config
   */
  add(config: McpServerConfig): void {
    this.ensureDirs();
    writeFileSync(
      this.getFilePath(config.name, config.scope),
      JSON.stringify(config, null, 2),
      "utf-8",
    );
  }

  /**
   * Remove an MCP server config
   */
  remove(name: string): boolean {
    // Try local first, then project
    for (const scope of ["local", "project"] as const) {
      const path = this.getFilePath(name, scope);
      if (existsSync(path)) {
        unlinkSync(path);
        return true;
      }
    }
    return false;
  }

  /**
   * Get a single MCP server config
   */
  get(name: string): McpServerConfig | null {
    for (const scope of ["local", "project"] as const) {
      const path = this.getFilePath(name, scope);
      if (existsSync(path)) {
        try {
          return JSON.parse(readFileSync(path, "utf-8")) as McpServerConfig;
        } catch {
          return null;
        }
      }
    }
    return null;
  }

  /**
   * List all configured MCP servers
   */
  list(): McpServerConfig[] {
    this.ensureDirs();
    const servers: McpServerConfig[] = [];

    for (const scope of ["local", "project"] as const) {
      const dir = this.getDir(scope);
      if (!existsSync(dir)) continue;

      for (const file of readdirSync(dir)) {
        if (!file.endsWith(".json")) continue;
        try {
          const config = JSON.parse(readFileSync(join(dir, file), "utf-8")) as McpServerConfig;
          servers.push(config);
        } catch {
          // Skip invalid configs
        }
      }
    }

    return servers;
  }

  /**
   * Test if a server is reachable
   */
  async test(name: string): Promise<{ success: boolean; message: string; tools?: string[] }> {
    const config = this.get(name);
    if (!config) {
      return { success: false, message: `Server '${name}' not found` };
    }

    if (config.transport === "stdio") {
      // Check if command exists
      if (!config.command) {
        return { success: false, message: "No command configured for stdio server" };
      }
      return {
        success: true,
        message: `Config OK — run with: ${config.command} ${(config.args || []).join(" ")}`,
      };
    }

    if ((config.transport === "http" || config.transport === "sse" || config.transport === "ws") && config.url) {
      try {
        const headers: Record<string, string> = { "Content-Type": "application/json", ...config.headers };
        const response = await fetch(config.url, {
          method: "POST",
          headers,
          body: JSON.stringify({ jsonrpc: "2.0", id: "1", method: "initialize", params: { protocolVersion: "2024-11-05", capabilities: {}, clientInfo: { name: "voracode", version: "0.0.1" } } }),
          signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
          const data = await response.json().catch(() => null);
          return {
            success: true,
            message: `Connected to ${config.name} (${config.transport})`,
            tools: data?.result?.capabilities?.tools ? ["available"] : undefined,
          };
        }
        return {
          success: response.status === 401 || response.status === 403,
          message: `Auth required (${response.status}) — use /mcp to authenticate`,
        };
      } catch (error) {
        return {
          success: false,
          message: `Connection failed: ${error instanceof Error ? error.message : "unknown error"}`,
        };
      }
    }

    return { success: false, message: "Invalid server configuration" };
  }
}