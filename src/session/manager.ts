/**
 * VORACODE Session Manager — Create, resume, fork sessions
 *
 * Integrates with SQLite database for persistence.
 */

import { VoraDatabase } from "../storage/database";
import { ModelRouter } from "../models/router";
import { Agent } from "../engine/agent";

export interface SessionInfo {
  id: string;
  title: string;
  modelProvider: string;
  modelName: string;
  totalTokens: number;
  totalTurns: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export class SessionManager {
  private db: VoraDatabase;
  private router: ModelRouter;
  private agent: Agent;

  constructor() {
    this.db = new VoraDatabase();
    this.router = new ModelRouter();
    this.agent = new Agent();
  }

  /**
   * Create a new session
   */
  create(modelRef?: string): string {
    const provider = modelRef ? this.router.detectProvider(modelRef) : "auto";
    const modelName = modelRef || "auto";
    return this.db.createSession(provider, modelName);
  }

  /**
   * Resume an existing session
   */
  getSession(id: string): SessionInfo | null {
    const session = this.db.getSession(id) as Record<string, unknown> | null;
    if (!session) return null;

    return {
      id: session.id as string,
      title: session.title as string,
      modelProvider: session.model_provider as string,
      modelName: session.model_name as string,
      totalTokens: (session.total_tokens as number) || 0,
      totalTurns: (session.total_turns as number) || 0,
      status: session.status as string,
      createdAt: session.created_at as string,
      updatedAt: session.updated_at as string,
    };
  }

  /**
   * List all sessions
   */
  list(limit = 10): SessionInfo[] {
    return (this.db.listSessions(limit) as Record<string, unknown>[]).map((s) => ({
      id: s.id as string,
      title: s.title as string,
      modelProvider: s.model_provider as string,
      modelName: s.model_name as string,
      totalTokens: (s.total_tokens as number) || 0,
      totalTurns: (s.total_turns as number) || 0,
      status: s.status as string,
      createdAt: s.created_at as string,
      updatedAt: s.updated_at as string,
    }));
  }

  /**
   * Delete a session
   */
  delete(id: string): void {
    this.db.deleteSession(id);
  }

  /**
   * Run a task in a session
   */
  async run(sessionId: string, message: string, modelRef: string) {
    return this.agent.runTurn(sessionId, message, modelRef);
  }

  /**
   * Fork a session (create new from existing)
   */
  fork(id: string): string | null {
    const original = this.getSession(id);
    if (!original) return null;

    const newId = this.db.createSession(original.modelProvider, original.modelName, `${original.title} (fork)`);
    return newId;
  }

  /**
   * Get messages for a session
   */
  getMessages(sessionId: string) {
    return this.db.getMessages(sessionId);
  }

  /**
   * Get database path
   */
  getDbPath(): string {
    return this.db.getDbPath();
  }
}
