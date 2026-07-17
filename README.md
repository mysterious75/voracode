<pre align="center">

██╗   ██╗ ██████╗ ██████╗  █████╗  ██████╗ ██████╗ ██████╗ ███████╗
██║   ██║██╔═══██╗██╔══██╗██╔══██╗██╔════╝██╔═══██╗██╔══██╗██╔════╝
██║   ██║██║   ██║██████╔╝███████║██║     ██║   ██║██║  ██║█████╗  
██║   ██║██║   ██║██╔══██╗██╔══██║██║     ██║   ██║██║  ██║██╔══╝  
╚██╗ ██╔╝██║   ██║██╔══██╗██║  ██║╚██████╗╚██████╔╝██████╔╝███████╗
 ╚████╔╝ ╚██████╔╝██║  ██║██║  ██║ ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝
  ╚═══╝   ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝                            

        The AI Operating System for Developers
        One CLI. Any LLM. Unlimited Workflows.

</pre>

<p align="center">
  <a href="https://www.npmjs.com/package/voracode"><img alt="NPM Version" src="https://img.shields.io/npm/v/voracode?style=flat-square&color=7c3aed" /></a>
  <a href="https://www.npmjs.com/package/voracode"><img alt="Downloads" src="https://img.shields.io/npm/dm/voracode?style=flat-square&color=7c3aed" /></a>
  <a href="https://github.com/mysterious75/voracode/blob/master/LICENSE"><img alt="License" src="https://img.shields.io/github/license/mysterious75/voracode?style=flat-square&color=7c3aed" /></a>
  <a href="https://discord.gg/voracode"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&color=7c3aed" /></a>
  <a href="https://github.com/mysterious75/voracode"><img alt="Stars" src="https://img.shields.io/github/stars/mysterious75/voracode?style=flat-square&color=7c3aed" /></a>
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square" />
</p>

---

## Why Voracode?

Most AI coding tools lock you into one provider. Claude Code only works with Claude. Gemini CLI only works with Gemini.

**Voracode breaks that lock-in.**

Use any provider, any model, any workflow — from one fast CLI. Switch between Claude, GPT, Gemini, DeepSeek, or run local models with Ollama. Your workflow stays the same.

```bash
voracode  # That's it. You're in.
```

---

## Features

```
✅ 75+ AI Providers         ✅ MCP Protocol Support
✅ Local Models (Ollama)    ✅ Agent Mode
✅ Multi-File Editing       ✅ Shell Execution  
✅ Session Memory           ✅ Planning Agent
✅ Research Agent           ✅ Desktop App
✅ LSP Integration          ✅ Git-Aware Context
✅ Custom Prompts           ✅ Session History
```

---

## Architecture

```
                         ┌─────────────────┐
                         │   Voracode CLI   │
                         └────────┬────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
          ▼                       ▼                       ▼
   ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
   │   Providers  │        │   Agents    │        │    Tools    │
   └──────┬──────┘        └──────┬──────┘        └──────┬──────┘
          │                       │                       │
    ┌─────┴─────┐           ┌─────┴─────┐           ┌─────┴─────┐
    │           │           │           │           │           │
    ▼           ▼           ▼           ▼           ▼           ▼
┌───────┐ ┌───────┐   ┌───────┐ ┌───────┐   ┌───────┐ ┌───────┐
│Claude │ │  GPT  │   │ Build │ │ Plan  │   │  Edit │ │ Bash  │
│  GPT  │ │Gemini │   │ Agent │ │ Agent │   │ Files │ │  Run  │
│Ollama │ │DeepS. │   │       │ │       │   │       │ │       │
└───────┘ └───────┘   └───────┘ └───────┘   └───────┘ └───────┘
```

---

## Comparison

| Feature | Voracode | Claude Code | Gemini CLI | Cursor |
|---------|----------|-------------|------------|--------|
| **Multi-Provider** | ✅ | ❌ | ❌ | ❌ |
| **Local Models** | ✅ | ❌ | ✅ | ❌ |
| **MCP Support** | ✅ | ✅ | ❌ | ❌ |
| **Desktop App** | ✅ | ❌ | ❌ | ✅ |
| **Open Source** | ✅ | ❌ | ✅ | ❌ |
| **Terminal Native** | ✅ | ✅ | ✅ | ❌ |
| **Free Tier** | ✅ | ❌ | ✅ | ❌ |

---

## Installation

```bash
# npm
npm i -g voracode@latest

# pnpm
pnpm i -g voracode@latest

# bun
bun i -g voracode@latest

# yarn
yarn global add voracode@latest

# npx (no install)
npx voracode@latest
```

<details>
<summary><strong>Platform-specific</strong></summary>

```bash
# macOS / Linux (Homebrew)
brew install mysterious75/tap/voracode

# Windows (Scoop)
scoop install voracode

# Windows (Chocolatey)
choco install voracode

# Arch Linux
sudo pacman -S voracode
```

</details>

---

## Quick Start

```bash
# 1. Start Voracode
voracode

# 2. Chat with your code
> What does this function do?

# 3. Let it build
> Add error handling to the API endpoints

# 4. Switch agents with Tab
#    Build → Plan → General
```

---

## Commands

```bash
voracode                    # Start interactive TUI
voracode /path/to/project   # Open in specific directory
voracode -p "explain this"  # Non-interactive prompt
voracode serve              # Start headless API server
voracode serve --port 8080  # Custom port
voracode web                # Start server + web UI
voracode doctor             # Diagnose issues
voracode update             # Update to latest version
```

---

## Agents

Press `Tab` to switch between agents:

| Agent | Use Case | Permissions |
|-------|----------|-------------|
| **build** | Full development, file editing, commands | Full access |
| **plan** | Analysis, exploration, read-only tasks | Read-only |
| **general** | Complex searches, multi-step tasks | Subagent |

---

## MCP Integration

Connect any MCP server:

```json
{
  "mcp": {
    "github": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-github"],
      "environment": {
        "GITHUB_TOKEN": "your-token"
      }
    }
  }
}
```

---

## Configuration

```json
{
  "$schema": "https://raw.githubusercontent.com/mysterious75/voracode/master/packages/voracode/src/config/schema.json",
  "provider": {
    "anthropic": {
      "apiKey": "sk-ant-..."
    }
  },
  "theme": "purple"
}
```

---

## Roadmap

```
✅ CLI Interface
✅ Multi-Provider Support
✅ Agent System
✅ MCP Integration
✅ Session Management
✅ Desktop App

🚧 Cloud Sync
🚧 Team Workspaces
🚧 Plugin System
🚧 Voice Input
🚧 Mobile Companion
🚧 AI Memory Persistence
```

---

## Desktop App

Download from [releases](https://github.com/mysterious75/voracode/releases) or build from source:

```bash
git clone https://github.com/mysterious75/voracode.git
cd voracode
bun install
bun run --cwd packages/desktop dev
```

| Platform | Download |
|----------|----------|
| macOS (Apple Silicon) | `voracode-mac-arm64.dmg` |
| macOS (Intel) | `voracode-mac-x64.dmg` |
| Windows | `voracode-windows-x64.exe` |
| Linux | `.deb`, `.rpm`, or `.AppImage` |

---

## Contributing

```bash
git clone https://github.com/mysterious75/voracode.git
cd voracode
bun install
bun dev
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

MIT © [mysterious75](https://github.com/mysterious75)

---

<p align="center">
  <a href="https://github.com/mysterious75/voracode">GitHub</a> · 
  <a href="https://discord.gg/voracode">Discord</a> · 
  <a href="https://x.com/voracode">X/Twitter</a>
</p>
