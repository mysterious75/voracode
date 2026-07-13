#!/usr/bin/env node
/**
 * VORACODE — AI Coding Agent
 * One agent, every surface.
 *
 * Premium CLI with ALL features integrated.
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
import { version } from "../package.json";
import { c, printBanner, box, footer } from "./ui/theme";
import { ALL_PROVIDERS, BUILTIN_MCP_SERVERS } from "./models/adapters/all-providers";
import { startInteractiveSession } from "./cli/interactive";

const VERSION = version || "0.0.1";
const NAME = "voracode";

async function main(): Promise<void> {
  const program = new Command();

  program
    .name(NAME)
    .description(`${c.brand}${c.bold}${NAME}${c.reset} — ${c.dim}AI Coding Agent${c.reset}`)
    .version(VERSION, "-v, --version", "Show version")
    .helpOption("-h, --help", "Show help")
    .helpCommand(false);

  program.addCommand(runCommand);
  program.addCommand(initCommand);
  program.addCommand(sessionCommand);
  program.addCommand(modelCommand);
  program.addCommand(skillCommand);
  program.addCommand(keyCommand);
  program.addCommand(configCommand);
  program.addCommand(pluginCommand);
  program.addCommand(mcpCommand);
  program.addCommand(auditCommand);
  program.addCommand(liteCommand);
  program.addCommand(proCommand);
  program.addCommand(statsCommand);
  program.addCommand(doctorCommand);
  program.addCommand(updateCommand);

  if (process.argv.length <= 2) {
    await startInteractiveSession();
    return;
  }

  await program.parseAsync(process.argv);
}

main().catch((error) => {
  console.error(`\n  ${c.error}✖ ${c.reset}${c.error}${error instanceof Error ? error.message : String(error)}${c.reset}\n`);
  process.exit(1);
});
