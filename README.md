# VORACODE

> **Your AI engineering partner. One agent, every surface.**

VORACODE is an open-source, terminal-native AI coding agent. It lives in your terminal, understands your codebase, and helps you code faster by executing routine tasks, explaining complex code, and handling git workflows.

## Why VORACODE?

| Feature | VORACODE | Others |
|---------|----------|--------|
| **Price** | Free forever (BYOK) | $20-40/month subscriptions |
| **Privacy** | Zero telemetry by default | Data collected by default |
| **Offline** | 100% capable with local models | Requires internet |
| **Providers** | 75+ AI providers, any model | 6-8 models only |
| **Self-improving** | Learns from your patterns | Static behavior |
| **Open Source** | MIT license | Closed source |

## Quick Start

### Install

```bash
# Using npm
npm install -g voracode

# Using Bun (recommended)
bun install -g voracode

# Using Homebrew (macOS/Linux)
brew install voracode

# One-liner install
curl -fsSL https://voracode.dev/install | bash
```

### Configure API Key (BYOK)

VORACODE is **Bring Your Own Key** — you provide the API key, we provide the tool.

```bash
# Set an API key for any provider
voracode key set openai sk-xxxxxxxxxxxx
voracode key set anthropic sk-ant-xxxxxxxxxxxx
voracode key set deepseek sk-xxxxxxxxxxxx
voracode key set groq gsk_xxxxxxxxxxxx
voracode key set google AIzaXxxxxxxxxxxxxx
voracode key set openrouter sk-or-v1-xxxxxxxxxxxx

# Or use environment variables
export DEEPSEEK_API_KEY=sk-xxxxxxxxxxxx
export GROQ_API_KEY=gsk_xxxxxxxxxxxx
```

### Use

```bash
# Initialize VORACODE in your project
voracode init

# Run a task
voracode run "create a login page with React and Tailwind"

# Use a specific model
voracode run "write a fibonacci function" -m deepseek/deepseek-chat

# Continue a previous session
voracode run "add dark mode" --session abc123

# Dry run (plan only, no execution)
voracode run "refactor the auth module" --dry-run
```

## Command Reference

### Core Commands

#### `voracode run`

Execute a task with AI.

```bash
voracode run "<task description>"

# Options:
  -m, --model <model>       Model to use (provider/model-name)
  -a, --agent <mode>        Agent mode (build|plan|debug)
  -y, --yes                 Auto-approve all actions
  --session <id>            Continue an existing session
  --fork                    Fork session when continuing
  --output <format>         Output format (text|json|silent)
  --dry-run                 Show plan without executing

# Examples:
voracode run "create a REST API with Express"
voracode run "fix the bug in auth.ts" -m anthropic/claude-sonnet-4
voracode run "add tests for user model" --session abc123 --fork
voracode run "explain this codebase" --dry-run
voracode run "deploy to vercel" -y --output json
```

#### `voracode init`

Initialize VORACODE in your project.

```bash
voracode init [directory]

# Options:
  -f, --force               Overwrite existing configuration
  --name <name>             Custom project name

# Creates:
#   .voracode/
#   ├── AGENTS.md           # Project instructions for AI
#   ├── config.json         # VORACODE configuration
#   ├── skills/             # Custom skill definitions
#   ├── plugins/            # Plugin extensions
#   └── mcp/                # MCP server configs
```

#### `voracode session`

Manage AI agent sessions.

```bash
# List sessions
voracode session list [--limit 10]

# Show session details
voracode session show <id>

# Resume a session
voracode session resume <id> [--fork]

# Delete a session
voracode session delete <id> [-f]

# Export session as JSON
voracode session export <id> [file]

# Import session from JSON
voracode session import <file>
```

### Model Management

#### `voracode model`

Manage AI providers and models.

```bash
# List all providers and key status
voracode model list

# Filter by provider
voracode model list -p deepseek

# Set active model
voracode model set deepseek/deepseek-chat

# Test a provider connection
voracode model test deepseek
voracode model test groq
```

**Supported Providers:**

| Provider | Protocol | Free Tier | BYOK |
|----------|----------|-----------|------|
| OpenAI | OpenAI-compatible | No | ✅ |
| Anthropic | Anthropic Messages | No | ✅ |
| Google Gemini | Google AI | Yes (60 req/min) | ✅ |
| DeepSeek | OpenAI-compatible | Cheap ($0.14/M tokens) | ✅ |
| Groq | OpenAI-compatible | Yes (500K TPD) | ✅ |
| Ollama | OpenAI-compatible (local) | Free (local inference) | ✅ |
| OpenRouter | OpenAI-compatible | Yes (25+ free models) | ✅ |
| HuggingFace | OpenAI-compatible | Yes (generous free tier) | ✅ |
| Together | OpenAI-compatible | No | ✅ |
| Fireworks | OpenAI-compatible | No | ✅ |
| Cerebras | OpenAI-compatible | No | ✅ |
| Cloudflare AI | OpenAI-compatible | Yes (Workers AI free) | ✅ |

#### `voracode key`

Manage API keys securely.

```bash
# Store an API key (encrypted in OS Keychain)
voracode key set <provider> <api-key>

# Read from file (more secure)
voracode key set <provider> --file /path/to/key

# List configured providers (keys hidden)
voracode key list

# Remove a key
voracode key remove <provider>

# Test all keys
voracode key test
voracode key test deepseek
```

**Security Guarantees:**
- Keys stored in OS Keychain (macOS Keychain, Windows Credential Manager, Linux libsecret)
- Encrypted at rest, never in plain text
- Never logged, never in crash reports
- Never sent to unauthorized destinations
- Network guard blocks outbound requests containing key patterns

### Skills System

#### `voracode skill`

Manage reusable skills.

```bash
# List available skills
voracode skill list

# Install a skill from marketplace
voracode skill install web-search

# Install from GitHub
voracode skill install github.com/user/my-skill

# Install from local path
voracode skill install ./my-skills/deploy

# Remove a skill
voracode skill remove web-search

# Create a new skill from template
voracode skill create express-helper
```

**Built-in Skills:**

| Skill | Description |
|-------|-------------|
| `web-search` | Search the web for current information |
| `web-fetch` | Fetch and extract web content |
| `research` | Multi-source research with synthesis |
| `code-review` | AI-powered code review |
| `git-helper` | Git automation assistance |
| `deploy` | One-command deployment templates |
| `learn` | Self-improvement pattern tracker |

### MCP Integration

#### `voracode mcp`

Connect to external tools via Model Context Protocol.

```bash
# List configured MCP servers
voracode mcp list

# Add a stdio (local) MCP server
voracode mcp add filesystem -- npx -y @modelcontextprotocol/server-filesystem /path/to/dir

# Add an HTTP (remote) MCP server
voracode mcp add notion --transport http --url https://mcp.notion.com/mcp

# Add with custom headers (auth)
voracode mcp add github --transport http \
  --url https://api.githubcopilot.com/mcp/ \
  --header "Authorization: Bearer YOUR_TOKEN"

# Add with environment variables
voracode mcp add database --env DB_URL=postgresql://localhost/mydb \
  -- npx -y @bytebase/dbhub --dsn "postgresql://localhost/mydb"

# Remove a server
voracode mcp remove filesystem

# Test connection
voracode mcp test filesystem
```

**Popular MCP Servers:**

| Server | Install Command |
|--------|----------------|
| Filesystem | `voracode mcp add fs -- npx -y @modelcontextprotocol/server-filesystem .` |
| Git | `voracode mcp add git -- uvx mcp-server-git` |
| Memory | `voracode mcp add memory -- npx -y @modelcontextprotocol/server-memory` |
| Fetch | `voracode mcp add fetch -- npx -y @modelcontextprotocol/server-fetch` |
| GitHub | `voracode mcp add github --transport http --url https://api.githubcopilot.com/mcp/ --header "Authorization: Bearer TOKEN"` |
| PostgreSQL | `voracode mcp add db -- npx -y @bytebase/dbhub --dsn "postgresql://localhost/mydb"` |
| Sentry | `voracode mcp add sentry --transport http --url https://mcp.sentry.dev/mcp` |

**MCP Config Scopes:**
- **Local** (default): stored in `~/.config/voracode/mcp/` — private to you
- **Project**: stored in `.voracode/mcp/` — shared via version control

### Subscription Tiers

#### `voracode lite`

Low-cost subscription for curated open coding models.

```bash
# Subscribe ($5 first month, then $10/month)
voracode lite subscribe

# Check status
voracode lite status

# List available models
voracode lite models

# Cancel
voracode lite cancel
```

**Lite Models:** DeepSeek, Qwen, Kimi, MiniMax, MiMo, GLM
**Usage Limits:** $12/5 hours, $30/week, $60/month

#### `voracode pro`

Pay-as-you-go credits for frontier AI models.

```bash
# Check balance
voracode pro balance

# Add credits
voracode pro add 20

# List models with pricing
voracode pro models

# Configure auto-reload
voracode pro autoreload 5 20

# Set monthly spending limit
voracode pro limits 50

# Manage team
voracode pro team --invite user@example.com
voracode pro team --list
```

**Pro Models:** GPT-5.6, Claude Opus 4.8, Gemini 3.1 Pro, Grok 4.5

### Utility Commands

#### `voracode audit`

Lightweight security audit for your code.

```bash
voracode audit [directory]

# Options:
  -l, --level <level>       Severity (low|medium|high|critical)
  -o, --output <format>     (text|json|html)
  -f, --fix                 Attempt auto-fix

# Examples:
voracode audit .
voracode audit src/ --level high --output json
voracode audit . --fix
```

#### `voracode doctor`

Run system health checks.

```bash
voracode doctor [--verbose] [--fix]
```

#### `voracode stats`

Show usage statistics (local only, zero telemetry).

```bash
voracode stats [--days 7]
```

#### `voracode config`

View or edit configuration.

```bash
# Show current config
voracode config show

# Set a value
voracode config set model.provider deepseek

# Get a value
voracode config get model.provider

# Show config file paths
voracode config path

# Reset to defaults
voracode config reset
```

#### `voracode plugin`

Manage plugins.

```bash
voracode plugin list
voracode plugin install <npm-package>
voracode plugin remove <name>
voracode plugin create <name>
```

#### `voracode update`

Check for and install updates.

```bash
voracode update [--check] [--channel stable|beta]
```

## Configuration

### Global Config: `~/.config/voracode/config.json`

```json
{
  "version": "1.0",
  "model": {
    "provider": "auto",
    "name": "auto",
    "fallback": ["deepseek", "groq"]
  },
  "context": {
    "maxTokens": 128000,
    "compression": "auto",
    "smartLoading": true
  },
  "security": {
    "sandbox": { "enabled": true, "timeout": 30000 },
    "network": { "allowedDomains": ["api.openai.com"] },
    "rateLimit": { "callsPerMinute": 10 }
  },
  "telemetry": { "enabled": false, "localOnly": true }
}
```

### Project Config: `.voracode/config.json`

Same format — overrides global config for current project.

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | OpenAI API key |
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `DEEPSEEK_API_KEY` | DeepSeek API key |
| `GROQ_API_KEY` | Groq API key |
| `GOOGLE_API_KEY` | Google Gemini API key |
| `OPENROUTER_API_KEY` | OpenRouter API key |

## Self-Improvement Engine

VORACODE learns from your patterns to become smarter over time.

### How It Works

```
You perform similar tasks → VORACODE detects patterns → Suggests skills → You confirm → Skills save time
```

### Privacy

- **All learning is local** — stored in `~/.local/share/voracode/`
- **Zero data sent to servers** unless you explicitly opt-in
- **Community skills are optional** — install only what you want

### Storage Usage

| Data | Per Day | Per Month | Per Year |
|------|---------|-----------|----------|
| Sessions | ~200KB | ~6MB | ~72MB |
| Memory | ~10KB | ~300KB | ~3.6MB |
| Skills | ~1KB | ~30KB | ~360KB |
| **Total** | **~235KB** | **~7MB** | **~85MB** |

## Security

### 7-Layer Defense

1. **Input Sanitization** — strip control chars, detect injection patterns
2. **Prompt Boundary** — immutable system prompt, user input isolated
3. **Output Validation** — check for leaks, dangerous code
4. **Command Sandbox** — 50+ blocked patterns, timeout, output limits
5. **Network Egress** — domain allowlist, user approval for unknown
6. **Key Vault** — OS Keychain, encrypted, never logged
7. **Audit Log** — all actions logged, tamper-evident

### API Key Protection

Keys NEVER:
- Stored in plain text
- Written to logs or crash reports
- Sent to unauthorized destinations
- Included in generated code

## Project Structure

```
voracode/
├── src/
│   ├── cli/              # CLI commands (15 commands)
│   ├── engine/           # Agent loop (plan → execute → reflect)
│   ├── models/           # Universal model adapter (75+ providers)
│   ├── context/          # Context manager (smart loading, compression)
│   ├── security/         # Security layer (7-layer defense)
│   ├── tools/            # Tool executor (10+ built-in tools)
│   ├── skills/           # Skills engine + self-improvement
│   ├── session/          # Session manager
│   ├── storage/          # SQLite + config
│   ├── server/           # API server (ACP protocol)
│   └── ui/               # TUI + Web interface
├── data/                 # Built-in skills, themes
├── scripts/              # Build/release scripts
└── tests/                # Test suite
```

## Development

```bash
# Install dependencies
bun install

# Run in development
bun run dev

# Build for all platforms
bun run build:all

# Run tests
bun run test

# Lint
bun run lint
```

## License

MIT — see [LICENSE](LICENSE) file.

## Links

- **GitHub:** [github.com/mysterious75/voracode](https://github.com/mysterious75/voracode)
- **npm:** [npmjs.com/package/voracode](https://npmjs.com/package/voracode)
- ** Issues:** [github.com/mysterious75/voracode/issues](https://github.com/mysterious75/voracode/issues)

---

<p align="center">VORACODE — Your AI engineering partner. One agent, every surface.</p>