import * as readline from "readline";
import { SessionManager } from "../session/manager";
import { ModelRouter } from "../models/router";
import { c, printBanner, footer } from "../ui/theme";

export async function startInteractiveSession() {
  printBanner();
  console.log(`  ${c.dim}Welcome to VORACODE Interactive Mode.${c.reset}`);
  console.log(`  ${c.dim}Type 'exit' or press Ctrl+C to quit. Type 'help' for commands.${c.reset}\n`);

  const sessions = new SessionManager();
  const router = new ModelRouter();

  const modelRef = "openrouter/openrouter/free";
  const provider = modelRef.split("/")[0];

  if (!router.hasValidKey(provider)) {
    console.log(`  ${c.warning}◆${c.reset}  No API key for ${c.bold}${provider}${c.reset}`);
    console.log(`  ${c.dim}Configure: voracode key set ${provider} <your-api-key>${c.reset}\n`);
    process.exit(1);
  }

  const sessionId = sessions.create(modelRef);
  console.log(`  ${c.brand}◆${c.reset}  ${c.bold}Session Started${c.reset}  ${c.dim}${sessionId.slice(0, 8)}...${c.reset}\n`);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: `  ${c.cyan}❯${c.reset} `,
  });

  rl.prompt();

  rl.on("line", async (line) => {
    const input = line.trim();
    if (!input) {
      rl.prompt();
      return;
    }

    if (input.toLowerCase() === "exit" || input.toLowerCase() === "quit") {
      console.log(`\n  ${c.dim}Goodbye!${c.reset}`);
      process.exit(0);
    }

    if (input.toLowerCase() === "help") {
      console.log(`\n  ${c.bold}Interactive Commands:${c.reset}`);
      console.log(`  ${c.dim}help${c.reset}    Show this message`);
      console.log(`  ${c.dim}exit${c.reset}    Quit interactive mode`);
      console.log(`  ${c.dim}clear${c.reset}   Clear console`);
      console.log(`\n  Just type any task or question to run it through the agent.\n`);
      rl.prompt();
      return;
    }

    if (input.toLowerCase() === "clear") {
      console.clear();
      printBanner();
      rl.prompt();
      return;
    }

    // Run the agent
    console.log(`\n  ${c.dim}Thinking...${c.reset}`);
    try {
      const result = await sessions.run(sessionId, input, modelRef, { maxTurns: 25 });
      
      console.log("");
      if (result.success) {
        console.log(result.content);
        if (result.patternSuggestion) {
          console.log(`\n  ${c.cyan}◆${c.reset}  ${c.dim}VORACODE noticed a pattern — run ${c.bold}voracode skill patterns${c.reset}${c.dim} to see${c.reset}`);
        }
      } else {
        console.log(`  ${c.error}✖ ${result.error || "Task failed"}${c.reset}`);
      }
    } catch (error) {
      console.log(`  ${c.error}✖ ${error instanceof Error ? error.message : String(error)}${c.reset}`);
    }
    
    console.log("");
    rl.prompt();
  }).on("close", () => {
    console.log(`\n  ${c.dim}Goodbye!${c.reset}`);
    process.exit(0);
  });
}
