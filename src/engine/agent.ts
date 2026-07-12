/**
 * VORACODE Agent — Main agent loop
 *
 * The core intelligence: plan → execute → reflect loop.
 * Each turn processes user input through the model router
 * and executes tool calls until the task is complete.
 */

import { ModelRouter, type ChatMessage } from "../models/router";
import { VoraDatabase } from "../storage/database";
import { ToolExecutor } from "../tools/executor";

export interface AgentContext {
  sessionId: string;
  projectPath: string;
  modelProvider: string;
  modelName: string;
}

export interface AgentResult {
  success: boolean;
  content: string;
  sessionId: string;
  tokensUsed: number;
  turns: number;
  error?: string;
}

export class Agent {
  private router: ModelRouter;
  private db: VoraDatabase;
  private tools: ToolExecutor;
  private systemPrompt: string;

  constructor() {
    this.router = new ModelRouter();
    this.db = new VoraDatabase();
    this.tools = new ToolExecutor(this.db);
    this.systemPrompt = this.buildSystemPrompt();
  }

  private buildSystemPrompt(): string {
    return `You are VORACODE, an AI engineering partner that lives in the terminal.

You help users with coding tasks by:
1. Understanding their codebase
2. Planning changes before executing
3. Writing clean, correct code
4. Running commands safely
5. Committing changes with clear messages

RULES:
- You MUST NOT execute dangerous commands (rm -rf /, sudo, etc.)
- You MUST NOT output API keys or secrets
- You MUST show diffs before making changes
- You MUST ask for confirmation before destructive operations
- You MUST explain your reasoning before acting

Available tools:
- file_read: Read file contents
- file_write: Write content to file
- file_edit: Edit a file with diff
- bash: Execute a shell command (sandboxed)
- git_status: Check git status
- git_diff: Show git diff
- git_commit: Commit changes
- code_search: Search codebase for patterns
- web_fetch: Fetch URL content
- think: Reason through a problem step by step

Always start by understanding the task, then plan, then execute step by step.`;
  }

  /**
   * Run a single turn of the agent loop
   */
  async runTurn(sessionId: string, userMessage: string, modelRef: string): Promise<AgentResult> {
    const startTime = Date.now();
    let turns = 0;
    let totalTokens = 0;
    const maxTurns = 25;
    const messages: ChatMessage[] = [
      { role: "system", content: this.systemPrompt },
      { role: "user", content: userMessage },
    ];

    try {
      // Main agent loop
      while (turns < maxTurns) {
        turns++;

        // Get model response
        const response = await this.router.chat(modelRef, messages);

        totalTokens += response.usage.totalTokens;

        // Store messages
        const userMsgId = this.db.addMessage(sessionId, "user", userMessage);
        const asstMsgId = this.db.addMessage(sessionId, "assistant", response.content, response.usage.totalTokens);

        // Record API call in stats
        this.db.recordApiCall(response.usage.inputTokens, response.usage.outputTokens);

        // Check for tool calls
        if (response.toolCalls && response.toolCalls.length > 0) {
          for (const toolCall of response.toolCalls) {
            const result = await this.tools.execute(toolCall.function.name, toolCall.function.arguments);
            messages.push({
              role: "assistant",
              content: "",
              tool_calls: [toolCall],
            });
            messages.push({
              role: "tool",
              content: typeof result === "string" ? result : JSON.stringify(result),
              tool_call_id: toolCall.id,
            });
          }
          continue; // Continue loop for tool results
        }

        // Check if task is complete (tool use finished or explicit completion)
        if (response.content.includes("TASK COMPLETE") || turns >= maxTurns - 1) {
          this.db.updateSession(sessionId, {
            total_tokens: totalTokens,
            total_turns: turns,
            status: "completed",
          });

          const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
          return {
            success: true,
            content: response.content,
            sessionId,
            tokensUsed: totalTokens,
            turns,
          };
        }

        // Normal response — task is complete
        this.db.updateSession(sessionId, {
          total_tokens: totalTokens,
          total_turns: turns,
          status: "completed",
        });

        return {
          success: true,
          content: response.content,
          sessionId,
          tokensUsed: totalTokens,
          turns,
        };
      }

      // Max turns reached
      return {
        success: true,
        content: "Task reached maximum turns. You can continue with more instructions.",
        sessionId,
        tokensUsed: totalTokens,
        turns,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);

      this.db.logAudit("agent_error", errorMsg, false);
      this.db.updateSession(sessionId, { status: "error" });

      return {
        success: false,
        content: "",
        sessionId,
        tokensUsed: totalTokens,
        turns,
        error: errorMsg,
      };
    }
  }
}
