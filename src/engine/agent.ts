/**
 * VORACODE Agent — Tool-calling agent loop
 *
 * The core intelligence: model suggests tool calls → tools execute →
 * results fed back → model continues → repeat until done.
 *
 * Uses OpenAI function calling to give the model real tool access.
 */

import { ModelRouter, type ChatMessage, type ChatOptions } from "../models/router";
import { VoraDatabase } from "../storage/database";
import { ToolExecutor } from "../tools/executor";

export interface AgentResult {
  success: boolean;
  content: string;
  sessionId: string;
  tokensUsed: number;
  turns: number;
  steps: number;
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

You help users with coding tasks. You have access to real tools that let you read, write, and execute code.

## How you work
1. Understand what the user wants
2. Use tools to explore the project when needed
3. Plan the changes
4. Execute step by step using the tools available to you
5. Tell the user when you're done

## Rules
- NEVER execute dangerous commands (rm -rf /, sudo, mkfs, dd, fork bombs)
- NEVER output API keys, passwords, or secrets
- Show what you're doing before doing it
- Ask the user before destructive operations
- Use the think tool to reason through complex problems before acting
- When the task is complete, summarize what you did

## Available Tools
You have file_read, file_write, file_edit, bash, git_status, git_diff, git_commit,
code_search, web_fetch, think, and list_files at your disposal.
Use them to accomplish the task. Do NOT just describe what to do — USE the tools.

When the task is complete, summarize what was done.`;
  }

  /**
   * Run the agent loop with full tool-calling
   */
  async runTurn(sessionId: string, userMessage: string, modelRef: string, options?: { maxTurns?: number }): Promise<AgentResult> {
    const startTime = Date.now();
    const maxTurns = options?.maxTurns || 25;
    let totalTokens = 0;
    let turns = 0;
    let steps = 0;

    // Get tool schemas to send with each API call
    const toolSchemas = this.tools.getToolSchemas();

    // Build message history
    const messages: ChatMessage[] = [
      { role: "system", content: this.systemPrompt },
      { role: "user", content: userMessage },
    ];

    // Store the initial user message
    this.db.addMessage(sessionId, "user", userMessage);

    try {
      while (turns < maxTurns) {
        turns++;

        const chatOptions: ChatOptions = {
          model: modelRef,
          maxTokens: 2048,
          temperature: 0.3,
          tools: toolSchemas,
          toolChoice: "auto",
        };

        // Call the model
        const response = await this.router.chat(modelRef, messages, chatOptions);
        totalTokens += response.usage.totalTokens;
        this.db.recordApiCall(response.usage.inputTokens, response.usage.outputTokens);

        // Store assistant response
        if (response.content) {
          this.db.addMessage(sessionId, "assistant", response.content, response.usage.totalTokens);
        }

        // CASE 1: Model wants to use tools
        if (response.toolCalls && response.toolCalls.length > 0) {
          // Add the assistant message with tool_calls to history
          messages.push({
            role: "assistant",
            content: response.content || "",
            tool_calls: response.toolCalls,
          });

          // Execute each tool call
          for (const toolCall of response.toolCalls) {
            steps++;

            let result: unknown;
            let error = false;

            try {
              result = await this.tools.execute(toolCall.function.name, toolCall.function.arguments);
            } catch (e) {
              result = `Error: ${e instanceof Error ? e.message : String(e)}`;
              error = true;
            }

            const resultStr = typeof result === "string" ? result : JSON.stringify(result, null, 2);

            // Truncate very long results
            const truncated = resultStr.length > 5000 ? resultStr.slice(0, 5000) + "\n... (truncated)" : resultStr;

            // Audit log
            this.db.logAudit(
              error ? "tool_error" : "tool_execute",
              JSON.stringify({ tool: toolCall.function.name }),
              !error,
            );

            // Add tool result to conversation history
            messages.push({
              role: "tool",
              content: truncated,
              tool_call_id: toolCall.id,
            });
          }

          // Continue the loop — model will see tool results and decide next step
          continue;
        }

        // CASE 2: Model responded with text (no tool calls) — task is complete
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
          steps,
        };
      }

      // MAX TURNS REACHED
      this.db.updateSession(sessionId, {
        total_tokens: totalTokens,
        total_turns: turns,
        status: "completed",
      });

      return {
        success: true,
        content: "Task reached maximum turns. You can continue with more instructions.",
        sessionId,
        tokensUsed: totalTokens,
        turns,
        steps,
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
        steps,
        error: errorMsg,
      };
    }
  }
}
