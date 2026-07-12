/**
 * voracode update — Self-update command
 *
 * Checks for new versions on GitHub and applies updates.
 */

import { Command } from "commander";

export const updateCommand = new Command("update")
  .description("Check for updates and update VORACODE")
  .option("--check", "Only check for updates, don't install")
  .option("--channel <channel>", "Release channel (stable|beta)", "stable")
  .option("--force", "Force reinstall current version")
  .action(async (options) => {
    const currentVersion = "0.0.1"; // from package.json

    console.log(`\n  📦 VORACODE v${currentVersion}`);
    console.log(`  🔄 Channel: ${options.channel}`);
    console.log("  🔍 Checking for updates...");

    // TODO: Implement actual GitHub release check
    console.log("  (Coming in Phase 1.4 — update system)");

    console.log("\n  To update manually, run:");
    console.log("    npm update -g voracode");
    console.log("    # or: brew upgrade voracode");
    console.log("    # or: scoop update voracode\n");
  });
