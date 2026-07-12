#!/usr/bin/env bun
/**
 * VORACODE — AI Coding Agent
 * One agent, every surface.
 *
 * Entry point for the VORACODE CLI.
 */

const VERSION = "0.0.1";
const NAME = "voracode";
const TAGLINE = "Your AI engineering partner. One agent, every surface.";

function printBanner(): void {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║              V O R A C O D E                ║
  ║        ${TAGLINE}         ║
  ║              v${VERSION}                       ║
  ╚══════════════════════════════════════════════╝
  `);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0] || "help";

  switch (command) {
    case "run":
      console.log("VORACODE run: executing task...");
      // TODO: implement agent execution
      break;

    case "init":
      console.log("VORACODE init: initializing project...");
      // TODO: implement project initialization
      break;

    case "session":
      console.log("VORACODE session: managing sessions...");
      // TODO: implement session management
      break;

    case "model":
      console.log("VORACODE model: managing AI models...");
      // TODO: implement model management
      break;

    case "skill":
      console.log("VORACODE skill: managing skills...");
      // TODO: implement skill management
      break;

    case "key":
      console.log("VORACODE key: managing API keys...");
      // TODO: implement key management
      break;

    case "version":
    case "--version":
    case "-v":
      console.log(`${NAME} v${VERSION}`);
      break;

    case "help":
    case "--help":
    case "-h":
    default:
      printBanner();
      console.log(`
  Usage:
    voracode <command> [options]

  Commands:
    run              Execute a task with AI
    init             Initialize VORACODE in project
    session          Manage sessions
    model            Manage AI providers and models
    skill            Manage skills
    key              Manage API keys
    config           View or edit configuration
    plugin           Manage plugins
    stats            Usage statistics
    doctor           System health check
    update           Update VORACODE
    version          Show version
    help             Show this help

  Examples:
    voracode run "create a login page"
    voracode init
    voracode model list
    voracode key set --provider openai

  Documentation: https://voracode.dev
      `);
      break;
  }
}

main().catch((error) => {
  console.error("VORACODE error:", error);
  process.exit(1);
});
