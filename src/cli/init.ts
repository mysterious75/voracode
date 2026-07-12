/**
 * voracode init — Initialize VORACODE in project
 *
 * Creates .voracode/ directory with config, AGENTS.md,
 * and detects project structure for context management.
 */

import { Command } from "commander";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join, resolve } from "path";

export const initCommand = new Command("init")
  .description("Initialize VORACODE in current project")
  .argument("[directory]", "Project directory", ".")
  .option("-f, --force", "Overwrite existing configuration")
  .option("--name <name>", "Project name")
  .action(async (directory, options) => {
    const projectPath = resolve(directory);

    if (!existsSync(projectPath)) {
      console.error(`\n  ✖ Error: directory '${projectPath}' does not exist.\n`);
      process.exit(1);
    }

    const voracodeDir = join(projectPath, ".voracode");
    const projectName = options.name || projectPath.split(/[/\\]/).pop() || "project";

    if (existsSync(voracodeDir) && !options.force) {
      console.log("\n  ℹ️  VORACODE already initialized in this project.");
      console.log("  Use --force to reinitialize.");
      console.log(`  Config: ${voracodeDir}\n`);
      return;
    }

    // Create .voracode directory structure
    mkdirSync(join(voracodeDir, "skills"), { recursive: true });
    mkdirSync(join(voracodeDir, "plugins"), { recursive: true });
    mkdirSync(join(voracodeDir, "mcp"), { recursive: true });

    // Create AGENTS.md
    writeFileSync(
      join(voracodeDir, "AGENTS.md"),
      `# VORACODE Agent Configuration — ${projectName}

## Project Overview
Describe your project here — what it does, tech stack, architecture.

## Conventions
- Coding style (e.g., TypeScript strict mode, 2-space indent)
- Testing requirements (e.g., vitest for unit tests)
- Commit message format (e.g., conventional commits)
- Branch strategy (e.g., main → feature branches)

## Key Files
- Entry points, configuration files, important modules

## Environment
- Runtime versions (Node, Bun, Python, etc.)
- Build commands
- Test commands
- Deploy process
`,
    );

    // Create config file
    const config = {
      $schema: "https://voracode.dev/schemas/config.json",
      version: "1.0",
      project: {
        name: projectName,
        path: projectPath,
      },
      model: {
        provider: "auto",
        name: "auto",
        fallback: [] as string[],
      },
      context: {
        maxTokens: 128_000,
        compression: "auto" as const,
        smartLoading: true,
      },
      security: {
        sandbox: { enabled: true, timeout: 30000, maxOutput: 1_048_576 },
        network: { blocked: false, allowedDomains: ["api.openai.com", "api.anthropic.com", "api.deepseek.com", "api.groq.com"] },
        rateLimit: { callsPerMinute: 10 },
        auditLog: { enabled: true, retentionDays: 30 },
      },
      skills: {
        dirs: ["~/.config/voracode/skills", ".voracode/skills"],
        autoLearn: false,
      },
      plugins: [] as string[],
      telemetry: { enabled: false, localOnly: true },
    };

    writeFileSync(join(voracodeDir, "config.json"), JSON.stringify(config, null, 2));

    console.log(`\n  ✅ VORACODE initialized in ${voracodeDir}`);
    console.log(`  📄 Created:`);
    console.log(`     • AGENTS.md — project instructions for AI`);
    console.log(`     • config.json — VORACODE configuration`);
    console.log(`  📁 Created:`);
    console.log(`     • skills/ — reusable skill definitions`);
    console.log(`     • plugins/ — VORACODE plugin extensions`);
    console.log(`     • mcp/ — MCP server configurations`);
    console.log(`\n  Next steps:`);
    console.log(`  1. Edit .voracode/AGENTS.md with your project details`);
    console.log(`  2. Set an API key: voracode key set`);
    console.log(`  3. Start coding: voracode run "your task"\n`);
  });
