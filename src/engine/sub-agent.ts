/**
 * VORACODE Sub-Agent System — Parallel task execution agents
 *
 * Like Claude Code's sub-agents, Cursor's parallel agents:
 * - Each sub-agent gets its own context window
 * - Runs independently with specific tools
 * - Reports back to main agent
 * - Can use different models per task
 */

import { ModelRouter, type ChatMessage } from "../models/router";
import { ToolExecutor } from "../tools/executor";
import { VoraDatabase } from "../storage/database";

export interface SubAgentTask {
  id: string;
  description: string;
  modelRef?: string;
  tools?: string[];
  context?: string;
  maxTurns?: number;
}

export interface SubAgentResult {
  id: string;
  success: boolean;
  content: string;
  tokensUsed: number;
  turns: number;
  error?: string;
}

export class SubAgentManager {
  private router: ModelRouter;
  private tools: ToolExecutor;
  private db: VoraDatabase;

  constructor() {
    this.router = new ModelRouter();
    this.db = new VoraDatabase();
    this.tools = new ToolExecutor(this.db);
  }

  /**
   * Run multiple sub-agents in parallel
   */
  async runParallel(tasks: SubAgentTask[], mainModel = "deepseek/deepseek-chat"): Promise<SubAgentResult[]> {
    const results: SubAgentResult[] = [];
    const BATCH_SIZE = 3; // Max 3 parallel agents

    for (let i = 0; i < tasks.length; i += BATCH_SIZE) {
      const batch = tasks.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map((task) => this.runSingle(task, mainModel)),
      );
      results.push(...batchResults);
    }

    return results;
  }

  /**
   * Run a single sub-agent
   */
  async runSingle(task: SubAgentTask, defaultModel: string): Promise<SubAgentResult> {
    const modelRef = task.modelRef || defaultModel;
    const maxTurns = task.maxTurns || 5;
    let turns = 0;
    let totalTokens = 0;

    const systemPrompt = `You are a VORACODE sub-agent handling a specific task.
Your task: ${task.description}

You have access to tools: ${(task.tools || ["file_read", "file_write", "bash", "think"]).join(", ")}

Focus ONLY on your assigned task. Report back concisely.`;

    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...(task.context ? [{ role: "user" as const, content: task.context }] : []),
      { role: "user" as const, content: `Execute this task: ${task.description}` },
    ];

    try {
      while (turns < maxTurns) {
        turns++;
        const response = await this.router.chat(modelRef, messages, {
          model: modelRef,
          maxTokens: 1024,
          temperature: 0.3,
          tools: this.getToolSchemas(task.tools),
          toolChoice: "auto" as const,
        });

        totalTokens += response.usage.totalTokens;

        if (response.toolCalls && response.toolCalls.length > 0) {
          messages.push({ role: "assistant", content: response.content || "", tool_calls: response.toolCalls });

          for (const tc of response.toolCalls) {
            const result = await this.tools.execute(tc.function.name, tc.function.arguments);
            const resultStr = typeof result === "string" ? result : JSON.stringify(result);
            messages.push({ role: "tool", content: resultStr.slice(0, 3000), tool_call_id: tc.id });
          }
          continue;
        }

        return { id: task.id, success: true, content: response.content, tokensUsed: totalTokens, turns };
      }

      return { id: task.id, success: true, content: "Sub-agent reached max turns.", tokensUsed: totalTokens, turns };
    } catch (error) {
      return { id: task.id, success: false, content: "", tokensUsed: totalTokens, turns, error: String(error) };
    }
  }

  private getToolSchemas(allowedTools?: string[]) {
    const all = this.tools.getToolSchemas();
    if (!allowedTools) return all;
    return all.filter((t) => allowedTools.includes(t.function.name));
  }
}
