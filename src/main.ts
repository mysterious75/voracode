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
import { mcpCommand } from "./cli/mcp";
import { statsCommand } from "./cli/stats";
import { doctorCommand } from "./cli/doctor";
import { auditCommand } from "./cli/audit";
import { liteCommand } from "./cli/lite";
import { proCommand } from "./cli/pro";
import { updateCommand } from "./cli/update";
import { version, description } from "../package.json";

const VERSION = version || "0.0.1";
const NAME = "voracode";

function printBanner(): void {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║              V O R A C O D E                ║
  ║     Your AI engineering partner.            ║
  ║     One agent, every surface.               ║
  ║     v${VERSION.padEnd(20)}║
  ╚══════════════════════════════════════════════╝
  `);
}

async function main(): Promise<void> {
  const program = new Command();

  program
    .name(NAME)
    .description(description || "AI Coding Agent — One agent, every surface.")
    .version(VERSION, "-v, --version", "Show version")
    .helpOption("-h, --help", "Show help")
    .helpCommand(false);

  // Core commands
  program.addCommand(runCommand);
  program.addCommand(initCommand);
  program.addCommand(sessionCommand);
  program.addCommand(modelCommand);
  program.addCommand(skillCommand);
  program.addCommand(keyCommand);
  program.addCommand(configCommand);

  // Advanced commands
  program.addCommand(pluginCommand);
  program.addCommand(mcpCommand);
  program.addCommand(auditCommand);

  // Platform commands
  program.addCommand(liteCommand);
  program.addCommand(proCommand);

  // Utility commands
  program.addCommand(statsCommand);
  program.addCommand(doctorCommand);
  program.addCommand(updateCommand);

  // Handle no args — show banner + help
  if (process.argv.length <= 2) {
    printBanner();
    program.outputHelp();
    return;
  }

  await program.parseAsync(process.argv);
}

main().catch((error) => {
  console.error("VORACODE error:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
