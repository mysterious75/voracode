/**
 * VORACODE Model Router — Universal AI provider adapter
 *
 * Supports any AI provider through a unified interface.
 *
 * Provider protocols supported:
 * - OpenAI-compatible (DeepSeek, Groq, Together, Ollama, OpenRouter, etc.)
 * - Anthropic Messages API (Claude)
 * - Google AI API (Gemini)
 * - Custom (user-defined)
 *
 * BYOK ONLY — user must provide their own API key.
 * VORACODE does not provide free managed models.
 */

export interface ChatMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  name?: string;
  tool_calls?: Array<{
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }>;
  tool_call_id?: string;
}

export interface ChatOptions {
  model: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  stream?: boolean;
}

export interface ChatResponse {
  content: string;
  model: string;
  provider: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  toolCalls?: Array<{
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }>;
}

interface ProviderConfig {
  apiKey?: string;
  baseUrl: string;
}

const PROVIDER_BASE_URLS: Record<string, string> = {
  openai: "https://api.openai.com/v1",
  deepseek: "https://api.deepseek.com/v1",
  groq: "https://api.groq.com/openai/v1",
  together: "https://api.together.xyz/v1",
  openrouter: "https://openrouter.ai/api/v1",
  ollama: "http://localhost:11434/v1",
  huggingface: "https://router.huggingface.co/v1",
  fireworks: "https://api.fireworks.ai/inference/v1",
  cerebras: "https://api.cerebras.ai/v1",
  anthropic: "https://api.anthropic.com/v1",
  google: "https://generativelanguage.googleapis.com/v1beta",
};

const PROVIDER_KEY_PATTERNS: Record<string, RegExp> = {
  openai: /^(sk-|sx-)/,
  anthropic: /^sk-ant-/,
  deepseek: /^sk-/,
  groq: /^gsk_/,
};

export class ModelRouter {
  private keychain: Map<string, string> = new Map();

  constructor() {
    // Keys will be loaded from OS Keychain in Phase 1.3
    // For now, use environment variables
    this.loadFromEnv();
  }

  private loadFromEnv(): void {
    const envMap: Record<string, string | undefined> = {
      openai: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY,
      anthropic: process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_KEY,
      deepseek: process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_KEY,
      groq: process.env.GROQ_API_KEY || process.env.GROQ_KEY,
      google: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY,
      openrouter: process.env.OPENROUTER_API_KEY,
      huggingface: process.env.HF_API_KEY || process.env.HUGGINGFACE_KEY,
      together: process.env.TOGETHER_API_KEY,
      ollama: "", // No key needed for local
    };

    for (const [provider, key] of Object.entries(envMap)) {
      if (key) {
        this.keychain.set(provider, key);
      }
    }
  }

  /**
   * Get the active API key for a provider
   */
  getKey(provider: string): string | undefined {
    return this.keychain.get(provider);
  }

  /**
   * Set an API key for a provider
   */
  setKey(provider: string, key: string): void {
    this.keychain.set(provider, key);
  }

  /**
   * Check if a provider has a valid-looking API key configured
   */
  hasValidKey(provider: string): boolean {
    const key = this.keychain.get(provider);
    if (!key) return false;

    const pattern = PROVIDER_KEY_PATTERNS[provider];
    if (pattern) return pattern.test(key);
    return key.length > 8;
  }

  /**
   * Detect provider from model name
   */
  detectProvider(modelName: string): string {
    const normalized = modelName.toLowerCase();

    if (normalized.startsWith("gpt-") || normalized.startsWith("o3") || normalized.startsWith("o1")) return "openai";
    if (normalized.startsWith("claude-") || normalized.startsWith("opus") || normalized.startsWith("sonnet") || normalized.startsWith("haiku")) return "anthropic";
    if (normalized.startsWith("gemini-")) return "google";
    if (normalized.startsWith("deepseek-")) return "deepseek";
    if (normalized.startsWith("llama-") || normalized.startsWith("mixtral") || normalized.startsWith("qwen-")) return "groq";
    if (normalized.startsWith("command-")) return "cohere";

    return "openai"; // default fallback
  }

  /**
   * Get available models for a provider
   */
  getModels(provider: string): string[] {
    const modelMap: Record<string, string[]> = {
      openai: ["gpt-4o", "gpt-4o-mini", "o3-mini", "o1"],
      anthropic: ["claude-sonnet-4", "claude-opus-4", "claude-haiku-4"],
      deepseek: ["deepseek-chat", "deepseek-v4-flash", "deepseek-v4-pro"],
      groq: ["llama-3.1-8b", "llama-3.1-70b", "qwen-32b", "mixtral-8x7b"],
      google: ["gemini-2.5-pro", "gemini-2.5-flash"],
      ollama: ["llama3.2", "mistral", "deepseek-coder-v2", "qwen2.5-coder"],
      openrouter: ["openrouter/auto"],
      huggingface: ["HuggingFaceH4/zephyr-7b-beta"],
    };
    return modelMap[provider] || [];
  }

  /**
   * Get provider base URL
   */
  getBaseUrl(provider: string): string {
    return PROVIDER_BASE_URLS[provider] || "";
  }

  /**
   * Chat completion using OpenAI-compatible API
   * Covers: DeepSeek, Groq, Together, Ollama, OpenRouter, HuggingFace
   */
  async chatOpenAI(provider: string, messages: ChatMessage[], options: ChatOptions): Promise<ChatResponse> {
    const baseUrl = this.getBaseUrl(provider);
    const apiKey = this.keychain.get(provider);

    if (!apiKey && provider !== "ollama") {
      throw new Error(`No API key configured for ${provider}. Run: voracode key set ${provider}`);
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: apiKey ? `Bearer ${apiKey}` : "",
      },
      body: JSON.stringify({
        model: options.model,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
          ...(m.name ? { name: m.name } : {}),
        })),
        max_tokens: options.maxTokens || 4096,
        temperature: options.temperature ?? 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(`${provider} API error (${response.status}): ${errorBody}`);
    }

    const data = await response.json() as {
      choices: Array<{ message: { content: string; tool_calls?: Array<{ id: string; type: "function"; function: { name: string; arguments: string } }> } }>;
      usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
      model: string;
    };

    return {
      content: data.choices[0]?.message?.content || "",
      model: data.model,
      provider,
      usage: {
        inputTokens: data.usage?.prompt_tokens || 0,
        outputTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
      toolCalls: data.choices[0]?.message?.tool_calls,
    };
  }

  /**
   * Chat completion using Anthropic Messages API
   */
  async chatAnthropic(messages: ChatMessage[], options: ChatOptions): Promise<ChatResponse> {
    const apiKey = this.keychain.get("anthropic");
    if (!apiKey) throw new Error("No API key configured for Anthropic. Run: voracode key set anthropic");

    // Convert messages to Anthropic format
    const systemMsg = messages.find((m) => m.role === "system");
    const nonSystem = messages.filter((m) => m.role !== "system");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: options.model,
        messages: nonSystem.map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
        system: systemMsg?.content,
        max_tokens: options.maxTokens || 4096,
        temperature: options.temperature ?? 0.7,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(`Anthropic API error (${response.status}): ${errorBody}`);
    }

    const data = await response.json() as {
      content: Array<{ text: string }>;
      model: string;
      usage: { input_tokens: number; output_tokens: number };
    };

    return {
      content: data.content?.[0]?.text || "",
      model: data.model,
      provider: "anthropic",
      usage: {
        inputTokens: data.usage?.input_tokens || 0,
        outputTokens: data.usage?.output_tokens || 0,
        totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      },
    };
  }

  /**
   * Main chat method — auto-selects correct adapter based on model name
   */
  async chat(modelRef: string, messages: ChatMessage[], options: ChatOptions = {}): Promise<ChatResponse> {
    const provider = modelRef.includes("/") ? modelRef.split("/")[0] : this.detectProvider(modelRef);
    const modelName = modelRef.includes("/") ? modelRef.split("/")[1] : modelRef;

    const fullOptions = { ...options, model: modelName };

    try {
      switch (provider) {
        case "anthropic":
          return await this.chatAnthropic(messages, fullOptions);
        case "google":
          return await this.chatGoogle(messages, fullOptions);
        default:
          return await this.chatOpenAI(provider, messages, fullOptions);
      }
    } catch (error) {
      // Auto-fallback: try next provider
      const fallbacks = ["deepseek", "groq", "openrouter"];
      for (const fb of fallbacks) {
        if (fb === provider) continue;
        const fbKey = this.keychain.get(fb);
        if (fbKey) {
          try {
            return await this.chatOpenAI(fb, messages, { ...fullOptions, model: this.getModels(fb)[0] || fb });
          } catch {
            continue; // Try next fallback
          }
        }
      }
      throw error; // All fallbacks exhausted
    }
  }

  /**
   * Chat completion using Google AI API
   */
  async chatGoogle(messages: ChatMessage[], _options: ChatOptions): Promise<ChatResponse> {
    const apiKey = this.keychain.get("google");
    if (!apiKey) throw new Error("No API key configured for Google. Run: voracode key set google");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${_options.model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: messages
            .filter((m) => m.role !== "system")
            .map((m) => ({
              role: m.role === "assistant" ? "model" : "user",
              parts: [{ text: m.content }],
            })),
          systemInstruction: messages.find((m) => m.role === "system")?.content
            ? { parts: [{ text: messages.find((m) => m.role === "system")!.content }] }
            : undefined,
          generationConfig: {
            maxOutputTokens: _options.maxTokens || 4096,
            temperature: _options.temperature ?? 0.7,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(`Google API error (${response.status}): ${errorBody}`);
    }

    const data = await response.json() as {
      candidates: Array<{ content: { parts: Array<{ text: string }> } }>;
      usageMetadata?: { promptTokenCount: number; candidatesTokenCount: number; totalTokenCount: number };
    };

    return {
      content: data.candidates?.[0]?.content?.parts?.[0]?.text || "",
      model: _options.model,
      provider: "google",
      usage: {
        inputTokens: data.usageMetadata?.promptTokenCount || 0,
        outputTokens: data.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata?.totalTokenCount || 0,
      },
    };
  }
}
