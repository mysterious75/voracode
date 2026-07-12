/**
 * voracode model — Manage AI providers and models
 *
 * Universal adapter system. BYOK only — no free managed models.
 */

import { Command } from "commander";
import { ModelRouter } from "../models/router";

export const modelCommand = new Command("model")
  .description("Manage AI providers and models")
  .addCommand(
    new Command("list")
      .description("List available providers and models")
      .option("-p, --provider <name>", "Filter by provider")
      .action(async (options) => {
        const router = new ModelRouter();

        console.log("\n  📡 Available AI Providers:\n");

        if (options.provider) {
          const models = router.getModels(options.provider);
          const hasKey = router.hasValidKey(options.provider);
          console.log(`  Provider: ${options.provider}`);
          console.log(`  Key: ${hasKey ? "✅ configured" : "❌ not configured"}`);
          console.log(`  Models:`);
          for (const m of models) {
            console.log(`    • ${m}`);
          }
          console.log();
          return;
        }

        const providers = [
          { name: "OpenAI-compatible", protocols: "openai, deepseek, groq, together, ollama, openrouter, huggingface, fireworks, cerebras" },
          { name: "Anthropic Messages", protocols: "anthropic" },
          { name: "Google AI", protocols: "google" },
          { name: "Custom", protocols: "Any OpenAI-compatible endpoint" },
        ];

        console.log("  ┌──────────────────────┬─────────────────────────────────────────────┐");
        console.log("  │ Protocol             │ Providers                                    │");
        console.log("  ├──────────────────────┼─────────────────────────────────────────────┤");
        for (const p of providers) {
          console.log(`  │ ${p.name.padEnd(20)} │ ${p.protocols.padEnd(43)} │`);
        }
        console.log("  └──────────────────────┴─────────────────────────────────────────────┘");

        console.log("\n  🔑 Key Status:");
        for (const name of ["openai", "anthropic", "deepseek", "groq", "google", "openrouter"]) {
          const status = router.hasValidKey(name) ? "✅" : "❌";
          console.log(`  ${status} ${name}`);
        }

        console.log("\n  ⚠️  VORACODE is BYOK — no free managed models.");
        console.log("  Configure: voracode key set <provider> <key>");
        console.log("  Or set env: PROVIDER_API_KEY=sk-...\n");
      }),
  )
  .addCommand(
    new Command("set")
      .description("Set active model for session")
      .argument("<model>", "Model identifier (provider/model-name)")
      .action(async (model) => {
        if (!model.includes("/")) {
          console.error("\n  ✖ Use format: provider/model-name");
          console.error("  Example: voracode model set deepseek/deepseek-chat\n");
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
        const router = new ModelRouter();
        const name = provider || "deepseek";

        const key = router.getKey(name);
        if (!key) {
          console.log(`\n  ❌ No API key for '${name}'`);
          console.log(`  Configure: voracode key set ${name} <key>\n`);
          return;
        }

        console.log(`\n  🔌 Testing: ${name}...`);

        try {
          const result = await router.chat(`${name}/test`, [
            { role: "user", content: "Say 'ok' if you receive this." },
          ], { maxTokens: 10 });
          console.log(`  ✅ Connection successful!`);
          console.log(`  Response: ${result.content.slice(0, 100)}`);
          console.log(`  Model: ${result.model}`);
          console.log(`  Tokens: ${result.usage.totalTokens}\n`);
        } catch (error) {
          console.log(`  ❌ Connection failed:`);
          console.log(`  ${error instanceof Error ? error.message : String(error)}\n`);
        }
      }),
  );
