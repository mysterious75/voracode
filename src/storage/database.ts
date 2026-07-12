/**
 * VORACODE Database — SQLite storage using bun:sqlite
 *
 * Stores sessions, messages, memory, stats, audit logs.
 * All data is LOCAL by default — zero telemetry.
 */

import { Database } from "bun:sqlite";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";

export class VoraDatabase {
  private db: Database;
  private dataDir: string;

  constructor() {
    this.dataDir = join(homedir(), ".local", "share", "voracode");
    if (!existsSync(this.dataDir)) {
      mkdirSync(this.dataDir, { recursive: true });
    }

    this.db = new Database(join(this.dataDir, "voracode.db"));
    this.db.exec("PRAGMA journal_mode=WAL");
    this.db.exec("PRAGMA foreign_keys=ON");
    this.migrate();
  }

  private migrate(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        title TEXT,
        project_path TEXT,
        model_provider TEXT NOT NULL,
        model_name TEXT NOT NULL,
        total_tokens INTEGER DEFAULT 0,
        total_turns INTEGER DEFAULT 0,
        status TEXT DEFAULT 'active',
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        tokens INTEGER,
        tool_calls TEXT,
        parent_id INTEGER REFERENCES messages(id),
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS memory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE,
        content TEXT NOT NULL,
        category TEXT,
        priority INTEGER DEFAULT 1,
        tags TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);

    this.db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(
        content, tags,
        content=memory,
        content_rowid=id
      )
    `);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS skills (
        name TEXT PRIMARY KEY,
        description TEXT NOT NULL,
        source TEXT NOT NULL,
        path TEXT NOT NULL,
        trigger_count INTEGER DEFAULT 0,
        success_count INTEGER DEFAULT 0,
        last_used_at TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL UNIQUE,
        api_calls INTEGER DEFAULT 0,
        tokens_in INTEGER DEFAULT 0,
        tokens_out INTEGER DEFAULT 0,
        cache_hits INTEGER DEFAULT 0,
        errors INTEGER DEFAULT 0,
        tasks_completed INTEGER DEFAULT 0
      )
    `);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS audit_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT DEFAULT (datetime('now')),
        event_type TEXT NOT NULL,
        details TEXT,
        allowed INTEGER NOT NULL DEFAULT 1
      )
    `);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS checkpoints (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
        message_id INTEGER NOT NULL REFERENCES messages(id),
        description TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);
  }

  // ── Session operations ──

  createSession(provider: string, model: string, title = "Untitled"): string {
    const id = crypto.randomUUID();
    this.db.run(
      "INSERT INTO sessions (id, title, model_provider, model_name) VALUES (?, ?, ?, ?)",
      [id, title, provider, model],
    );
    return id;
  }

  getSession(id: string) {
    return this.db.query("SELECT * FROM sessions WHERE id = ?").get(id);
  }

  listSessions(limit = 10) {
    return this.db
      .query("SELECT * FROM sessions ORDER BY created_at DESC LIMIT ?")
      .all(limit);
  }

  updateSession(id: string, updates: Record<string, unknown>): void {
    const keys = Object.keys(updates);
    const setClause = keys.map((k) => `${k} = ?`).join(", ");
    const values = keys.map((k) => updates[k]);
    values.push(id);
    this.db.run(`UPDATE sessions SET ${setClause}, updated_at = datetime('now') WHERE id = ?`, values);
  }

  deleteSession(id: string): void {
    this.db.run("DELETE FROM sessions WHERE id = ?", [id]);
  }

  // ── Message operations ──

  addMessage(sessionId: string, role: string, content: string, tokens = 0, toolCalls?: string): number {
    const result = this.db.run(
      "INSERT INTO messages (session_id, role, content, tokens, tool_calls) VALUES (?, ?, ?, ?, ?)",
      [sessionId, role, content, tokens, toolCalls || null],
    );
    return Number(result.lastInsertRowid);
  }

  getMessages(sessionId: string, limit = 100) {
    return this.db
      .query("SELECT * FROM messages WHERE session_id = ? ORDER BY created_at ASC LIMIT ?")
      .all(sessionId, limit);
  }

  // ── Memory operations ──

  addMemory(key: string, content: string, category = "general", tags?: string): void {
    this.db.run(
      "INSERT OR REPLACE INTO memory (key, content, category, tags, updated_at) VALUES (?, ?, ?, ?, datetime('now'))",
      [key, content, category, tags || null],
    );
  }

  searchMemory(query: string) {
    return this.db
      .query("SELECT m.* FROM memory_fts f JOIN memory m ON f.rowid = m.id WHERE memory_fts MATCH ? ORDER BY rank LIMIT 10")
      .all(query);
  }

  // ── Stats operations ──

  recordApiCall(tokensIn: number, tokensOut: number): void {
    const today = new Date().toISOString().slice(0, 10);
    this.db.run(`
      INSERT INTO stats (date, api_calls, tokens_in, tokens_out) VALUES (?, 1, ?, ?)
      ON CONFLICT(date) DO UPDATE SET api_calls = api_calls + 1, tokens_in = tokens_in + ?, tokens_out = tokens_out + ?
    `, [today, tokensIn, tokensOut, tokensIn, tokensOut]);
  }

  getStats(days = 7) {
    return this.db
      .query("SELECT * FROM stats WHERE date >= date('now', ? || ' days') ORDER BY date")
      .all(`-${days}`);
  }

  // ── Audit operations ──

  logAudit(eventType: string, details: string, allowed = true): void {
    this.db.run(
      "INSERT INTO audit_log (event_type, details, allowed) VALUES (?, ?, ?)",
      [eventType, details, allowed ? 1 : 0],
    );
  }

  getAuditLog(limit = 50) {
    return this.db
      .query("SELECT * FROM audit_log ORDER BY timestamp DESC LIMIT ?")
      .all(limit);
  }

  // ── Checkpoint operations ──

  createCheckpoint(sessionId: string, messageId: number, description: string): void {
    this.db.run(
      "INSERT INTO checkpoints (session_id, message_id, description) VALUES (?, ?, ?)",
      [sessionId, messageId, description],
    );
  }

  // ── Utility ──

  close(): void {
    this.db.close();
  }

  getDbPath(): string {
    return join(this.dataDir, "voracode.db");
  }

  // ── Generic database access (used by SelfImprovementEngine) ──

  exec(sql: string): void {
    this.db.exec(sql);
  }

  query(sql: string) {
    return this.db.query(sql);
  }

  run(sql: string, params: unknown[] = []): void {
    this.db.run(sql, params);
  }
}
