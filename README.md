<p align="center">
  <a href="https://github.com/mysterious75/voracode">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Voracode" height="100">
    </picture>
  </a>
</p>

<h3 align="center">AI-Native Development Environment</h3>

<p align="center">
  Build. Think. Automate.
</p>

<p align="center">
  <a href="https://github.com/mysterious75/voracode/actions/workflows/publish.yml"><img alt="Build" src="https://img.shields.io/github/actions/workflow/status/mysterious75/voracode/publish.yml?style=flat-square&branch=dev&label=build" /></a>
  <a href="https://www.npmjs.com/package/voracode"><img alt="npm" src="https://img.shields.io/npm/v/voracode?style=flat-square" /></a>
  <a href="https://github.com/mysterious75/voracode/blob/dev/LICENSE"><img alt="License" src="https://img.shields.io/github/license/mysterious75/voracode?style=flat-square" /></a>
  <a href="https://discord.gg/voracode"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
</p>

---

[![Voracode TUI](packages/web/src/assets/lander/screenshot.png)](https://github.com/mysterious75/voracode)

---

## Features

- **Terminal-native AI assistant** — chat with your codebase directly from the terminal
- **Multi-provider support** — Claude, GPT, Gemini, DeepSeek, and 75+ providers
- **Built-in agents** — specialized agents for building, planning, and research
- **Tool integration** — file editing, bash execution, LSP, MCP servers
- **Session management** — persistent sessions with history and resume
- **Desktop app** — native Electron app for a richer experience

## Quick Start

```bash
# Install
npm i -g voracode@latest

# Or use other package managers
bun i -g voracode@latest
pnpm i -g voracode@latest
yarn global add voracode@latest
```

<details>
<summary><strong>More install options</strong></summary>

```bash
# macOS / Linux (Homebrew — recommended)
brew install mysterious75/tap/voracode

# Windows (Scoop)
scoop install voracode

# Windows (Chocolatey)
choco install voracode

# Arch Linux
sudo pacman -S voracode

# Nix
nix run nixpkgs#voracode
```

</details>

## Usage

```bash
# Start interactive TUI
voracode

# Run in specific directory
voracode /path/to/project

# Non-interactive mode
voracode -p "explain this codebase"

# Headless API server
voracode serve
```

## Agents

Switch between agents with the `Tab` key:

| Agent | Description |
|-------|-------------|
| **build** | Default full-access agent for development |
| **plan** | Read-only agent for analysis and exploration |
| **general** | Subagent for complex searches (use `@general`) |

## Desktop App

Download from [releases](https://github.com/mysterious75/voracode/releases) or build from source:

```bash
bun run --cwd packages/desktop dev
```

| Platform | Download |
|----------|----------|
| macOS (Apple Silicon) | `voracode-desktop-mac-arm64.dmg` |
| macOS (Intel) | `voracode-desktop-mac-x64.dmg` |
| Windows | `voracode-desktop-windows-x64.exe` |
| Linux | `.deb`, `.rpm`, or `.AppImage` |

## Configuration

Voracode uses `~/.config/voracode/voracode.json` for configuration.

```json
{
  "$schema": "https://voracode.ai/config.json",
  "provider": {
    "anthropic": {
      "apiKey": "sk-ant-..."
    }
  }
}
```

See the [documentation](https://voracode.ai/docs) for full configuration reference.

## Contributing

We welcome contributions! Please read our [contributing guide](./CONTRIBUTING.md) before submitting a PR.

```bash
# Clone and setup
git clone https://github.com/mysterious75/voracode.git
cd voracode
bun install
bun dev
```

## License

MIT © [mysterious75](https://github.com/mysterious75)

---

<p align="center">
  <a href="https://github.com/mysterious75/voracode">GitHub</a> · 
  <a href="https://discord.gg/voracode">Discord</a> · 
  <a href="https://x.com/voracode">X</a>
</p>
