/**
 * voracode init — Initialize VORACODE in project
 *
 * Creates .voracode/ directory with default config,
 * analyzes project structure, generates AGENTS.md.
 */

import { Command } from "commander";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join, resolve } from "path";

export const initCommand = new Command("init")
  .description("Initialize VORACODE in current project")
  .argument("[directory]", "Project directory", ".")
  .option("-f, --force", "Overwrite existing configuration")
  .action(async (directory, options) => {
    const projectPath = resolve(directory);

    if (!existsSync(projectPath)) {
      console.error(`Error: directory '${projectPath}' does not exist.`);
      process.exit(1);
    }

    const voracodeDir = join(projectPath, ".voracode");

    if (existsSync(voracodeDir) && !options.force) {
      console.log("VORACODE already initialized in this project.");
      console.log("Use --force to reinitialize.");
      return;
    }

    // Create .voracode directory structure
    mkdirSync(voracodeDir, { recursive: true });
    mkdirSync(join(voracodeDir, "skills"), { recursive: true });
    mkdirSync(join(voracodeDir, "plugins"), { recursive: true });
    mkdirSync(join(voracodeDir, "mcp"), { recursive: true });

    // Create default AGENTS.md
    const agentsMd = join(voracodeDir, "AGENTS.md");
    writeFileSync(agentsMd, `# VORACODE Configuration for ${projectPath.split(/[/\\]/).pop() || "project"}

## Project Overview
Add a description of your project here.

## Conventions
- Coding style preferences
- Testing requirements
- Deployment process

## Environment
- Runtime versions
- Key dependencies
- Build commands
`);

    // Create default config
    const configPath = join(voracodeDir, "config.json");
    if (!existsSync(configPath) || options.force) {
      writeFileSync(
        configPath,
        JSON.stringify(
          {
            $schema: "https://voracode.dev/schemas/config.json",
            version: "1.0",
            project: {
              name: projectPath.split(/[/\\]/).pop() || "unnamed",
              path: projectPath,
            },
            model: {
              provider: "auto",
              name: "auto",
            },
          },
          null,
          2,
        ),
      );
    }

    console.log(`\n  ✅ VORACODE initialized in ${voracodeDir}`);
    console.log(`  📄 Created: AGENTS.md, config.json`);
    console.log(`  📁 Created: skills/, plugins/, mcp/`);
    console.log(`\n  Next: run 'voracode' to start working.\n`);
  });
