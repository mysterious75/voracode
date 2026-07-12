/**
 * voracode init — Initialize VORACODE in project
 */

import { Command } from "commander";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import { c, success, statusLine } from "../ui/theme";

export const initCommand = new Command("init")
  .description("Initialize VORACODE in current project")
  .argument("[directory]", "Project directory", ".")
  .option("-f, --force", "Overwrite existing configuration")
  .option("--name <name>", "Project name")
  .action(async (directory, options) => {
    const projectPath = resolve(directory);

    if (!existsSync(projectPath)) {
      console.error(`\n  ${c.error}✖ Directory not found: ${projectPath}${c.reset}\n`);
      process.exit(1);
    }

    const voracodeDir = join(projectPath, ".voracode");
    const projectName = options.name || projectPath.split(/[/\\]/).pop() || "project";

    if (existsSync(voracodeDir) && !options.force) {
      console.log(`\n  ${c.info}◆${c.reset} Already initialized. Use ${c.bold}--force${c.reset} to reinitialize.\n`);
      return;
    }

    mkdirSync(join(voracodeDir, "skills"), { recursive: true });
    mkdirSync(join(voracodeDir, "plugins"), { recursive: true });
    mkdirSync(join(voracodeDir, "mcp"), { recursive: true });

    writeFileSync(join(voracodeDir, "AGENTS.md"), `# VORACODE — ${projectName}\n\n## Project Overview\nDescribe your project here.\n\n## Conventions\n- Coding style\n- Testing approach\n- Commit format\n\n## Environment\n- Runtime versions\n- Build commands\n`);

    const config = {
      $schema: "https://voracode.dev/schemas/config.json",
      version: "1.0",
      project: { name: projectName, path: projectPath },
      model: { provider: "auto", name: "auto", fallback: ["deepseek", "groq"] },
      context: { maxTokens: 128_000, compression: "auto" as const, smartLoading: true },
      security: { sandbox: { enabled: true, timeout: 30000, maxOutput: 1_048_576 } },
      skills: { dirs: ["~/.config/voracode/skills", ".voracode/skills"], autoLearn: false },
      telemetry: { enabled: false, localOnly: true },
    };

    writeFileSync(join(voracodeDir, "config.json"), JSON.stringify(config, null, 2));

    console.log(`\n  ${success(`Initialized in ${c.brand}${c.bold}.voracode/${c.reset}`)}\n`);

    console.log(statusLine("AGENTS.md", "Project instructions", "info"));
    console.log(statusLine("config.json", "Configuration", "info"));
    console.log(statusLine("skills/", "Custom skills", "info"));
    console.log(statusLine("plugins/", "Extensions", "info"));
    console.log(statusLine("mcp/", "MCP servers", "info"));

    console.log(`\n  ${c.dim}Next steps:${c.reset}`);
    console.log(`  ${c.brand}1.${c.reset} Edit ${c.bold}.voracode/AGENTS.md${c.reset}`);
    console.log(`  ${c.brand}2.${c.reset} Set API key: ${c.bold}voracode key set${c.reset}`);
    console.log(`  ${c.brand}3.${c.reset} Start: ${c.bold}voracode run "your task"${c.reset}\n`);
  });