/**
 * voracode run — Execute a task with AI
 *
 * This is the primary command. User provides a task description,
 * VORACODE plans, executes, and returns results.
 */

import { Command } from "commander";

export const runCommand = new Command("run")
  .description("Execute a task with AI")
  .argument("[message]", "Task description")
  .option("-m, --model <model>", "Model to use (provider/model-name)")
  .option("-a, --agent <agent>", "Agent mode (build|plan)")
  .option("-y, --yes", "Auto-approve all actions")
  .option("--no-reply", "Inject context without waiting for response")
  .option("--session <id>", "Continue an existing session")
  .option("--fork", "Fork session when continuing")
  .option("--output <format>", "Output format (text|json|silent)", "text")
  .action(async (message, options) => {
    if (!message) {
      console.error("Error: task message required.\n  Usage: voracode run \"<task description>\"");
      process.exit(1);
    }

    console.log(`\n  ⚡ VORACODE executing: "${message}"`);

    if (options.model) {
      console.log(`  📡 Model: ${options.model}`);
    }

    if (options.agent) {
      console.log(`  🤖 Agent mode: ${options.agent}`);
    }

    if (options.yes) {
      console.log("  ⚠️  Auto-approval enabled");
    }

    // TODO: Phase 1.2 — implement actual agent execution
    console.log("\n  [Agent execution coming in Phase 1.2]");
    console.log("  Run 'voracode doctor' to check system readiness.\n");
  });
