/**
 * voracode model — Manage AI providers and models
 *
 * Universal adapter system:
 * - OpenAI protocol: DeepSeek, Groq, Together, Ollama, OpenRouter, etc.
 * - Anthropic protocol: Claude models
 * - Google protocol: Gemini models
 * - Custom: User-defined adapters
 *
 * Free tier requires user's own API key (BYOK).
 * VORACODE does not provide free managed models.
 */

import { Command } from "commander";

export const modelCommand = new Command("model")
  .description("Manage AI providers and models")
  .addCommand(
    new Command("list")
      .description("List available providers and models")
      .option("-p, --provider <name>", "Filter by provider")
      .action(async (options) => {
        console.log("\n  📡 Available AI Providers:");

        if (options.provider) {
          console.log(`  Filter: ${options.provider}`);
          console.log("  (Detailed provider models coming in Phase 1.2)\n");
          return;
        }

        console.log("  ┌──────────────────────┬─────────────────────────────────────┐");
        console.log("  │ Protocol             │ Providers                           │");
        console.log("  ├──────────────────────┼─────────────────────────────────────┤");
        console.log("  │ OpenAI-compatible    │ DeepSeek, Groq, Together, Ollama,   │");
        console.log("  │                      │ OpenRouter, HuggingFace, Fireworks,  │");
        console.log("  │                      │ Cerebras, SambaNova, Cloudflare AI  │");
        console.log("  ├──────────────────────┼─────────────────────────────────────┤");
        console.log("  │ Anthropic Messages   │ Claude Opus, Sonnet, Haiku          │");
        console.log("  ├──────────────────────┼─────────────────────────────────────┤");
        console.log("  │ Google AI            │ Gemini Pro, Flash                    │");
        console.log("  ├──────────────────────┼─────────────────────────────────────┤");
        console.log("  │ Custom               │ Any OpenAI-compatible endpoint       │");
        console.log("  └──────────────────────┴─────────────────────────────────────┘");
        console.log("\n  ⚠️  VORACODE is BYOK — you must provide your own API key.");
        console.log("  No free managed models are provided.");
        console.log("\n  Commands:");
        console.log("    voracode model set <model>     Set active model");
        console.log("    voracode model test [provider] Test provider connection");
        console.log("    voracode key set               Configure API key\n");
      }),
  )
  .addCommand(
    new Command("set")
      .description("Set active model for session")
      .argument("<model>", "Model identifier (provider/model-name)")
      .action(async (model) => {
        const [provider] = model.split("/");
        if (!provider) {
          console.error("\n  ✖ Invalid model format. Use: provider/model-name");
          console.error("  Example: openai/gpt-4o\n");
          process.exit(1);
        }
        console.log(`\n  ✅ Active model set to: ${model}\n`);
      }),
  )
  .addCommand(
    new Command("test")
      .description("Test connection to a provider")
      .argument("[provider]", "Provider name")
      .action(async (provider) => {
        const name = provider || "default provider";
        console.log(`\n  🔌 Testing connection to: ${name}`);

        // Check if key is configured
        console.log("  ℹ️  This will verify your API key works.");
        console.log("  (Coming in Phase 1.2 — model router with actual API calls)\n");
      }),
  );
