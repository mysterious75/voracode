<p align="center">
  <picture>
    <source media="(prefers-color-scheme: light)" srcset="assets/logo-lockup-light.svg">
    <img src="assets/logo-lockup-dark.svg" alt="VORACODE" width="420">
  </picture>
  <br>
  <em>Terminal-native AI coding agent — fast, private, BYOK.</em>
</p>

---

## Quick Start

```bash
npm install -g voracode
voracode init
voracode run "create a login page with React and Tailwind"
```

---

## Features

- **75+ AI providers** — OpenAI, Anthropic, DeepSeek, Groq, Ollama, and more
- **Zero telemetry** — No data collected, fully private
- **Local models** — 100% offline via Ollama
- **BYOK** — Use your own API keys, no vendor lock-in
- **Self-improving** — Learns from your patterns over time
- **MCP support** — Connect external tools via Model Context Protocol
- **Security** — 7-layer defense with command sandbox + key vault
- **Cross-platform** — macOS, Linux, Windows

---

## Installation

```bash
npm install -g voracode                              # npm
bun install -g voracode                               # Bun (recommended)
brew install voracode                                 # macOS/Linux
scoop install voracode                                # Windows
curl -fsSL https://voracode.dev/install | bash        # One-liner
```

---

## API Key Setup

VORACODE is **BYOK** — you bring the key, we provide the tool.

```bash
voracode key set openai sk-xxxxxxxxxxxx
voracode key set deepseek sk-xxxxxxxxxxxx
voracode key set openrouter sk-or-v1-xxxxxxxxxxxx
```

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

```bash
voracode run "create a REST API with Express"
voracode run "fix the bug in auth.ts" -m anthropic/claude-sonnet-4
voracode run "add tests" --session abc123 --fork
voracode run "explain this codebase" --dry-run
```

```bash
voracode session list          # Manage sessions
voracode model list            # View providers
voracode skill list            # View skills
voracode mcp list              # View MCP servers
voracode audit .               # Security audit
voracode doctor                # Health check
```

---

## Configuration

```json
// ~/.config/voracode/config.json
{
  "model": { "provider": "auto", "fallback": ["deepseek", "groq"] },
  "context": { "maxTokens": 128000, "compression": "auto" },
  "security": { "sandbox": { "enabled": true, "timeout": 30000 } },
  "telemetry": { "enabled": false }
}
```

---

## Security

- **OS Keychain** — API keys encrypted at rest, never plain text
- **Rate limiter** — 10 calls/min per provider, circuit breaker on failures
- **Command sandbox** — 20+ dangerous patterns blocked, 30s timeout
- **Path traversal guard** — All file operations validated against project root
- **Network egress** — Domain allowlist for all outbound requests
- **Fetch timeout** — 60s API timeout, no hanging requests
- **Audit log** — All actions logged locally, tamper-evident
- **Key protection** — Keys never in logs, crash reports, or generated code

---

## Self-Improvement

VORACODE learns from your patterns to become smarter over time — all locally.

1. You perform similar tasks → patterns detected
2. After 3+ matches → suggests a reusable skill
3. You confirm → skill is created, future tasks get faster

All learning is **local** in `~/.local/share/voracode/`. Zero data sent anywhere.

---

## Development

```bash
git clone https://github.com/mysterious75/voracode.git
cd voracode && bun install
bun run dev        # development
bun run test       # tests
bun run build:all  # cross-platform binaries
```

---

## License

MIT — See [LICENSE](LICENSE)

---

<p align="center">
  <a href="https://github.com/mysterious75/voracode">GitHub</a> ·
  <a href="https://npmjs.com/package/voracode">npm</a> ·
  <a href="https://github.com/mysterious75/voracode/issues">Issues</a>
</p>
