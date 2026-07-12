/**
 * VORACODE Config — Configuration loader and manager
 *
 * Config loaded from (in priority order):
 * 1. CLI flags (highest)
 * 2. .voracode/config.json (project-level)
 * 3. ~/.config/voracode/config.json (global, lowest)
 */

import { existsSync, readFileSync, mkdirSync, writeFileSync } from "fs";
import { join, resolve } from "path";
import { homedir } from "os";

export interface VoraConfig {
  version: string;
  project?: {
    name: string;
    path: string;
  };
  model: {
    provider: string;
    name: string;
    fallback: string[];
  };
  context: {
    maxTokens: number;
    compression: "auto" | "off" | "aggressive";
    smartLoading: boolean;
    cacheEnabled: boolean;
  };
  security: {
    sandbox: {
      enabled: boolean;
      timeout: number;
      maxOutput: number;
    };
    network: {
      blocked: boolean;
      allowedDomains: string[];
    };
    rateLimit: {
      callsPerMinute: number;
      tokensPerHour: number;
    };
    auditLog: {
      enabled: boolean;
      retentionDays: number;
    };
  };
  skills: {
    dirs: string[];
    autoLearn: boolean;
  };
  plugins: string[];
  telemetry: {
    enabled: boolean;
    localOnly: boolean;
  };
}

const DEFAULT_CONFIG: VoraConfig = {
  version: "1.0",
  model: {
    provider: "auto",
    name: "auto",
    fallback: ["deepseek", "groq"],
  },
  context: {
    maxTokens: 128_000,
    compression: "auto",
    smartLoading: true,
    cacheEnabled: true,
  },
  security: {
    sandbox: {
      enabled: true,
      timeout: 30_000,
      maxOutput: 1_048_576,
    },
    network: {
      blocked: false,
      allowedDomains: [
        "api.openai.com",
        "api.anthropic.com",
        "api.deepseek.com",
        "api.groq.com",
        "api.openrouter.ai",
        "api.github.com",
        "api.huggingface.co",
        "router.huggingface.co",
      ],
    },
    rateLimit: {
      callsPerMinute: 10,
      tokensPerHour: 1_000_000,
    },
    auditLog: {
      enabled: true,
      retentionDays: 30,
    },
  },
  skills: {
    dirs: [
      "~/.config/voracode/skills",
      ".voracode/skills",
    ],
    autoLearn: false,
  },
  plugins: [],
  telemetry: {
    enabled: false,
    localOnly: true,
  },
};

export class ConfigManager {
  private config: VoraConfig;
  private globalPath: string;

  constructor() {
    this.globalPath = join(homedir(), ".config", "voracode", "config.json");
    this.config = this.load();
  }

  private load(): VoraConfig {
    // Start with defaults
    const base = { ...DEFAULT_CONFIG };

    // Load global config
    const globalPath = join(homedir(), ".config", "voracode", "config.json");
    if (existsSync(globalPath)) {
      try {
        const global = JSON.parse(readFileSync(globalPath, "utf-8"));
        Object.assign(base, global);
      } catch {
        // Ignore invalid global config
      }
    }

    // Load project config (cwd + .voracode)
    const projectPath = join(process.cwd(), ".voracode", "config.json");
    if (existsSync(projectPath)) {
      try {
        const project = JSON.parse(readFileSync(projectPath, "utf-8"));
        Object.assign(base, project);
      } catch {
        // Ignore invalid project config
      }
    }

    return base;
  }

  get(): VoraConfig {
    return { ...this.config };
  }

  getGlobalPath(): string {
    return this.globalPath;
  }

  ensureDefaults(): void {
    const dir = join(homedir(), ".config", "voracode");
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    if (!existsSync(this.globalPath)) {
      writeFileSync(this.globalPath, JSON.stringify(DEFAULT_CONFIG, null, 2));
    }
  }

  set(key: string, value: unknown): void {
    // Simple dot-path setter (e.g., "model.provider" = "deepseek")
    const keys = key.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let target: any = this.config;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in target)) target[keys[i]] = {};
      target = target[keys[i]];
    }
    target[keys[keys.length - 1]] = value;

    // Persist
    writeFileSync(this.globalPath, JSON.stringify(this.config, null, 2));
  }

  getProviderBaseUrl(provider: string): string {
    const urls: Record<string, string> = {
      openai: "https://api.openai.com/v1",
      deepseek: "https://api.deepseek.com/v1",
      groq: "https://api.groq.com/openai/v1",
      together: "https://api.together.xyz/v1",
      openrouter: "https://openrouter.ai/api/v1",
      ollama: "http://localhost:11434/v1",
      huggingface: "https://router.huggingface.co/v1",
      fireworks: "https://api.fireworks.ai/inference/v1",
      cerebras: "https://api.cerebras.ai/v1",
      sambanova: "https://api.sambanova.ai/v1",
      cloudflare: "https://api.cloudflare.com/client/v4/ai",
    };
    return urls[provider] || "";
  }

  detectProvider(modelName: string): string {
    if (modelName.startsWith("gpt-") || modelName.startsWith("o3") || modelName.startsWith("o1")) return "openai";
    if (modelName.startsWith("claude-") || modelName.startsWith("opus") || modelName.startsWith("sonnet")) return "anthropic";
    if (modelName.startsWith("gemini-")) return "google";
    if (modelName.startsWith("deepseek-")) return "deepseek";
    if (modelName.startsWith("llama-") || modelName.startsWith("mixtral") || modelName.startsWith("qwen")) return "groq";
    if (modelName.startsWith("command-")) return "cohere";
    return "openai"; // default
  }
}
