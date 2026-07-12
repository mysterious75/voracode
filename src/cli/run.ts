/**
 * voracode run — Execute a task with AI
 *
 * Uses the VORACODE agent engine to plan, execute, and return results.
 * Requires user to have configured an API key (BYOK model).
 */

import { Command } from "commander";
import { SessionManager } from "../session/manager";
import { ModelRouter } from "../models/router";
import { VoraDatabase } from "../storage/database";

export const runCommand = new Command("run")
  .description("Execute a task with AI (requires API key)")
  .argument("[message]", "Task description")
  .option("-m, --model <model>", "Model to use (provider/model-name)")
  .option("-a, --agent <agent>", "Agent mode (build|plan|debug)")
  .option("-y, --yes", "Auto-approve all actions (use with caution)")
  .option("--session <id>", "Continue an existing session")
  .option("--fork", "Fork session when continuing")
  .option("--output <format>", "Output format (text|json|silent)", "text")
  .option("--dry-run", "Show what would be done without executing")
  .action(async (message, options) => {
    if (!message) {
      console.error("\n  ✖ Error: task message required.");
      console.error("  Usage: voracode run \"<task description>\"");
      console.error("  Example: voracode run \"create a login page with React\"\n");
      process.exit(1);
    }

    const router = new ModelRouter();
    const db = new VoraDatabase();
    const sessions = new SessionManager();

    // Resolve model
    let modelRef = options.model || "deepseek/deepseek-chat";
    if (options.model) {
      modelRef = options.model.includes("/") ? options.model : `${router.detectProvider(options.model)}/${options.model}`;
    }

    // Check if key is available
    const provider = modelRef.split("/")[0];
    if (!router.hasValidKey(provider)) {
      console.log(`\n  ⚠️  No API key configured for '${provider}'.`);
      console.log(`  VORACODE requires your own API key (BYOK model).`);
      console.log(`  Configure with: voracode key set ${provider} <your-api-key>`);
      console.log(`  Or set environment: ${provider.toUpperCase()}_API_KEY=sk-...\n`);
      process.exit(1);
    }

    // Resolve session
    let sessionId: string;
    if (options.session) {
      const existing = sessions.getSession(options.session);
      if (!existing) {
        console.error(`\n  ✖ Session not found: ${options.session}\n`);
        process.exit(1);
      }
      sessionId = options.fork ? sessions.fork(options.session) || sessions.create(modelRef) : options.session;
      console.log(`  🔄 ${options.fork ? "Forked from" : "Continuing"} session: ${options.session}`);
    } else {
      sessionId = sessions.create(modelRef);
    }

    const mode = options.agent || "build";
    const isJson = options.output === "json";
    const isSilent = options.output === "silent";

    if (!isSilent) {
      console.log(`\n  ⚡ VORACODE executing: "${message}"`);
      console.log(`  📡 Model: ${modelRef}`);
      console.log(`  🤖 Mode: ${mode}`);
      console.log(`  🆔 Session: ${sessionId}\n`);

      if (options["dry-run"]) {
        console.log("  📋 Dry-run mode — planning only.\n");
        // Show the system prompt + user message but don't execute
        const messages = sessions.getMessages(sessionId);
        console.log(`  ℹ️  Session has ${messages.length} previous messages.\n`);
        console.log("  (Run without --dry-run to execute the task)\n");
        return;
      }
    }

    if (options.yes && !isSilent) {
      console.log("  ⚠️  Auto-approval enabled — all actions will execute automatically.\n");
    }

    if (!isSilent) console.log("  Processing...");

    // Execute the task
    try {
      const result = await sessions.run(sessionId, message, modelRef);

      if (isJson) {
        console.log(JSON.stringify(result, null, 2));
      } else if (isSilent) {
        // Only output the content
        console.log(result.content);
      } else {
        if (result.success) {
          console.log(`\n  ✅ Task completed in ${result.turns} turns, ${result.steps} steps (${result.tokensUsed} tokens)\n`);
          console.log(result.content);
          console.log(`\n  ℹ️  Session: ${result.sessionId}`);
          console.log(`  📁 Data: ${sessions.getDbPath()}`);

          // Show self-improvement suggestion if detected
          if (result.patternSuggestion) {
            console.log(result.patternSuggestion);
          }
          console.log();
        } else {
          console.log(`\n  ❌ Task failed after ${result.turns} turns`);
          console.log(`  Error: ${result.error}\n`);
          process.exit(1);
        }
      }
    } catch (error) {
      console.error(`\n  ❌ Execution error: ${error instanceof Error ? error.message : String(error)}\n`);
      process.exit(1);
    }
  });
