/**
 * voracode skill — Manage skills
 *
 * Skills are reusable prompt templates (SKILL.md) that tell
 * the agent how to handle specific tasks. Built-in skills:
 * web-search, web-fetch, research, code-review, git-helper,
 * deploy, learn (self-improvement).
 */

import { Command } from "commander";

export const skillCommand = new Command("skill")
  .description("Manage skills")
  .alias("skills")
  .addCommand(
    new Command("list")
      .description("List available skills")
      .action(async () => {
        console.log("\n  🛠️  Available Skills:");
        console.log("  ┌──────────────────────┬──────────────────────────────────────┐");
        console.log("  │ Skill                │ Description                          │");
        console.log("  ├──────────────────────┼──────────────────────────────────────┤");
        console.log("  │ web-search           │ Search the web for information       │");
        console.log("  │ web-fetch            │ Fetch and extract web content        │");
        console.log("  │ research             │ Multi-source research with synthesis │");
        console.log("  │ code-review          │ AI-powered code review               │");
        console.log("  │ git-helper           │ Git automation assistance            │");
        console.log("  │ deploy               │ One-command deployment               │");
        console.log("  │ learn                │ Self-improvement pattern tracker     │");
        console.log("  └──────────────────────┴──────────────────────────────────────┘");
        console.log("  (Detailed skill management coming in Phase 1.3)\n");
      }),
  )
  .addCommand(
    new Command("install")
      .description("Install a skill from marketplace or path")
      .argument("<source>", "Skill name, GitHub URL, or local path")
      .action(async (source) => {
        console.log(`\n  📦 Installing skill from: ${source}`);
        console.log("  (Coming in Phase 1.3 — skill engine)\n");
      }),
  )
  .addCommand(
    new Command("remove")
      .description("Remove an installed skill")
      .argument("<name>", "Skill name")
      .action(async (name) => {
        console.log(`\n  🗑️  Removing skill: ${name}\n`);
      }),
  )
  .addCommand(
    new Command("create")
      .description("Create a new skill from a template")
      .argument("<name>", "Skill name")
      .action(async (name) => {
        console.log(`\n  ✨ Creating skill: ${name}`);
        console.log("  (Coming in Phase 1.3 — skill engine)\n");
      }),
  );
