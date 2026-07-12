/**
 * voracode config — View or edit VORACODE configuration
 *
 * Config stored in ~/.config/voracode/config.json
 * Project config can override in .voracode/config.json
 */

import { Command } from "commander";

export const configCommand = new Command("config")
  .description("View or edit VORACODE configuration")
  .addCommand(
    new Command("show")
      .description("Show current configuration")
      .action(async () => {
        console.log("\n  ⚙️  VORACODE Configuration:");
        console.log("  (Coming in Phase 1.1 — config system)\n");
      }),
  )
  .addCommand(
    new Command("set")
      .description("Set a configuration value")
      .argument("<key>", "Configuration key (e.g., model.provider)")
      .argument("<value>", "Configuration value")
      .action(async (key, value) => {
        console.log(`\n  ⚙️  Set ${key} = ${value}\n`);
      }),
  )
  .addCommand(
    new Command("get")
      .description("Get a configuration value")
      .argument("<key>", "Configuration key")
      .action(async (key) => {
        console.log(`\n  ⚙️  ${key} = (coming in Phase 1.1)\n`);
      }),
  )
  .addCommand(
    new Command("reset")
      .description("Reset configuration to defaults")
      .action(async () => {
        console.log("\n  ⚙️  Configuration reset to defaults.\n");
      }),
  )
  .addCommand(
    new Command("path")
      .description("Show config file paths")
      .action(async () => {
        const home = process.env.HOME || process.env.USERPROFILE || "~";
        console.log(`\n  📁 Global config: ${home}/.config/voracode/config.json`);
        console.log(`  📁 Project config: .voracode/config.json`);
        console.log(`  📁 Skills: ${home}/.config/voracode/skills/`);
        console.log(`  📁 Data: ${home}/.local/share/voracode/\n`);
      }),
  );
