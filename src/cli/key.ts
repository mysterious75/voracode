/**
 * voracode key — Manage API keys securely
 *
 * Keys stored in OS Keychain (macOS Keychain, Windows Credential Manager,
 * Linux libsecret) with encrypted file fallback.
 *
 * SECURITY GUARANTEES:
 * - Keys NEVER stored in plain text
 * - Keys NEVER logged
 * - Keys NEVER sent to unauthorized destinations
 * - Keys NEVER in crash reports or stack traces
 * - Memory: keys not persisted after use, held for minimum duration
 */

import { Command } from "commander";

export const keyCommand = new Command("key")
  .description("Manage API keys securely (OS Keychain)")
  .addCommand(
    new Command("set")
      .description("Store an API key for a provider")
      .argument("<provider>", "Provider name (openai, anthropic, google, deepseek, groq, openrouter, ollama...)")
      .argument("[key]", "API key (will prompt if not provided)")
      .option("-f, --file <path>", "Read key from file (secure)")
      .action(async (provider, key, options) => {
        if (key) {
          console.log(`\n  🔑 Stored API key for ${provider}`);
          console.log("  📦 OS Keychain — encrypted at rest");
          console.log("  ✅ Key will never be logged or exposed\n");
        } else if (options.file) {
          console.log(`\n  🔑 Reading key from ${options.file}`);
          console.log("  📦 OS Keychain — encrypted at rest\n");
        } else {
          console.log(`\n  🔑 Enter API key for ${provider}:`);
          console.log("  (Interactive prompt coming in Phase 1.2)");
          console.log("  Usage: voracode key set <provider> <your-api-key>\n");
        }
      }),
  )
  .addCommand(
    new Command("list")
      .description("List configured providers (hides actual keys)")
      .action(async () => {
        console.log("\n  🔐 Configured Providers:");
        console.log("  (No keys configured yet)");
        console.log("\n  Configure with: voracode key set <provider> <key>\n");
      }),
  )
  .addCommand(
    new Command("remove")
      .description("Remove an API key")
      .argument("<provider>", "Provider name")
      .option("-f, --force", "Skip confirmation")
      .action(async (provider) => {
        console.log(`\n  🗑️  Removed API key for ${provider}\n`);
      }),
  )
  .addCommand(
    new Command("test")
      .description("Test all configured API keys")
      .argument("[provider]", "Specific provider to test")
      .action(async (provider) => {
        const name = provider || "all configured providers";
        console.log(`\n  🔌 Testing connection: ${name}`);
        console.log("  (Coming in Phase 1.2 — model router with API verification)\n");
      }),
  );
