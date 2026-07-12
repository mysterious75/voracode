/**
 * VORACODE Self-Improvement Engine
 *
 * Learns from user patterns to suggest reusable skills.
 * Privacy-first: all learning is local, no data sent anywhere.
 *
 * 3-Gate Learning System:
 *   Gate 1: Repetition (3+ similar tasks)
 *   Gate 2: Success rate (80%+ to auto-learn)
 *   Gate 3: User confirmation (always ask before creating skill)
 */

import { VoraDatabase } from "../../storage/database";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";

export interface TaskPattern {
  id: number;
  signature: string;          // hash of task type + tools used
  description: string;         // human-readable description
  toolSequence: string[];      // tools used in order
  filesChanged: string[];     // file paths touched
  commandsRun: string[];      // bash commands run
  successCount: number;
  failureCount: number;
  lastSeen: string;
  suggestedSkill: boolean;     // has user been asked about this?
  userDecision: "pending" | "accepted" | "rejected" | "never";
  skillPath?: string;          // path to generated SKILL.md
}

export class SelfImprovementEngine {
  private db: VoraDatabase;
  private skillsDir: string;

  constructor(db: VoraDatabase) {
    this.db = db;
    this.skillsDir = join(homedir(), ".config", "voracode", "skills");
    if (!existsSync(this.skillsDir)) {
      mkdirSync(this.skillsDir, { recursive: true });
    }
    this.ensureTables();
  }

  private ensureTables(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS task_patterns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        signature TEXT UNIQUE NOT NULL,
        description TEXT NOT NULL,
        tool_sequence TEXT NOT NULL,
        files_changed TEXT,
        commands_run TEXT,
        success_count INTEGER DEFAULT 0,
        failure_count INTEGER DEFAULT 0,
        last_seen TEXT DEFAULT (datetime('now')),
        suggested_skill INTEGER DEFAULT 0,
        user_decision TEXT DEFAULT 'pending',
        skill_path TEXT
      )
    `);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        category TEXT,
        confidence REAL DEFAULT 0.5,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS skill_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        skill_name TEXT NOT NULL,
        version INTEGER DEFAULT 1,
        action TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
  }

  /**
   * Record a completed task and check for patterns
   */
  recordTask(
    description: string,
    toolsUsed: string[],
    filesChanged: string[],
    commandsRun: string[],
    success: boolean,
  ): TaskPattern | null {
    // Create a signature from tools used (not file paths — those are project specific)
    const signature = this.createSignature(toolsUsed, description);

    // Try to find existing pattern
    const existing = this.db.query(
      "SELECT * FROM task_patterns WHERE signature = ?",
    ).get(signature) as Record<string, unknown> | null;

    if (existing) {
      // Update existing pattern
      const newSuccess = (existing.success_count as number) + (success ? 1 : 0);
      const newFailure = (existing.failure_count as number) + (success ? 0 : 1);
      const total = newSuccess + newFailure;
      const successRate = total > 0 ? newSuccess / total : 0;

      this.db.run(
        `UPDATE task_patterns SET 
         success_count = ?, failure_count = ?, last_seen = datetime('now')
         WHERE signature = ?`,
        [newSuccess, newFailure, signature],
      );

      // Check if we should suggest a skill
      if (total >= 3 && successRate >= 0.8 && !existing.suggested_skill) {
        const pattern: TaskPattern = {
          id: existing.id as number,
          signature,
          description: existing.description as string,
          toolSequence: JSON.parse(existing.tool_sequence as string),
          filesChanged: JSON.parse((existing.files_changed as string) || "[]"),
          commandsRun: JSON.parse((existing.commands_run as string) || "[]"),
          successCount: newSuccess,
          failureCount: newFailure,
          lastSeen: new Date().toISOString(),
          suggestedSkill: true,
          userDecision: "pending",
        };

        // Mark as suggested
        this.db.run("UPDATE task_patterns SET suggested_skill = 1 WHERE signature = ?", [signature]);

        return pattern;
      }

      return null;
    }

    // Create new pattern
    this.db.run(
      `INSERT INTO task_patterns 
       (signature, description, tool_sequence, files_changed, commands_run, success_count, failure_count)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        signature,
        description,
        JSON.stringify(toolsUsed),
        JSON.stringify(filesChanged),
        JSON.stringify(commandsRun),
        success ? 1 : 0,
        success ? 0 : 1,
      ],
    );

    return null;
  }

  /**
   * Create a pattern signature from tools and task description
   */
  private createSignature(toolsUsed: string[], description: string): string {
    // Normalize: lowercase, remove file paths, keep tool sequence
    const tools = toolsUsed.map((t) => t.toLowerCase()).sort().join(",");
    const taskType = this.classifyTask(description);
    return `${taskType}|${tools}`;
  }

  /**
   * Classify a task into a category
   */
  private classifyTask(description: string): string {
    const d = description.toLowerCase();
    if (d.includes("create") || d.includes("new") || d.includes("make")) return "create";
    if (d.includes("fix") || d.includes("bug") || d.includes("error")) return "fix";
    if (d.includes("refactor") || d.includes("optimize") || d.includes("improve")) return "refactor";
    if (d.includes("test") || d.includes("spec")) return "test";
    if (d.includes("deploy") || d.includes("publish")) return "deploy";
    if (d.includes("explain") || d.includes("understand") || d.includes("how")) return "explain";
    return "general";
  }

  /**
   * Generate a SKILL.md from a pattern
   */
  generateSkill(pattern: TaskPattern): string {
    const skillName = pattern.description
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "learned-skill";

    const skillDir = join(this.skillsDir, skillName);
    mkdirSync(skillDir, { recursive: true });

    const skillPath = join(skillDir, "SKILL.md");
    const content = `---
name: ${skillName}
description: Auto-learned skill for: ${pattern.description}
version: 1.0.0
source: learned
---

## When to use
Use this skill when performing: ${pattern.description}

## Pattern discovered
- Tools used: ${pattern.toolSequence.join(", ")}
- Success rate: ${((pattern.successCount / (pattern.successCount + pattern.failureCount)) * 100).toFixed(0)}%
- Times seen: ${pattern.successCount + pattern.failureCount}

## Instructions
1. Follow the same tool sequence that worked before
2. Apply to the specific project structure
3. Verify the result matches expectations

## Notes
- This skill was auto-generated by VORACODE's self-improvement engine
- You can edit or delete it: voracode skill remove ${skillName}
- Rollback: voracode skill history ${skillName}
`;

    writeFileSync(skillPath, content, "utf-8");

    // Save to history
    this.db.run(
      "INSERT INTO skill_history (skill_name, version, action, content) VALUES (?, ?, ?, ?)",
      [skillName, 1, "created", content],
    );

    // Update pattern with skill path
    this.db.run(
      "UPDATE task_patterns SET skill_path = ?, user_decision = 'accepted' WHERE signature = ?",
      [skillPath, pattern.signature],
    );

    return skillName;
  }

  /**
   * User rejects a suggested skill
   */
  rejectPattern(signature: string, permanently: boolean = false): void {
    this.db.run(
      "UPDATE task_patterns SET user_decision = ? WHERE signature = ?",
      [permanently ? "never" : "rejected", signature],
    );
  }

  /**
   * Record a user preference
   */
  recordPreference(key: string, value: string, category = "general"): void {
    this.db.run(
      `INSERT OR REPLACE INTO user_preferences 
       (key, value, category, updated_at) VALUES (?, ?, ?, datetime('now'))`,
      [key, value, category],
    );
  }

  /**
   * Get all learned patterns
   */
  getPatterns(): TaskPattern[] {
    const rows = this.db.query("SELECT * FROM task_patterns ORDER BY last_seen DESC").all() as Record<string, unknown>[];
    return rows.map((r) => ({
      id: r.id as number,
      signature: r.signature as string,
      description: r.description as string,
      toolSequence: JSON.parse(r.tool_sequence as string),
      filesChanged: JSON.parse((r.files_changed as string) || "[]"),
      commandsRun: JSON.parse((r.commands_run as string) || "[]"),
      successCount: (r.success_count as number) || 0,
      failureCount: (r.failure_count as number) || 0,
      lastSeen: (r.last_seen as string) || new Date().toISOString(),
      suggestedSkill: Boolean(r.suggested_skill),
      userDecision: (r.user_decision as "pending" | "accepted" | "rejected" | "never") || "pending",
      skillPath: r.skill_path as string | undefined,
    }));
  }

  /**
   * Get user preferences
   */
  getPreferences(): Record<string, string> {
    const rows = this.db.query("SELECT key, value FROM user_preferences").all() as Record<string, unknown>[];
    const prefs: Record<string, string> = {};
    for (const r of rows) {
      prefs[r.key as string] = r.value as string;
    }
    return prefs;
  }

  /**
   * Rollback a skill to a previous version
   */
  rollbackSkill(skillName: string): boolean {
    const history = this.db.query(
      "SELECT * FROM skill_history WHERE skill_name = ? ORDER BY created_at DESC LIMIT 2",
    ).all(skillName) as Record<string, unknown>[];

    if (history.length < 2) return false;

    const previousVersion = history[1];
    const skillDir = join(this.skillsDir, skillName);
    const skillPath = join(skillDir, "SKILL.md");

    if (existsSync(skillPath)) {
      writeFileSync(skillPath, previousVersion.content as string, "utf-8");
      this.db.run(
        "INSERT INTO skill_history (skill_name, version, action, content) VALUES (?, ?, ?, ?)",
        [skillName, (previousVersion.version as number) + 1, "rollback", previousVersion.content as string],
      );
      return true;
    }
    return false;
  }

  /**
   * Get storage statistics
   */
  getStats(): { patterns: number; preferences: number; skills: number; storageKB: number } {
    const patterns = (this.db.query("SELECT COUNT(*) as c FROM task_patterns").get() as { c: number }).c;
    const preferences = (this.db.query("SELECT COUNT(*) as c FROM user_preferences").get() as { c: number }).c;
    const skills = (this.db.query("SELECT COUNT(*) as c FROM task_patterns WHERE skill_path IS NOT NULL").get() as { c: number }).c;

    // Estimate storage: ~2KB per pattern, ~100B per preference
    const storageKB = Math.round((patterns * 2 + preferences * 0.1) * 10) / 10;

    return { patterns, preferences, skills, storageKB };
  }
}