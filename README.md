<div align="center">

![VORACODE Logo](assets/logo-lockup-dark.svg)

### **V O R A C O D E**

*Terminal-native AI coding agent for fast, private, BYOK development.*

</div>

---

## What is VORACODE?

VORACODE is a terminal-native AI coding agent that helps you plan, build, debug, and manage git workflows — all from one place. It supports BYOK (Bring Your Own Key), local models, zero telemetry by default, and 75+ AI providers.

---

## Features

- **Terminal-first workflow** — Code in your terminal, not your browser
- **75+ AI providers** — OpenAI, Anthropic, DeepSeek, Groq, Ollama, and more
- **Zero telemetry** — No data collected, no tracking, fully private
- **Local models** — 100% offline capable via Ollama
- **BYOK** — Use your own API keys, no vendor lock-in
- **Self-improving** — Learns from your patterns over time
- **MCP support** — Connect to external tools via Model Context Protocol
- **Security** — 7-layer defense with command sandbox and key vault
- **Cross-platform** — macOS, Linux, Windows

---

## Quick Start

```bash
# Install
npm install -g voracode

# Initialize your project
voracode init

# Run your first task
voracode run "create a login page with React and Tailwind"
```

That's it. VORACODE handles planning, file creation, and command execution.

---

## Installation

```bash
# npm
npm install -g voracode

# Bun (recommended)
bun install -g voracode

# Homebrew (macOS/Linux)
brew install voracode

# Windows
scoop install voracode

# One-liner
curl -fsSL https://voracode.dev/install | bash
```

---

## API Key Setup

VORACODE is **BYOK** — you provide the API key, we provide the tool.

```bash
voracode key set openai sk-xxxxxxxxxxxx
voracode key set deepseek sk-xxxxxxxxxxxx
voracode key set openrouter sk-or-v1-xxxxxxxxxxxx
```

Or use environment variables:

```bash
export DEEPSEEK_API_KEY=sk-xxxxxxxxxxxx
export GROQ_API_KEY=gsk_xxxxxxxxxxxx
```

### Supported Providers

| Provider | Free Tier | Protocol |
|----------|-----------|----------|
| OpenAI | — | OpenAI-compatible |
| Anthropic | — | Anthropic Messages |
| Google Gemini | 60 req/min | Google AI |
| DeepSeek | $0.14/M tokens | OpenAI-compatible |
| Groq | 500K tokens/day | OpenAI-compatible |
| Ollama (Local) | Unlimited | OpenAI-compatible |
| OpenRouter | 25+ free models | OpenAI-compatible |
| HuggingFace | Generous free tier | OpenAI-compatible |

---

## Usage

### Run a task

```bash
voracode run "create a REST API with Express"
voracode run "fix the bug in auth.ts" -m anthropic/claude-sonnet-4
voracode run "add tests for user model" --session abc123 --fork
voracode run "explain this codebase" --dry-run
```

### Manage sessions

```bash
voracode session list
voracode session resume <id>
voracode session export <id> output.json
```

### Manage models

```bash
voracode model list
voracode model set deepseek/deepseek-chat
voracode model test groq
```

### Manage skills

```bash
voracode skill list
voracode skill create express-helper
voracode skill patterns
```

### Connect external tools (MCP)

```bash
voracode mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem .
voracode mcp add github --transport http --url https://api.githubcopilot.com/mcp/
voracode mcp list
```

### Security audit

```bash
voracode audit .
voracode audit src/ --level high --output json
```

---

## Configuration

### Global: `~/.config/voracode/config.json`

```json
{
  "model": { "provider": "auto", "fallback": ["deepseek", "groq"] },
  "context": { "maxTokens": 128000, "compression": "auto" },
  "security": { "sandbox": { "enabled": true, "timeout": 30000 } },
  "telemetry": { "enabled": false }
}
```

### Project: `.voracode/config.json`

Same format — overrides global config for current project.

### Environment Variables

| Variable | Provider |
|----------|----------|
| `OPENAI_API_KEY` | OpenAI |
| `ANTHROPIC_API_KEY` | Anthropic |
| `DEEPSEEK_API_KEY` | DeepSeek |
| `GROQ_API_KEY` | Groq |
| `GOOGLE_API_KEY` | Google Gemini |
| `OPENROUTER_API_KEY` | OpenRouter |

---

## Security

- **OS Keychain** — API keys encrypted at rest, never plain text
- **Command sandbox** — Dangerous commands blocked automatically
- **Network egress** — Domain allowlist for outbound requests
- **Zero telemetry** — No data collected, no tracking
- **Audit log** — All actions logged locally
- **Key protection** — Keys never in logs, crash reports, or generated code

---

## Self-Improvement

VORACODE learns from your patterns to become smarter:

1. You perform similar tasks → VORACODE detects patterns
2. After 3+ similar tasks → suggests creating a reusable skill
3. You confirm → skill is created and saves time on future tasks

All learning is **local** — stored in `~/.local/share/voracode/`, zero data sent anywhere.

---

## Development

```bash
git clone https://github.com/mysterious75/voracode.git
cd voracode
bun install
bun run dev
```

| Command | Description |
|---------|-------------|
| `bun run dev` | Development mode |
| `bun run build:all` | Build for all platforms |
| `bun run test` | Run tests |
| `bun run lint` | Lint code |

---

## Roadmap

- [ ] Desktop app (TUI with agent panel)
- [ ] Cloud agents (serverless background tasks)
- [ ] Team collaboration features
- [ ] Marketplace for community skills
- [ ] Automated PR review bot
- [ ] IDE extensions (VS Code, JetBrains)

---

## Contributing

Contributions welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## License

MIT — See [LICENSE](LICENSE)

---

<div align="center">

**[GitHub](https://github.com/mysterious75/voracode)** · **[npm](https://npmjs.com/package/voracode)** · **[Issues](https://github.com/mysterious75/voracode/issues)**

</div>
