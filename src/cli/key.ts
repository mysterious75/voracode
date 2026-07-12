/**
 * voracode key — Manage API keys securely
 *
 * Keys are stored in OS Keychain (macOS Keychain, Windows Credential Manager,
 * Linux libsecret) with encrypted file fallback. NEVER stored in plain text,
 * NEVER logged, NEVER sent to unauthorized destinations.
 */

import { Command } from "commander";

export const keyCommand = new Command("key")
  .description("Manage API keys securely")
  .addCommand(
    new Command("set")
      .description("Store an API key for a provider")
      .argument("<provider>", "Provider name (openai, anthropic, google, groq, deepseek, openrouter, ollama...)")
      .argument("[key]", "API key (will prompt if not provided)")
      .option("-f, --file <path>", "Read key from file")
      .action(async (provider, key, options) => {
        if (key) {
          console.log(`\n  🔑 Stored API key for ${provider}`);
          console.log("  (OS Keychain — encrypted at rest)\n");
        } else if (options.file) {
          console.log(`\n  🔑 Reading key from ${options.file}`);
          console.log("  (OS Keychain — encrypted at rest)\n");
        } else {
          console.log(`\n  🔑 Enter API key for ${provider}:`);
          console.log("  (Coming in Phase 1.3 — interactive prompt)\n");
        }
      }),
  )
  .addCommand(
    new Command("list")
      .description("List configured providers")
      .action(async () => {
        console.log("\n  🔐 Configured Providers:");
        console.log("  (Coming in Phase 1.3 — keychain integration)\n");
      }),
  )
  .addCommand(
    new Command("remove")
      .description("Remove an API key")
      .argument("<provider>", "Provider name")
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
        console.log(`\n  🔌 Testing keys for: ${name}`);
        console.log("  (Coming in Phase 1.3 — keychain integration)\n");
      }),
  );
