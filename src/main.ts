#!/usr/bin/env bun
/**
 * VORACODE — AI Coding Agent
 * One agent, every surface.
 *
 * Main entry point — registers all CLI commands.
 */

import { Command } from "commander";
import { runCommand } from "./cli/run";
import { initCommand } from "./cli/init";
import { sessionCommand } from "./cli/session";
import { modelCommand } from "./cli/model";
import { skillCommand } from "./cli/skill";
import { keyCommand } from "./cli/key";
import { configCommand } from "./cli/config";
import { pluginCommand } from "./cli/plugin";
import { statsCommand } from "./cli/stats";
import { doctorCommand } from "./cli/doctor";
import { mcpCommand } from "./cli/mcp";
import { version, name, description } from "../package.json";

const VERSION = version || "0.0.1";
const NAME = name || "voracode";

function printBanner(): void {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║              V O R A C O D E                ║
  ║     Your AI engineering partner.            ║
  ║     One agent, every surface.               ║
  ║              v${VERSION.padEnd(20)}║
  ╚══════════════════════════════════════════════╝
  `);
}

async function main(): Promise<void> {
  const program = new Command();

  program
    .name(NAME)
    .description(description || "AI Coding Agent")
    .version(VERSION, "-v, --version", "Show version")
    .helpOption("-h, --help", "Show help")
    .addHelpCommand(false);

  // Register all commands
  program.addCommand(runCommand);
  program.addCommand(initCommand);
  program.addCommand(sessionCommand);
  program.addCommand(modelCommand);
  program.addCommand(skillCommand);
  program.addCommand(keyCommand);
  program.addCommand(configCommand);
  program.addCommand(pluginCommand);
  program.addCommand(statsCommand);
  program.addCommand(doctorCommand);
  program.addCommand(mcpCommand);

  // Handle no args — show banner + help
  if (process.argv.length <= 2) {
    printBanner();
    program.outputHelp();
    return;
  }

  // Handle --banner flag for clean startup
  if (process.argv.includes("--banner")) {
    printBanner();
  }

  await program.parseAsync(process.argv);
}

main().catch((error) => {
  console.error("VORACODE error:", error instanceof Error ? error.message : error);
  process.exit(1);
});
