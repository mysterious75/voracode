/**
 * voracode skill — Manage skills
 *
 * Skills are reusable prompt templates that tell the agent how to handle
 * specific tasks. Built-in skills + auto-learned skills from self-improvement.
 */

import { Command } from "commander";
import { SelfImprovementEngine } from "../skills/self-improve/engine";
import { VoraDatabase } from "../storage/database";
import { existsSync, readFileSync, readdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";

export const skillCommand = new Command("skill")
  .description("Manage skills")
  .alias("skills")
  .addCommand(
    new Command("list")
      .description("List available skills")
      .action(async () => {
        const skillsDir = join(homedir(), ".config", "voracode", "skills");
        const builtinSkills = [
          { name: "web-search", description: "Search the web for information", source: "builtin" },
          { name: "web-fetch", description: "Fetch and extract web content", source: "builtin" },
          { name: "research", description: "Multi-source research with synthesis", source: "builtin" },
          { name: "code-review", description: "AI-powered code review", source: "builtin" },
          { name: "git-helper", description: "Git automation assistance", source: "builtin" },
          { name: "deploy", description: "One-command deployment templates", source: "builtin" },
          { name: "learn", description: "Self-improvement pattern tracker", source: "builtin" },
        ];

        // Find learned skills
        const learnedSkills: Array<{ name: string; description: string; source: string }> = [];
        if (existsSync(skillsDir)) {
          for (const dir of readdirSync(skillsDir)) {
            const skillPath = join(skillsDir, dir, "SKILL.md");
            if (existsSync(skillPath)) {
              try {
                const content = readFileSync(skillPath, "utf-8");
                const descMatch = content.match(/description:\s*(.+)/);
                learnedSkills.push({
                  name: dir,
                  description: descMatch ? descMatch[1].trim() : "Learned skill",
                  source: "learned",
                });
              } catch {}
            }
          }
        }

        console.log("\n  🛠️  Available Skills:\n");

        if (builtinSkills.length > 0) {
          console.log("  Built-in:");
          for (const s of builtinSkills) {
            console.log(`    📦 ${s.name.padEnd(20)} ${s.description}`);
          }
        }

        if (learnedSkills.length > 0) {
          console.log("\n  Learned (auto-generated):");
          for (const s of learnedSkills) {
            console.log(`    🧠 ${s.name.padEnd(20)} ${s.description}`);
          }
        }

        console.log(`\n  Total: ${builtinSkills.length + learnedSkills.length} skills\n`);
      }),
  )
  .addCommand(
    new Command("patterns")
      .description("Show learning patterns detected")
      .action(async () => {
        const db = new VoraDatabase();
        const sie = new SelfImprovementEngine(db);
        const patterns = sie.getPatterns();

        if (patterns.length === 0) {
          console.log("\n  🧠 No patterns detected yet.");
          console.log("  Use VORACODE regularly — it will learn from your tasks.\n");
          return;
        }

        console.log("\n  🧠 Detected Patterns:\n");
        for (const p of patterns) {
          const total = p.successCount + p.failureCount;
          const rate = total > 0 ? ((p.successCount / total) * 100).toFixed(0) : "0";
          const status = p.userDecision === "accepted" ? "✅" : p.userDecision === "rejected" ? "❌" : "⏳";
          console.log(`  ${status} ${p.description.slice(0, 50).padEnd(50)} ${rate}% success (${total}x)`);
        }

        const stats = sie.getStats();
        console.log(`\n  📊 Storage: ${stats.storageKB}KB | Patterns: ${stats.patterns} | Skills: ${stats.skills}\n`);
      }),
  )
  .addCommand(
    new Command("create")
      .description("Create a skill from the latest pattern")
      .argument("[pattern-id]", "Pattern ID to create skill from")
      .action(async (patternId) => {
        const db = new VoraDatabase();
        const sie = new SelfImprovementEngine(db);
        const patterns = sie.getPatterns();

        if (patterns.length === 0) {
          console.log("\n  ⚠️  No patterns available to create skills from.");
          console.log("  Use VORACODE more to generate patterns.\n");
          return;
        }

        let pattern = patterns[0];
        if (patternId) {
          const found = patterns.find((p) => p.id === Number(patternId));
          if (found) pattern = found;
        }

        const skillName = sie.generateSkill(pattern);
        console.log(`\n  ✅ Created skill: ${skillName}`);
        console.log(`  📁 Location: ~/.config/voracode/skills/${skillName}/SKILL.md`);
        console.log(`  🧠 Based on: ${pattern.description}`);
        console.log(`  📊 Success rate: ${((pattern.successCount / (pattern.successCount + pattern.failureCount)) * 100).toFixed(0)}%\n`);
      }),
  )
  .addCommand(
    new Command("install")
      .description("Install a skill from marketplace or path")
      .argument("<source>", "Skill name, GitHub URL, or local path")
      .action(async (source) => {
        console.log(`\n  📦 Installing skill from: ${source}`);
        console.log("  (Marketplace integration coming in Phase 2)\n");
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
    new Command("rollback")
      .description("Rollback a skill to its previous version")
      .argument("<name>", "Skill name")
      .action(async (name) => {
        const db = new VoraDatabase();
        const sie = new SelfImprovementEngine(db);
        const success = sie.rollbackSkill(name);
        if (success) {
          console.log(`\n  ✅ Rolled back skill: ${name}\n`);
        } else {
          console.log(`\n  ⚠️  No previous version found for: ${name}\n`);
        }
      }),
  );