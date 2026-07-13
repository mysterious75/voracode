/**
 * voracode session — Manage AI agent sessions
 */

import { Command } from "commander";
import { SessionManager } from "../session/manager";
import { writeFileSync } from "fs";

// Shared manager instance
const getManager = () => new SessionManager();

export const sessionCommand = new Command("session")
  .description("Manage AI agent sessions")
  .addCommand(
    new Command("list")
      .description("List all sessions")
      .option("--limit <number>", "Max sessions to show", "10")
      .action(async (options) => {
        const sessions = getManager();
        const list = sessions.list(Number(options.limit));

        if (list.length === 0) {
          console.log("\n  📋 No sessions yet. Run 'voracode run' to create one.\n");
          return;
        }

        console.log(`\n  📋 Recent sessions (last ${options.limit}):\n`);
        for (const s of list) {
          const date = new Date(s.createdAt + "Z").toLocaleString();
          console.log(`  🆔 ${s.id.slice(0, 8)}... | ${s.title.slice(0, 40).padEnd(40)} | ${s.status.padEnd(10)} | ${date}`);
        }
        console.log(`\n  Total: ${list.length} session(s)\n`);
      }),
  )
  .addCommand(
    new Command("show")
      .description("Show session details")
      .argument("<id>", "Session ID")
      .action(async (id) => {
        const sessions = getManager();
        const session = sessions.getSession(id);

        if (!session) {
          console.error(`\n  ✖ Session not found: ${id}\n`);
          process.exit(1);
        }

        console.log(`\n  📄 Session: ${id}`);
        console.log(`  Title: ${session.title}`);
        console.log(`  Model: ${session.modelProvider}/${session.modelName}`);
        console.log(`  Status: ${session.status}`);
        console.log(`  Tokens: ${session.totalTokens}`);
        console.log(`  Turns: ${session.totalTurns}`);
        console.log(`  Created: ${session.createdAt}`);
        console.log(`  Updated: ${session.updatedAt}`);

        const messages = sessions.getMessages(id);
        console.log(`  Messages: ${messages.length}\n`);
      }),
  )
  .addCommand(
    new Command("resume")
      .description("Resume an existing session")
      .argument("<id>", "Session ID to resume")
      .option("-f, --fork", "Fork into a new session")
      .action(async (id, options) => {
        const sessions = getManager();
        const session = sessions.getSession(id);

        if (!session) {
          console.error(`\n  ✖ Session not found: ${id}\n`);
          process.exit(1);
        }

        if (options.fork) {
          const newId = sessions.fork(id);
          if (newId) {
            console.log(`\n  🌿 Forked session ${id.slice(0, 8)}... → ${newId.slice(0, 8)}...`);
            console.log(`  Run: voracode run "your task" --session ${newId}\n`);
          }
        } else {
          console.log(`\n  🔄 Resuming session ${id.slice(0, 8)}...`);
          console.log(`  Last turn: ${session.totalTurns} turns, ${session.totalTokens} tokens`);
          console.log(`  Run: voracode run "your task" --session ${id}\n`);
        }
      }),
  )
  .addCommand(
    new Command("delete")
      .description("Delete a session")
      .argument("<id>", "Session ID to delete")
      .option("-f, --force", "Skip confirmation")
      .action(async (id) => {
        const sessions = getManager();
        const session = sessions.getSession(id);

        if (!session) {
          console.error(`\n  ✖ Session not found: ${id}\n`);
          process.exit(1);
        }

        sessions.delete(id);
        console.log(`\n  🗑️  Session ${id.slice(0, 8)}... deleted.\n`);
      }),
  )
  .addCommand(
    new Command("export")
      .description("Export session as JSON")
      .argument("<id>", "Session ID to export")
      .argument("[file]", "Output file path")
      .action(async (id, file) => {
        const sessions = getManager();
        const session = sessions.getSession(id);

        if (!session) {
          console.error(`\n  ✖ Session not found: ${id}\n`);
          process.exit(1);
        }

        const messages = sessions.getMessages(id);
        const data = JSON.stringify({ session, messages }, null, 2);

        if (file) {
          writeFileSync(file, data);
          console.log(`\n  💾 Session exported to ${file}\n`);
        } else {
          console.log(data);
        }
      }),
  )
  .addCommand(
    new Command("import")
      .description("Import session from JSON")
      .argument("<file>", "JSON file path or URL")
      .action(async (file) => {
        console.log(`\n  📥 Importing session from ${file}\n`);
        // TODO: implement import
      }),
  );
