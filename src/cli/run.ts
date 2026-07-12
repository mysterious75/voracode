/**
 * voracode run — Execute a task with AI
 *
 * Premium execution experience with Apple-style output.
 */

import { Command } from "commander";
import { SessionManager } from "../session/manager";
import { ModelRouter } from "../models/router";
import { VoraDatabase } from "../storage/database";
import { c, spinner, success, error as err, footer } from "../ui/theme";

export const runCommand = new Command("run")
  .description("Execute a task with AI")
  .argument("[message]", "Task description")
  .option("-m, --model <model>", "Model to use (provider/model-name)")
  .option("-a, --agent <agent>", "Agent mode (build|plan|debug)")
  .option("-y, --yes", "Auto-approve all actions")
  .option("--session <id>", "Continue an existing session")
  .option("--fork", "Fork session when continuing")
  .option("--output <format>", "Output format (text|json|silent)", "text")
  .option("--dry-run", "Show plan without executing")
  .action(async (message, options) => {
    if (!message) {
      console.error(`\n  ${c.error}✖ Please provide a task description.${c.reset}\n`);
      console.error(`  ${c.dim}Usage: ${c.brand}${c.bold}voracode${c.reset}${c.dim} run "your task here"${c.reset}\n`);
      process.exit(1);
    }

    const sessions = new SessionManager();
    const router = new ModelRouter();
    const db = new VoraDatabase();

    let modelRef = options.model || "openrouter/openrouter/free";
    if (options.model) {
      modelRef = options.model.includes("/") ? options.model : `${router.detectProvider(options.model)}/${options.model}`;
    }

    const provider = modelRef.split("/")[0];
    if (!router.hasValidKey(provider)) {
      console.log(`\n  ${c.warning}◆${c.reset}  No API key for ${c.bold}${provider}${c.reset}`);
      console.log(`  ${c.dim}Configure: voracode key set ${provider} <your-api-key>${c.reset}\n`);
      process.exit(1);
    }

    let sessionId: string;
    if (options.session) {
      const existing = sessions.getSession(options.session);
      if (!existing) {
        console.error(`\n  ${c.error}✖ Session not found: ${options.session}${c.reset}\n`);
        process.exit(1);
      }
      sessionId = options.fork ? sessions.fork(options.session) || sessions.create(modelRef) : options.session;
    } else {
      sessionId = sessions.create(modelRef);
    }

    const isSilent = options.output === "silent";
    const isJson = options.output === "json";

    if (!isSilent && !isJson) {
      console.log(`\n  ${c.brand}◆${c.reset}  ${c.bold}Running${c.reset}  ${c.dim}${message}${c.reset}`);
      console.log(`  ${c.dim}Model:${c.reset} ${modelRef}`);
      console.log(`  ${c.dim}Session:${c.reset} ${sessionId.slice(0, 8)}...\n`);
      if (options["dry-run"]) {
        console.log(`  ${c.warning}◆${c.reset}  ${c.dim}Dry-run mode — no execution${c.reset}\n`);
      }
    }

    try {
      const result = await sessions.run(sessionId, message, modelRef, { maxTurns: 25 });

      if (isJson) {
        console.log(JSON.stringify(result, null, 2));
      } else if (isSilent) {
        console.log(result.content);
      } else {
        if (result.success) {
          console.log(`  ${c.success}${c.bold} Completed${c.reset}  ${c.dim}${result.turns} turns · ${result.steps} steps · ${result.tokensUsed} tokens${c.reset}\n`);

          // Render the AI response beautifully
          console.log(result.content);

          if (result.patternSuggestion) {
            console.log(`\n  ${c.cyan}◆${c.reset}  ${c.dim}VORACODE noticed a pattern — run ${c.bold}voracode skill patterns${c.reset}${c.dim} to see${c.reset}`);
          }

          console.log(`\n  ${c.dim}Session: ${c.brand}${sessionId.slice(0, 8)}${c.reset}`);
          console.log(`  ${c.dim}Data: ${sessions.getDbPath()}${c.reset}\n`);
        } else {
          console.log(`\n  ${c.error}✖ ${result.error || "Task failed"}${c.reset}\n`);
          process.exit(1);
        }
      }
    } catch (error) {
      console.error(`\n  ${c.error}✖ ${error instanceof Error ? error.message : String(error)}${c.reset}\n`);
      process.exit(1);
    }

    footer();
  });