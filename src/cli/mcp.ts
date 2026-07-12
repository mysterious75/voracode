/**
 * voracode mcp — Manage MCP (Model Context Protocol) servers
 *
 * Connect to external tools and data sources via MCP.
 * Supports stdio, HTTP, SSE, and WebSocket transports.
 */

import { Command } from "commander";
import { McpConfigManager, type TransportType } from "../storage/mcp-config";

export const mcpCommand = new Command("mcp")
  .description("Manage MCP (Model Context Protocol) servers")
  .addCommand(
    new Command("list")
      .description("List configured MCP servers")
      .action(async () => {
        const mgr = new McpConfigManager();
        const servers = mgr.list();

        if (servers.length === 0) {
          console.log("\n  🔌 No MCP servers configured.");
          console.log("\n  Add one with:");
          console.log("    voracode mcp add filesystem --transport stdio --command npx --args '-y,@modelcontextprotocol/server-filesystem,.'");
          console.log("    voracode mcp add sentry --transport http --url https://mcp.sentry.dev/mcp\n");
          return;
        }

        console.log("\n  🔌 Configured MCP Servers:\n");
        console.log("  ┌──────────────────────┬──────────┬──────────────────────────────────┬────────┐");
        console.log("  │ Name                  │ Transport│ Endpoint                         │ Scope  │");
        console.log("  ├──────────────────────┼──────────┼──────────────────────────────────┼────────┤");

        for (const s of servers) {
          const endpoint = s.url || `${s.command} ${(s.args || []).join(" ")}`.trim();
          const ep = endpoint.length > 40 ? endpoint.slice(0, 37) + "..." : endpoint;
          console.log(`  │ ${s.name.padEnd(20)} │ ${s.transport.padEnd(8)} │ ${ep.padEnd(40)} │ ${s.scope.padEnd(6)} │`);
        }

        console.log("  └──────────────────────┴──────────┴──────────────────────────────────┴────────┘");
        console.log(`\n  Total: ${servers.length} server(s)\n`);
      }),
  )
  .addCommand(
    new Command("add")
      .description("Add an MCP server")
      .argument("<name>", "Server name")
      .option("--transport <type>", "Transport type (stdio|http|sse|ws)", "stdio")
      .option("--url <url>", "Server URL (for http/sse/ws transport)")
      .option("--command <cmd>", "Command to start server (for stdio)")
      .option("--args <args>", "Command arguments, comma-separated (for stdio)")
      .option("--header <key: value>", "Add a header (can repeat)", (val: string, acc: string[]) => [...acc, val], [] as string[])
      .option("--env <key=value>", "Add an env var (can repeat)", (val: string, acc: string[]) => [...acc, val], [] as string[])
      .option("--scope <scope>", "Config scope (local|project)", "local")
      .action(async (name, options) => {
        const mgr = new McpConfigManager();

        const transport = options.transport as TransportType;
        const headers: Record<string, string> = {};
        const env: Record<string, string> = {};

        // Parse headers
        for (const h of options.header as string[] || []) {
          const idx = h.indexOf(":");
          if (idx > 0) {
            headers[h.slice(0, idx).trim()] = h.slice(idx + 1).trim();
          }
        }

        // Parse env vars
        for (const e of options.env as string[] || []) {
          const idx = e.indexOf("=");
          if (idx > 0) {
            env[e.slice(0, idx).trim()] = e.slice(idx + 1).trim();
          }
        }

        let cmd: string | undefined;
        let args: string[] | undefined;
        let url: string | undefined;

        if (transport === "stdio") {
          cmd = options.command;
          if (options.args) {
            args = options.args.split(",").map((a: string) => a.trim());
          }
          if (!cmd) {
            console.error("\n  ✖ stdio servers require --command.");
            console.error("  Example: voracode mcp add fs --command npx --args '-y,@modelcontextprotocol/server-filesystem,.'\n");
            process.exit(1);
          }
        } else {
          url = options.url;
          if (!url) {
            console.error(`\n  ✖ ${transport} servers require --url.\n`);
            process.exit(1);
          }
        }

        const config = {
          name,
          transport,
          command: cmd,
          args,
          env: Object.keys(env).length > 0 ? env : undefined,
          url,
          headers: Object.keys(headers).length > 0 ? headers : undefined,
          scope: options.scope as "local" | "project",
          enabled: true,
          createdAt: new Date().toISOString(),
        };

        mgr.add(config);

        console.log(`\n  ✅ Added MCP server: ${name}`);
        console.log(`     Transport: ${transport}`);
        if (cmd) console.log(`     Command: ${cmd} ${(args || []).join(" ")}`);
        if (url) console.log(`     URL: ${url}`);
        if (Object.keys(headers).length > 0) console.log(`     Headers: ${Object.keys(headers).join(", ")}`);
        if (Object.keys(env).length > 0) console.log(`     Env: ${Object.keys(env).join(", ")}`);
        console.log(`     Scope: ${options.scope}\n`);
      }),
  )
  .addCommand(
    new Command("add-json")
      .description("Add MCP server from JSON config")
      .argument("<name>", "Server name")
      .argument("<json>", "JSON configuration")
      .option("--scope <scope>", "Config scope (local|project)", "local")
      .action(async (name, json, options) => {
        const mgr = new McpConfigManager();
        let parsed: Record<string, unknown>;

        try {
          parsed = JSON.parse(json);
        } catch {
          console.error("\n  ✖ Invalid JSON configuration.\n");
          process.exit(1);
        }

        const transport = (parsed.type as TransportType) || "stdio";
        const config = {
          name,
          transport,
          command: parsed.command as string | undefined,
          args: parsed.args as string[] | undefined,
          env: parsed.env as Record<string, string> | undefined,
          url: parsed.url as string | undefined,
          headers: parsed.headers as Record<string, string> | undefined,
          scope: options.scope as "local" | "project",
          enabled: true,
          createdAt: new Date().toISOString(),
        };

        mgr.add(config);
        console.log(`\n  ✅ Added MCP server: ${name} (${transport})\n`);
      }),
  )
  .addCommand(
    new Command("remove")
      .description("Remove an MCP server")
      .argument("<name>", "Server name")
      .action(async (name) => {
        const mgr = new McpConfigManager();
        const removed = mgr.remove(name);
        if (removed) {
          console.log(`\n  🗑️  Removed MCP server: ${name}\n`);
        } else {
          console.log(`\n  ⚠️  Server '${name}' not found.\n`);
        }
      }),
  )
  .addCommand(
    new Command("test")
      .description("Test connection to an MCP server")
      .argument("[name]", "Server name")
      .action(async (name) => {
        const mgr = new McpConfigManager();
        if (!name) {
          const servers = mgr.list();
          if (servers.length === 0) {
            console.log("\n  🔌 No MCP servers configured.\n");
            return;
          }
          for (const s of servers) {
            console.log(`\n  🔌 Testing: ${s.name}...`);
            const result = await mgr.test(s.name);
            console.log(`  ${result.success ? "✅" : "❌"} ${result.message}`);
          }
          console.log();
          return;
        }

        console.log(`\n  🔌 Testing: ${name}...`);
        const result = await mgr.test(name);
        console.log(`  ${result.success ? "✅" : "❌"} ${result.message}\n`);
      }),
  )
  .addCommand(
    new Command("get")
      .description("Show details for an MCP server")
      .argument("<name>", "Server name")
      .action(async (name) => {
        const mgr = new McpConfigManager();
        const config = mgr.get(name);

        if (!config) {
          console.log(`\n  ⚠️  Server '${name}' not found.\n`);
          return;
        }

        console.log(`\n  📋 MCP Server: ${config.name}`);
        console.log(`     Transport: ${config.transport}`);
        if (config.command) console.log(`     Command: ${config.command} ${(config.args || []).join(" ")}`);
        if (config.url) console.log(`     URL: ${config.url}`);
        if (config.headers) console.log(`     Headers: ${Object.keys(config.headers).join(", ")}`);
        if (config.env) console.log(`     Env: ${Object.keys(config.env).join(", ")}`);
        console.log(`     Scope: ${config.scope}`);
        console.log(`     Enabled: ${config.enabled}`);
        console.log(`     Created: ${config.createdAt}\n`);
      }),
  );