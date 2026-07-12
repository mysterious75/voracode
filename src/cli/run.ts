/**
 * voracode run — Execute a task with AI
 *
 * Primary command. User provides task description, VORACODE plans,
 * executes, and returns results. Uses BYOK — user must configure
 * an API key before running.
 */

import { Command } from "commander";
import { existsSync } from "fs";
import { homedir } from "os";

export const runCommand = new Command("run")
  .description("Execute a task with AI (requires API key)")
  .argument("[message]", "Task description")
  .option("-m, --model <model>", "Model to use (provider/model-name)")
  .option("-a, --agent <agent>", "Agent mode (build|plan|debug)")
  .option("-y, --yes", "Auto-approve all actions (use with caution)")
  .option("--session <id>", "Continue an existing session")
  .option("--fork", "Fork session when continuing")
  .option("--output <format>", "Output format (text|json|silent)", "text")
  .option("--dry-run", "Show plan without executing")
  .action(async (message, options) => {
    if (!message) {
      console.error("\n  ✖ Error: task message required.");
      console.error("  Usage: voracode run \"<task description>\"");
      console.error("  Example: voracode run \"create a login page with React\"\n");
      process.exit(1);
    }

    // Check if API key is configured
    const configDir = `${homedir()}/.config/voracode`;
    if (!existsSync(configDir)) {
      console.log("\n  ⚠️  No VORACODE configuration found.");
      console.log("  Run 'voracode key set' to configure an API key first.");
      console.log("  Or run 'voracode init' to set up the project.\n");
      process.exit(1);
    }

    console.log(`\n  ⚡ VORACODE executing: "${message}"`);

    if (options.model) {
      console.log(`  📡 Model: ${options.model}`);
    }

    if (options.agent) {
      const modes = { build: "🤖", plan: "📋", debug: "🔍" };
      const icon = modes[options.agent as keyof typeof modes] || "🤖";
      console.log(`  ${icon} Mode: ${options.agent}`);
    }

    if (options["dry-run"]) {
      console.log("  📋 Dry-run mode — plan only, no execution.");
    }

    if (options.yes) {
      console.log("  ⚠️  Auto-approval enabled — all actions will execute automatically.");
    }

    // TODO: Phase 1.2 — implement actual agent execution
    console.log("\n  🔧 Agent execution engine — coming in Phase 1.2");
    console.log("  📌 Planned features:");
    console.log("     • Task planning with sub-task breakdown");
    console.log("     • Multi-model execution with auto-fallback");
    console.log("     • File read/write/edit operations");
    console.log("     • Sandboxed shell command execution");
    console.log("     • Git integration with diff review");
    console.log("     • Checkpoint system for rollback");
    console.log("\n  Run 'voracode doctor' to check system readiness.");
    console.log("  Run 'voracode key set' to configure your API key.\n");
  });
