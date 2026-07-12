/**
 * VORACODE All Providers — Every AI/LLM provider adapter
 *
 * Users can bring ANY API key and it works.
 * Includes: chat, completion, embedding providers.
 */

import type { ChatMessage, ChatOptions, ChatResponse } from "../router";

// ── Every provider we support ──

export interface ProviderConfig {
  name: string;
  protocol: "openai" | "anthropic" | "google" | "aws" | "azure" | "cohere" | "mistral" | "together" | "custom";
  baseUrl: string;
  apiKeyEnv: string[];
  models: string[];
  freeTier?: string;
  notes?: string;
}

export const ALL_PROVIDERS: ProviderConfig[] = [
  // ─── MAJOR PLATFORMS ───
  {
    name: "openai",
    protocol: "openai",
    baseUrl: "https://api.openai.com/v1",
    apiKeyEnv: ["OPENAI_API_KEY", "OPENAI_KEY"],
    models: ["gpt-4o", "gpt-4o-mini", "o3-mini", "o1", "gpt-4-turbo", "gpt-3.5-turbo"],
    notes: "OpenAI chat models",
  },
  {
    name: "anthropic",
    protocol: "anthropic",
    baseUrl: "https://api.anthropic.com/v1",
    apiKeyEnv: ["ANTHROPIC_API_KEY", "ANTHROPIC_KEY"],
    models: ["claude-sonnet-4", "claude-opus-4", "claude-haiku-4", "claude-sonnet-3.5"],
    notes: "Claude models",
  },
  {
    name: "google",
    protocol: "google",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    apiKeyEnv: ["GOOGLE_API_KEY", "GEMINI_API_KEY"],
    models: ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-1.5-pro", "gemini-1.5-flash"],
    freeTier: "60 requests/min free tier",
  },

  // ─── OPEN SOURCE PROVIDERS ───
  {
    name: "deepseek",
    protocol: "openai",
    baseUrl: "https://api.deepseek.com/v1",
    apiKeyEnv: ["DEEPSEEK_API_KEY", "DEEPSEEK_KEY"],
    models: ["deepseek-chat", "deepseek-v4-flash", "deepseek-v4-pro", "deepseek-coder"],
    freeTier: "$0.14/M input tokens",
  },
  {
    name: "groq",
    protocol: "openai",
    baseUrl: "https://api.groq.com/openai/v1",
    apiKeyEnv: ["GROQ_API_KEY", "GROQ_KEY"],
    models: ["llama-3.3-70b", "llama-3.1-8b", "mixtral-8x7b", "qwen-32b", "gemma-2-9b"],
    freeTier: "500K tokens/day free",
  },
  {
    name: "mistral",
    protocol: "openai",
    baseUrl: "https://api.mistral.ai/v1",
    apiKeyEnv: ["MISTRAL_API_KEY", "MISTRAL_KEY"],
    models: ["mistral-large", "mistral-medium", "codestral", "ministral-8b"],
    freeTier: "Free tier available",
  },
  {
    name: "together",
    protocol: "openai",
    baseUrl: "https://api.together.xyz/v1",
    apiKeyEnv: ["TOGETHER_API_KEY", "TOGETHER_KEY"],
    models: ["llama-3.3-70b", "qwen-2.5-72b", "mixtral-8x22b", "deepseek-v3"],
    notes: "200+ open-source models",
  },
  {
    name: "ollama",
    protocol: "openai",
    baseUrl: "http://localhost:11434/v1",
    apiKeyEnv: [],
    models: ["llama3.2", "mistral", "deepseek-coder-v2", "qwen2.5-coder", "phi-4", "gemma-2"],
    freeTier: "100% free, local inference",
  },

  // ─── GATEWAYS / AGGREGATORS ───
  {
    name: "openrouter",
    protocol: "openai",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKeyEnv: ["OPENROUTER_API_KEY"],
    models: ["openrouter/auto", "openai/gpt-4o", "anthropic/claude-sonnet-4"],
    freeTier: "25+ free models, 50 reqs/day",
  },
  {
    name: "huggingface",
    protocol: "openai",
    baseUrl: "https://router.huggingface.co/v1",
    apiKeyEnv: ["HF_API_KEY", "HUGGINGFACE_KEY", "HUGGING_FACE_TOKEN"],
    models: ["HuggingFaceH4/zephyr-7b-beta", "meta-llama/Llama-3.3-70B-Instruct"],
    freeTier: "Generous free tier",
  },

  // ─── CLOUD PROVIDERS ───
  {
    name: "fireworks",
    protocol: "openai",
    baseUrl: "https://api.fireworks.ai/inference/v1",
    apiKeyEnv: ["FIREWORKS_API_KEY", "FIREWORKS_KEY"],
    models: ["llama-v3p3-70b-instruct", "llama-v3p1-405b-instruct", "deepseek-v3"],
    notes: "High-speed inference",
  },
  {
    name: "cerebras",
    protocol: "openai",
    baseUrl: "https://api.cerebras.ai/v1",
    apiKeyEnv: ["CEREBRAS_API_KEY"],
    models: ["llama-3.3-70b", "llama-3.1-8b"],
    notes: "Fastest inference speed",
  },
  {
    name: "sambanova",
    protocol: "openai",
    baseUrl: "https://api.sambanova.ai/v1",
    apiKeyEnv: ["SAMBANOVA_API_KEY"],
    models: ["llama-3.3-70b", "qwen-2.5-72b"],
    notes: "SN40L chip inference",
  },
  {
    name: "cloudflare",
    protocol: "openai",
    baseUrl: "https://api.cloudflare.com/client/v4/ai",
    apiKeyEnv: ["CLOUDFLARE_API_KEY"],
    models: ["@cf/meta/llama-3.3-70b", "@hf/thebloke/llama-2-7b"],
    freeTier: "Workers AI free tier",
  },

  // ─── ENTERPRISE / CLOUD ───
  {
    name: "azure",
    protocol: "azure",
    baseUrl: "https://YOUR_RESOURCE.openai.azure.com",
    apiKeyEnv: ["AZURE_OPENAI_KEY", "AZURE_API_KEY"],
    models: ["gpt-4o", "gpt-4-turbo", "gpt-35-turbo"],
    notes: "Requires Azure endpoint URL",
  },
  {
    name: "aws",
    protocol: "aws",
    baseUrl: "https://bedrock-runtime.YOUR_REGION.amazonaws.com",
    apiKeyEnv: ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"],
    models: ["claude-sonnet-4", "llama-3.3-70b", "mistral-large"],
    notes: "Bedrock requires AWS credentials",
  },
  {
    name: "gcp",
    protocol: "google",
    baseUrl: "https://us-central1-aiplatform.googleapis.com/v1",
    apiKeyEnv: ["GCP_API_KEY", "VERTEX_API_KEY"],
    models: ["gemini-2.5-pro", "claude-sonnet-4"],
    notes: "Vertex AI endpoint",
  },

  // ─── SPECIALIZED ───
  {
    name: "cohere",
    protocol: "custom",
    baseUrl: "https://api.cohere.ai/v1",
    apiKeyEnv: ["COHERE_API_KEY"],
    models: ["command-r-plus", "command-r", "command-nightly"],
    notes: "RAG-focused models",
  },
  {
    name: "xai",
    protocol: "openai",
    baseUrl: "https://api.x.ai/v1",
    apiKeyEnv: ["XAI_API_KEY", "GROK_API_KEY"],
    models: ["grok-3", "grok-2"],
    notes: "xAI Grok models",
  },
  {
    name: "replicate",
    protocol: "openai",
    baseUrl: "https://api.replicate.com/v1",
    apiKeyEnv: ["REPLICATE_API_KEY"],
    models: ["llama-3.3-70b", "deepseek-v3", "qwen-2.5-72b"],
    notes: "Community models",
  },
  {
    name: "perplexity",
    protocol: "openai",
    baseUrl: "https://api.perplexity.ai/v1",
    apiKeyEnv: ["PERPLEXITY_API_KEY"],
    models: ["sonar-pro", "sonar-small"],
    notes: "Search-augmented models",
  },
  {
    name: "deepinfra",
    protocol: "openai",
    baseUrl: "https://api.deepinfra.com/v1/openai",
    apiKeyEnv: ["DEEPINFRA_API_KEY"],
    models: ["llama-3.3-70b", "mixtral-8x22b", "qwen-2.5-72b"],
    freeTier: "Free tier available",
  },
  {
    name: "anyscale",
    protocol: "openai",
    baseUrl: "https://api.endpoints.anyscale.com/v1",
    apiKeyEnv: ["ANYSCALE_API_KEY"],
    models: ["llama-3.3-70b", "mixtral-8x7b"],
  },
  {
    name: "lepton",
    protocol: "openai",
    baseUrl: "https://llama3-3-70b.lepton.run/api/v1",
    apiKeyEnv: ["LEPTON_API_KEY"],
    models: ["llama-3.3-70b", "qwen-2.5-72b"],
  },
  {
    name: "nvidia",
    protocol: "openai",
    baseUrl: "https://integrate.api.nvidia.com/v1",
    apiKeyEnv: ["NVIDIA_API_KEY"],
    models: ["nvidia/nemotron-3-ultra-550b", "nvidia/nemotron-3-super-120b"],
    freeTier: "Free trial, rate limited",
  },
  {
    name: "github",
    protocol: "openai",
    baseUrl: "https://models.inference.ai.azure.com",
    apiKeyEnv: ["GITHUB_TOKEN"],
    models: ["gpt-4o", "gpt-4o-mini", "phi-4"],
    freeTier: "Free via GitHub Models",
  },
];

/**
 * Built-in MCP Servers — 35 production-ready MCP servers
 */
export const BUILTIN_MCP_SERVERS = [
  // ─── FILE SYSTEM ───
  { name: "filesystem", transport: "stdio" as const, command: "npx", args: ["-y", "@modelcontextprotocol/server-filesystem", "."], description: "File system operations" },
  { name: "git", transport: "stdio" as const, command: "uvx", args: ["mcp-server-git", "--repository", "."], description: "Git operations" },
  { name: "memory", transport: "stdio" as const, command: "npx", args: ["-y", "@modelcontextprotocol/server-memory"], description: "Knowledge graph memory" },
  { name: "fetch", transport: "stdio" as const, command: "npx", args: ["-y", "@modelcontextprotocol/server-fetch"], description: "Web content fetching" },
  { name: "sequential-thinking", transport: "stdio" as const, command: "npx", args: ["-y", "@modelcontextprotocol/server-sequential-thinking"], description: "Step-by-step reasoning" },
  { name: "time", transport: "stdio" as const, command: "npx", args: ["-y", "@modelcontextprotocol/server-time"], description: "Time and timezone" },

  // ─── DATABASES ───
  { name: "postgres", transport: "stdio" as const, command: "npx", args: ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"], description: "PostgreSQL read-only access" },
  { name: "sqlite", transport: "stdio" as const, command: "uvx", args: ["mcp-server-sqlite", "--db", "./data.db"], description: "SQLite database" },
  { name: "redis", transport: "stdio" as const, command: "npx", args: ["-y", "@modelcontextprotocol/server-redis"], description: "Redis key-value store" },
  { name: "supabase", transport: "http" as const, url: "https://mcp.supabase.com/v1", description: "Supabase database access" },

  // ─── VERSION CONTROL ───
  { name: "github", transport: "http" as const, url: "https://api.githubcopilot.com/mcp/", description: "GitHub API access" },
  { name: "gitlab", transport: "http" as const, url: "https://mcp.gitlab.com/v1", description: "GitLab API access" },

  // ─── PROJECT MANAGEMENT ───
  { name: "linear", transport: "http" as const, url: "https://mcp.linear.app/v1", description: "Linear issue tracking" },
  { name: "jira", transport: "http" as const, url: "https://mcp.atlassian.com/jira/v1", description: "JIRA project management" },
  { name: "asana", transport: "http" as const, url: "https://mcp.asana.com/v1", description: "Asana task management" },
  { name: "notion", transport: "http" as const, url: "https://mcp.notion.com/v1", description: "Notion workspace access" },

  // ─── COMMUNICATION ───
  { name: "slack", transport: "http" as const, url: "https://mcp.slack.com/v1", description: "Slack messaging" },
  { name: "discord", transport: "http" as const, url: "https://mcp.discord.com/v1", description: "Discord messaging" },
  { name: "telegram", transport: "http" as const, url: "https://mcp.telegram.org/v1", description: "Telegram messaging" },

  // ─── MONITORING ───
  { name: "sentry", transport: "http" as const, url: "https://mcp.sentry.dev/mcp", description: "Error monitoring" },
  { name: "datadog", transport: "http" as const, url: "https://mcp.datadoghq.com/v1", description: "Datadog monitoring" },
  { name: "grafana", transport: "http" as const, url: "https://mcp.grafana.com/v1", description: "Grafana dashboards" },

  // ─── SEARCH ───
  { name: "brave-search", transport: "stdio" as const, command: "npx", args: ["-y", "@anthropic-ai/mcp-server-brave-search"], description: "Web search via Brave" },
  { name: "exa-search", transport: "http" as const, url: "https://mcp.exa.ai/v1", description: "AI-powered search" },

  // ─── CLOUD INFRA ───
  { name: "aws-s3", transport: "stdio" as const, command: "npx", args: ["-y", "@anthropic-ai/mcp-server-aws-s3"], description: "AWS S3 file operations" },
  { name: "cloudflare", transport: "http" as const, url: "https://mcp.cloudflare.com/v1", description: "Cloudflare API" },
  { name: "vercel", transport: "http" as const, url: "https://mcp.vercel.com/v1", description: "Vercel deployment" },

  // ─── AI / MACHINE LEARNING ───
  { name: "huggingface", transport: "http" as const, url: "https://mcp.huggingface.co/v1", description: "HuggingFace models" },
  { name: "modal", transport: "http" as const, url: "https://mcp.modal.com/v1", description: "Modal serverless compute" },
  { name: "replicate", transport: "http" as const, url: "https://mcp.replicate.com/v1", description: "Replicate model inference" },

  // ─── BROWSER / TESTING ───
  { name: "puppeteer", transport: "stdio" as const, command: "npx", args: ["-y", "@modelcontextprotocol/server-puppeteer"], description: "Browser automation" },
  { name: "playwright", transport: "stdio" as const, command: "npx", args: ["-y", "@anthropic-ai/mcp-server-playwright"], description: "End-to-end testing" },
  { name: "browserbase", transport: "http" as const, url: "https://mcp.browserbase.com/v1", description: "Cloud browser access" },

  // ─── PAYMENTS / FINANCE ───
  { name: "stripe", transport: "http" as const, url: "https://mcp.stripe.com/v1", description: "Stripe payment processing" },
  { name: "plaid", transport: "http" as const, url: "https://mcp.plaid.com/v1", description: "Financial data access" },
];
