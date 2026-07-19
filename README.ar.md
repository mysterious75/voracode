<p align="center">
  <a href="https://voracode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Ø´Ø¹Ø§Ø± Voracode">
    </picture>
  </a>
</p>
<p align="center">ÙˆÙƒÙŠÙ„ Ø¨Ø±Ù…Ø¬Ø© Ø¨Ø§Ù„Ø°ÙƒØ§Ø¡ Ø§Ù„Ø§ØµØ·Ù†Ø§Ø¹ÙŠ Ù…ÙØªÙˆØ­ Ø§Ù„Ù…ØµØ¯Ø±.</p>
<p align="center">
  <a href="https://voracode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/voracode-ai"><img alt="npm" src="https://img.shields.io/npm/v/voracode-ai?style=flat-square" /></a>
  <a href="https://github.com/mysterious75/voracode/actions/workflows/publish.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/mysterious75/voracode/publish.yml?style=flat-square&branch=dev" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">ç®€ä½“ä¸­æ–‡</a> |
  <a href="README.zht.md">ç¹é«”ä¸­æ–‡</a> |
  <a href="README.ko.md">í•œêµ­ì–´</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">EspaÃ±ol</a> |
  <a href="README.fr.md">FranÃ§ais</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">æ—¥æœ¬èªž</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Ð ÑƒÑÑÐºÐ¸Ð¹</a> |
  <a href="README.bs.md">Bosanski</a> |
  <a href="README.ar.md">Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">PortuguÃªs (Brasil)</a> |
  <a href="README.th.md">à¹„à¸—à¸¢</a> |
  <a href="README.tr.md">TÃ¼rkÃ§e</a> |
  <a href="README.uk.md">Ð£ÐºÑ€Ð°Ñ—Ð½ÑÑŒÐºÐ°</a> |
  <a href="README.bn.md">à¦¬à¦¾à¦‚à¦²à¦¾</a> |
  <a href="README.gr.md">Î•Î»Î»Î·Î½Î¹ÎºÎ¬</a> |
  <a href="README.vi.md">Tiáº¿ng Viá»‡t</a>
</p>

[![Voracode Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://voracode.ai)

---

### Ø§Ù„ØªØ«Ø¨ÙŠØª

```bash
# YOLO
curl -fsSL https://voracode.ai/install | bash

# Ù…Ø¯ÙŠØ±ÙŠ Ø§Ù„Ø­Ø²Ù…
npm i -g voracode-ai@latest        # Ø§Ùˆ bun/pnpm/yarn
scoop install voracode             # Windows
choco install voracode             # Windows
brew install mysterious75/tap/voracode # macOS Ùˆ Linux (Ù…ÙˆØµÙ‰ Ø¨Ù‡ØŒ Ø¯Ø§Ø¦Ù…Ø§ Ù…Ø­Ø¯Ø«)
brew install voracode              # macOS Ùˆ Linux (ØµÙŠØºØ© brew Ø§Ù„Ø±Ø³Ù…ÙŠØ©ØŒ ØªØ­Ø¯ÙŠØ« Ø§Ù‚Ù„)
sudo pacman -S voracode            # Arch Linux (Stable)
paru -S voracode-bin               # Arch Linux (Latest from AUR)
mise use -g voracode               # Ø§ÙŠ Ù†Ø¸Ø§Ù…
nix run nixpkgs#voracode           # Ø§Ùˆ github:mysterious75/voracode Ù„Ø§Ø­Ø¯Ø« ÙØ±Ø¹ dev
```

> [!TIP]
> Ø§Ø­Ø°Ù Ø§Ù„Ø§ØµØ¯Ø§Ø±Ø§Øª Ø§Ù„Ø§Ù‚Ø¯Ù… Ù…Ù† 0.1.x Ù‚Ø¨Ù„ Ø§Ù„ØªØ«Ø¨ÙŠØª.

### ØªØ·Ø¨ÙŠÙ‚ Ø³Ø·Ø­ Ø§Ù„Ù…ÙƒØªØ¨ (BETA)

ÙŠØªÙˆÙØ± Voracode Ø§ÙŠØ¶Ø§ ÙƒØªØ·Ø¨ÙŠÙ‚ Ø³Ø·Ø­ Ù…ÙƒØªØ¨. Ù‚Ù… Ø¨Ø§Ù„ØªÙ†Ø²ÙŠÙ„ Ù…Ø¨Ø§Ø´Ø±Ø© Ù…Ù† [ØµÙØ­Ø© Ø§Ù„Ø§ØµØ¯Ø§Ø±Ø§Øª](https://github.com/mysterious75/voracode/releases) Ø§Ùˆ Ù…Ù† [voracode.ai/download](https://voracode.ai/download).

| Ø§Ù„Ù…Ù†ØµØ©                | Ø§Ù„ØªÙ†Ø²ÙŠÙ„                            |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `voracode-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `voracode-desktop-mac-x64.dmg`     |
| Windows               | `voracode-desktop-windows-x64.exe` |
| Linux                 | `.deb` Ø§Ùˆ `.rpm` Ø§Ùˆ AppImage       |

```bash
# macOS (Homebrew)
brew install --cask voracode-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/voracode-desktop
```

#### Ù…Ø¬Ù„Ø¯ Ø§Ù„ØªØ«Ø¨ÙŠØª

ÙŠØ­ØªØ±Ù… Ø³ÙƒØ±Ø¨Øª Ø§Ù„ØªØ«Ø¨ÙŠØª ØªØ±ØªÙŠØ¨ Ø§Ù„Ø§ÙˆÙ„ÙˆÙŠØ© Ø§Ù„ØªØ§Ù„ÙŠ Ù„Ù…Ø³Ø§Ø± Ø§Ù„ØªØ«Ø¨ÙŠØª:

1. `$VORACODE_INSTALL_DIR` - Ù…Ø¬Ù„Ø¯ ØªØ«Ø¨ÙŠØª Ù…Ø®ØµØµ
2. `$XDG_BIN_DIR` - Ù…Ø³Ø§Ø± Ù…ØªÙˆØ§ÙÙ‚ Ù…Ø¹ Ù…ÙˆØ§ØµÙØ§Øª XDG Base Directory
3. `$HOME/bin` - Ù…Ø¬Ù„Ø¯ Ø§Ù„Ø«Ù†Ø§Ø¦ÙŠØ§Øª Ø§Ù„Ù‚ÙŠØ§Ø³ÙŠ Ù„Ù„Ù…Ø³ØªØ®Ø¯Ù… (Ø§Ù† ÙˆØ¬Ø¯ Ø§Ùˆ Ø§Ù…ÙƒÙ† Ø§Ù†Ø´Ø§Ø¤Ù‡)
4. `$HOME/.voracode/bin` - Ø§Ù„Ù…Ø³Ø§Ø± Ø§Ù„Ø§ÙØªØ±Ø§Ø¶ÙŠ Ø§Ù„Ø§Ø­ØªÙŠØ§Ø·ÙŠ

```bash
# Ø§Ù…Ø«Ù„Ø©
VORACODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://voracode.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://voracode.ai/install | bash
```

### Agents

ÙŠØªØ¶Ù…Ù† Voracode ÙˆÙƒÙŠÙ„ÙŠÙ’Ù† (Agents) Ù…Ø¯Ù…Ø¬ÙŠÙ† ÙŠÙ…ÙƒÙ†Ùƒ Ø§Ù„ØªØ¨Ø¯ÙŠÙ„ Ø¨ÙŠÙ†Ù‡Ù…Ø§ Ø¨Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø²Ø± `Tab`.

- **build** - Ø§Ù„Ø§ÙØªØ±Ø§Ø¶ÙŠØŒ ÙˆÙƒÙŠÙ„ Ø¨ØµÙ„Ø§Ø­ÙŠØ§Øª ÙƒØ§Ù…Ù„Ø© Ù„Ø§Ø¹Ù…Ø§Ù„ Ø§Ù„ØªØ·ÙˆÙŠØ±
- **plan** - ÙˆÙƒÙŠÙ„ Ù„Ù„Ù‚Ø±Ø§Ø¡Ø© ÙÙ‚Ø· Ù„Ù„ØªØ­Ù„ÙŠÙ„ ÙˆØ§Ø³ØªÙƒØ´Ø§Ù Ø§Ù„ÙƒÙˆØ¯
  - ÙŠØ±ÙØ¶ ØªØ¹Ø¯ÙŠÙ„ Ø§Ù„Ù…Ù„ÙØ§Øª Ø§ÙØªØ±Ø§Ø¶ÙŠØ§
  - ÙŠØ·Ù„Ø¨ Ø§Ù„Ø§Ø°Ù† Ù‚Ø¨Ù„ ØªØ´ØºÙŠÙ„ Ø§ÙˆØ§Ù…Ø± bash
  - Ù…Ø«Ø§Ù„ÙŠ Ù„Ø§Ø³ØªÙƒØ´Ø§Ù Ù‚ÙˆØ§Ø¹Ø¯ ÙƒÙˆØ¯ ØºÙŠØ± Ù…Ø£Ù„ÙˆÙØ© Ø§Ùˆ Ù„ØªØ®Ø·ÙŠØ· Ø§Ù„ØªØºÙŠÙŠØ±Ø§Øª

Ø¨Ø§Ù„Ø§Ø¶Ø§ÙØ© Ø§Ù„Ù‰ Ø°Ù„Ùƒ ÙŠÙˆØ¬Ø¯ ÙˆÙƒÙŠÙ„ ÙØ±Ø¹ÙŠ **general** Ù„Ù„Ø¨Ø­Ø« Ø§Ù„Ù…Ø¹Ù‚Ø¯ ÙˆØ§Ù„Ù…Ù‡Ø§Ù… Ù…ØªØ¹Ø¯Ø¯Ø© Ø§Ù„Ø®Ø·ÙˆØ§Øª.
ÙŠØ³ØªØ®Ø¯Ù… Ø¯Ø§Ø®Ù„ÙŠØ§ ÙˆÙŠÙ…ÙƒÙ† Ø§Ø³ØªØ¯Ø¹Ø§Ø¤Ù‡ Ø¨ÙƒØªØ§Ø¨Ø© `@general` ÙÙŠ Ø§Ù„Ø±Ø³Ø§Ø¦Ù„.

ØªØ¹Ø±Ù Ø¹Ù„Ù‰ Ø§Ù„Ù…Ø²ÙŠØ¯ Ø­ÙˆÙ„ [agents](https://voracode.ai/docs/agents).

### Ø§Ù„ØªÙˆØ«ÙŠÙ‚

Ù„Ù…Ø²ÙŠØ¯ Ù…Ù† Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø­ÙˆÙ„ ÙƒÙŠÙÙŠØ© Ø¶Ø¨Ø· VoracodeØŒ [**Ø±Ø§Ø¬Ø¹ Ø§Ù„ØªÙˆØ«ÙŠÙ‚**](https://voracode.ai/docs).

### Ø§Ù„Ù…Ø³Ø§Ù‡Ù…Ø©

Ø§Ø°Ø§ ÙƒÙ†Øª Ù…Ù‡ØªÙ…Ø§ Ø¨Ø§Ù„Ù…Ø³Ø§Ù‡Ù…Ø© ÙÙŠ VoracodeØŒ ÙŠØ±Ø¬Ù‰ Ù‚Ø±Ø§Ø¡Ø© [contributing docs](./CONTRIBUTING.md) Ù‚Ø¨Ù„ Ø§Ø±Ø³Ø§Ù„ pull request.

### Ø§Ù„Ø¨Ù†Ø§Ø¡ ÙÙˆÙ‚ Voracode

Ø§Ø°Ø§ ÙƒÙ†Øª ØªØ¹Ù…Ù„ Ø¹Ù„Ù‰ Ù…Ø´Ø±ÙˆØ¹ Ù…Ø±ØªØ¨Ø· Ø¨Ù€ Voracode ÙˆÙŠØ³ØªØ®Ø¯Ù… "voracode" ÙƒØ¬Ø²Ø¡ Ù…Ù† Ø§Ø³Ù…Ù‡ (Ù…Ø«Ù„ "voracode-dashboard" Ø§Ùˆ "voracode-mobile")ØŒ ÙŠØ±Ø¬Ù‰ Ø§Ø¶Ø§ÙØ© Ù…Ù„Ø§Ø­Ø¸Ø© ÙÙŠ README ØªÙˆØ¶Ø­ Ø§Ù†Ù‡ Ù„ÙŠØ³ Ù…Ø¨Ù†ÙŠØ§ Ø¨ÙˆØ§Ø³Ø·Ø© ÙØ±ÙŠÙ‚ Voracode ÙˆÙ„Ø§ ÙŠØ±ØªØ¨Ø· Ø¨Ù†Ø§ Ø¨Ø£ÙŠ Ø´ÙƒÙ„.

---

**Ø§Ù†Ø¶Ù… Ø§Ù„Ù‰ Ù…Ø¬ØªÙ…Ø¹Ù†Ø§** [Discord](https://discord.gg/voracode) | [X.com](https://x.com/voracode)
