/**
 * voracode lite — Low-cost subscription for curated open models
 *
 * Like OpenCode Go: $5 first month → $10/month subscription.
 * Gives access to curated open coding models (DeepSeek, Qwen,
 * Kimi, MiniMax, MiMo, GLM) with usage limits.
 *
 * USERS MUST BRING THEIR OWN API KEY FOR FREE TIER.
 * Lite is OPTIONAL — only for users who want curated model access.
 */

import { Command } from "commander";

export const liteCommand = new Command("lite")
  .description("Low-cost subscription for curated open coding models")
  .addCommand(
    new Command("subscribe")
      .description("Subscribe to VORACODE Lite ($5 first month, then $10/month)")
      .action(async () => {
        console.log("\n  ⭐ VORACODE Lite — Low-cost curated models");
        console.log("  ───────────────────────────────────────────");
        console.log("  • $5 first month, then $10/month");
        console.log("  • Curated open coding models");
        console.log("  • Models: DeepSeek, Qwen, Kimi, MiniMax, MiMo, GLM");
        console.log("  • Usage limits: $12/5 hours, $30/week, $60/month");
        console.log("  • No lock-in — use any provider alongside");
        console.log("\n  (Coming in Phase 2 — payment integration)");
        console.log("  For now, bring your own API key with 'voracode key set'\n");
      }),
  )
  .addCommand(
    new Command("status")
      .description("Check Lite subscription status")
      .action(async () => {
        console.log("\n  📋 VORACODE Lite Status:");
        console.log("  • Status: Not subscribed");
        console.log("  • Current tier: Free (BYOK)");
        console.log("\n  Subscribe with 'voracode lite subscribe'\n");
      }),
  )
  .addCommand(
    new Command("models")
      .description("List available Lite models")
      .action(async () => {
        console.log("\n  📡 VORACODE Lite Models:");
        console.log("  ┌──────────────────────┬─────────────────────────────┐");
        console.log("  │ Model                │ Type                        │");
        console.log("  ├──────────────────────┼─────────────────────────────┤");
        console.log("  │ DeepSeek V4 Flash    │ Open source coding          │");
        console.log("  │ DeepSeek V4 Pro      │ Open source premium         │");
        console.log("  │ Qwen3.7 Plus         │ Open source large           │");
        console.log("  │ Kimi K2.7 Code       │ Open source coding          │");
        console.log("  │ MiniMax M3           │ Open source general         │");
        console.log("  │ GLM 5.2              │ Open source bilingual       │");
        console.log("  └──────────────────────┴─────────────────────────────┘");
        console.log("  (Full list coming in Phase 2)\n");
      }),
  )
  .addCommand(
    new Command("cancel")
      .description("Cancel Lite subscription")
      .action(async () => {
        console.log("\n  🗑️  Lite subscription cancelled.\n");
      }),
  );
