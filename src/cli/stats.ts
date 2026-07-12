/**
 * voracode stats — Usage statistics and analytics
 *
 * All stats are LOCAL by default. No data sent anywhere.
 * User must explicitly opt-in to share anonymized usage.
 */

import { Command } from "commander";

export const statsCommand = new Command("stats")
  .description("Show usage statistics (local only, zero telemetry)")
  .option("--days <number>", "Number of days to show", "7")
  .action(async (options) => {
    console.log(`\n  📊 VORACODE Usage (last ${options.days} days):`);
    console.log("  (Coming in Phase 1.3 — SQLite stats tracking)\n");
  });
