<p align="center">
  <a href="https://voracode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Voracode logo">
    </picture>
  </a>
</p>
<p align="center">ÎŸ Ï€ÏÎ¬ÎºÏ„Î¿ÏÎ±Ï‚ Ï„ÎµÏ‡Î½Î·Ï„Î®Ï‚ Î½Î¿Î·Î¼Î¿ÏƒÏÎ½Î·Ï‚ Î±Î½Î¿Î¹ÎºÏ„Î¿Ï ÎºÏŽÎ´Î¹ÎºÎ± Î³Î¹Î± Ï€ÏÎ¿Î³ÏÎ±Î¼Î¼Î±Ï„Î¹ÏƒÎ¼ÏŒ.</p>
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

### Î•Î³ÎºÎ±Ï„Î¬ÏƒÏ„Î±ÏƒÎ·

```bash
# YOLO
curl -fsSL https://voracode.ai/install | bash

# Î”Î¹Î±Ï‡ÎµÎ¹ÏÎ¹ÏƒÏ„Î­Ï‚ Ï€Î±ÎºÎ­Ï„Ï‰Î½
npm i -g voracode-ai@latest        # Î® bun/pnpm/yarn
scoop install voracode             # Windows
choco install voracode             # Windows
brew install mysterious75/tap/voracode # macOS ÎºÎ±Î¹ Linux (Ï€ÏÎ¿Ï„ÎµÎ¯Î½ÎµÏ„Î±Î¹, Ï€Î¬Î½Ï„Î± ÎµÎ½Î·Î¼ÎµÏÏ‰Î¼Î­Î½Î¿)
brew install voracode              # macOS ÎºÎ±Î¹ Linux (ÎµÏ€Î¯ÏƒÎ·Î¼Î¿Ï‚ Ï„ÏÏ€Î¿Ï‚ brew, Î»Î¹Î³ÏŒÏ„ÎµÏÎ¿ ÏƒÏ…Ï‡Î½Î­Ï‚ ÎµÎ½Î·Î¼ÎµÏÏŽÏƒÎµÎ¹Ï‚)
sudo pacman -S voracode            # Arch Linux (Î£Ï„Î±Î¸ÎµÏÏŒ)
paru -S voracode-bin               # Arch Linux (Î¤ÎµÎ»ÎµÏ…Ï„Î±Î¯Î± Î­ÎºÎ´Î¿ÏƒÎ· Î±Ï€ÏŒ AUR)
mise use -g voracode               # ÎŸÏ€Î¿Î¹Î¿Î´Î®Ï€Î¿Ï„Îµ Î»ÎµÎ¹Ï„Î¿Ï…ÏÎ³Î¹ÎºÏŒ ÏƒÏÏƒÏ„Î·Î¼Î±
nix run nixpkgs#voracode           # Î® github:mysterious75/voracode Î¼Îµ Î²Î¬ÏƒÎ· Ï„Î·Î½ Ï€Î¹Î¿ Ï€ÏÏŒÏƒÏ†Î±Ï„Î· Î±Î»Î»Î±Î³Î® Î±Ï€ÏŒ Ï„Î¿ dev branch
```

> [!TIP]
> Î‘Ï†Î±Î¯ÏÎµÏƒÎµ Ï€Î±Î»Î±Î¹ÏŒÏ„ÎµÏÎµÏ‚ ÎµÎºÎ´ÏŒÏƒÎµÎ¹Ï‚ Î±Ï€ÏŒ Ï„Î· 0.1.x Ï€ÏÎ¹Î½ Î±Ï€ÏŒ Ï„Î·Î½ ÎµÎ³ÎºÎ±Ï„Î¬ÏƒÏ„Î±ÏƒÎ·.

### Î•Ï†Î±ÏÎ¼Î¿Î³Î® Desktop (BETA)

Î¤Î¿ Voracode ÎµÎ¯Î½Î±Î¹ ÎµÏ€Î¯ÏƒÎ·Ï‚ Î´Î¹Î±Î¸Î­ÏƒÎ¹Î¼Î¿ Ï‰Ï‚ ÎµÏ†Î±ÏÎ¼Î¿Î³Î®. ÎšÎ±Ï„Î­Î²Î±ÏƒÎµ Ï„Î¿ Î±Ï€ÎµÏ…Î¸ÎµÎ¯Î±Ï‚ Î±Ï€ÏŒ Ï„Î· [ÏƒÎµÎ»Î¯Î´Î± ÎµÎºÎ´ÏŒÏƒÎµÏ‰Î½](https://github.com/mysterious75/voracode/releases) Î® Ï„Î¿ [voracode.ai/download](https://voracode.ai/download).

| Î Î»Î±Ï„Ï†ÏŒÏÎ¼Î±             | Î›Î®ÏˆÎ·                               |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `voracode-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `voracode-desktop-mac-x64.dmg`     |
| Windows               | `voracode-desktop-windows-x64.exe` |
| Linux                 | `.deb`, `.rpm`, Î® AppImage         |

```bash
# macOS (Homebrew)
brew install --cask voracode-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/voracode-desktop
```

#### ÎšÎ±Ï„Î¬Î»Î¿Î³Î¿Ï‚ Î•Î³ÎºÎ±Ï„Î¬ÏƒÏ„Î±ÏƒÎ·Ï‚

Î¤Î¿ script ÎµÎ³ÎºÎ±Ï„Î¬ÏƒÏ„Î±ÏƒÎ·Ï‚ Ï„Î·ÏÎµÎ¯ Ï„Î·Î½ Î±ÎºÏŒÎ»Î¿Ï…Î¸Î· ÏƒÎµÎ¹ÏÎ¬ Ï€ÏÎ¿Ï„ÎµÏÎ±Î¹ÏŒÏ„Î·Ï„Î±Ï‚ Î³Î¹Î± Ï„Î· Î´Î¹Î±Î´ÏÎ¿Î¼Î® ÎµÎ³ÎºÎ±Ï„Î¬ÏƒÏ„Î±ÏƒÎ·Ï‚:

1. `$VORACODE_INSTALL_DIR` - Î ÏÎ¿ÏƒÎ±ÏÎ¼Î¿ÏƒÎ¼Î­Î½Î¿Ï‚ ÎºÎ±Ï„Î¬Î»Î¿Î³Î¿Ï‚ ÎµÎ³ÎºÎ±Ï„Î¬ÏƒÏ„Î±ÏƒÎ·Ï‚
2. `$XDG_BIN_DIR` - Î”Î¹Î±Î´ÏÎ¿Î¼Î® ÏƒÏ…Î¼Î²Î±Ï„Î® Î¼Îµ Ï„Î¹Ï‚ Ï€ÏÎ¿Î´Î¹Î±Î³ÏÎ±Ï†Î­Ï‚ XDG Base Directory
3. `$HOME/bin` - Î¤Ï…Ï€Î¹ÎºÏŒÏ‚ ÎºÎ±Ï„Î¬Î»Î¿Î³Î¿Ï‚ ÎµÎºÏ„ÎµÎ»Î­ÏƒÎ¹Î¼Ï‰Î½ Î±ÏÏ‡ÎµÎ¯Ï‰Î½ Ï‡ÏÎ®ÏƒÏ„Î· (ÎµÎ¬Î½ Ï…Ï€Î¬ÏÏ‡ÎµÎ¹ Î® Î¼Ï€Î¿ÏÎµÎ¯ Î½Î± Î´Î·Î¼Î¹Î¿Ï…ÏÎ³Î·Î¸ÎµÎ¯)
4. `$HOME/.voracode/bin` - Î ÏÎ¿ÎµÏ€Î¹Î»ÎµÎ³Î¼Î­Î½Î· ÎµÏ†ÎµÎ´ÏÎ¹ÎºÎ® Î´Î¹Î±Î´ÏÎ¿Î¼Î®

```bash
# Î Î±ÏÎ±Î´ÎµÎ¯Î³Î¼Î±Ï„Î±
VORACODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://voracode.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://voracode.ai/install | bash
```

### Î ÏÎ¬ÎºÏ„Î¿ÏÎµÏ‚

Î¤Î¿ Voracode Ï€ÎµÏÎ¹Î»Î±Î¼Î²Î¬Î½ÎµÎ¹ Î´ÏÎ¿ ÎµÎ½ÏƒÏ‰Î¼Î±Ï„Ï‰Î¼Î­Î½Î¿Ï…Ï‚ Ï€ÏÎ¬ÎºÏ„Î¿ÏÎµÏ‚ Î¼ÎµÏ„Î±Î¾Ï Ï„Ï‰Î½ Î¿Ï€Î¿Î¯Ï‰Î½ Î¼Ï€Î¿ÏÎµÎ¯Ï„Îµ Î½Î± ÎµÎ½Î±Î»Î»Î¬ÏƒÏƒÎµÏƒÏ„Îµ Î¼Îµ Ï„Î¿ Ï€Î»Î®ÎºÏ„ÏÎ¿ `Tab`.

- **build** - Î ÏÎ¿ÎµÏ€Î¹Î»ÎµÎ³Î¼Î­Î½Î¿Ï‚ Ï€ÏÎ¬ÎºÏ„Î¿ÏÎ±Ï‚ Î¼Îµ Ï€Î»Î®ÏÎ· Ï€ÏÏŒÏƒÎ²Î±ÏƒÎ· Î³Î¹Î± ÎµÏÎ³Î±ÏƒÎ¯Î± Ï€Î¬Î½Ï‰ ÏƒÎµ ÎºÏŽÎ´Î¹ÎºÎ±
- **plan** - Î ÏÎ¬ÎºÏ„Î¿ÏÎ±Ï‚ Î¼ÏŒÎ½Î¿ Î±Î½Î¬Î³Î½Ï‰ÏƒÎ·Ï‚ Î³Î¹Î± Î±Î½Î¬Î»Ï…ÏƒÎ· ÎºÎ±Î¹ ÎµÎ¾ÎµÏÎµÏÎ½Î·ÏƒÎ· ÎºÏŽÎ´Î¹ÎºÎ±
  - Î‘ÏÎ½ÎµÎ¯Ï„Î±Î¹ Ï„Î·Î½ ÎµÏ€ÎµÎ¾ÎµÏÎ³Î±ÏƒÎ¯Î± Î±ÏÏ‡ÎµÎ¯Ï‰Î½ Î±Ï€ÏŒ Ï€ÏÎ¿ÎµÏ€Î¹Î»Î¿Î³Î®
  - Î–Î·Ï„Î¬ Î¬Î´ÎµÎ¹Î± Ï€ÏÎ¹Î½ ÎµÎºÏ„ÎµÎ»Î­ÏƒÎµÎ¹ ÎµÎ½Ï„Î¿Î»Î­Ï‚ bash
  - Î™Î´Î±Î½Î¹ÎºÏŒÏ‚ Î³Î¹Î± ÎµÎ¾ÎµÏÎµÏÎ½Î·ÏƒÎ· Î¬Î³Î½Ï‰ÏƒÏ„Ï‰Î½ Î±ÏÏ‡ÎµÎ¯Ï‰Î½ Ï€Î·Î³Î±Î¯Î¿Ï… ÎºÏŽÎ´Î¹ÎºÎ± Î® ÏƒÏ‡ÎµÎ´Î¹Î±ÏƒÎ¼ÏŒ Î±Î»Î»Î±Î³ÏŽÎ½

Î ÎµÏÎ¹Î»Î±Î¼Î²Î¬Î½ÎµÏ„Î±Î¹ ÎµÏ€Î¯ÏƒÎ·Ï‚ Î­Î½Î±Ï‚ **general** Ï…Ï€Î¿Ï€ÏÎ¬ÎºÏ„Î¿ÏÎ±Ï‚ Î³Î¹Î± ÏƒÏÎ½Î¸ÎµÏ„ÎµÏ‚ Î±Î½Î±Î¶Î·Ï„Î®ÏƒÎµÎ¹Ï‚ ÎºÎ±Î¹ Ï€Î¿Î»Ï…Î²Î·Î¼Î±Ï„Î¹ÎºÎ­Ï‚ Î´Î¹ÎµÏÎ³Î±ÏƒÎ¯ÎµÏ‚.
Î§ÏÎ·ÏƒÎ¹Î¼Î¿Ï€Î¿Î¹ÎµÎ¯Ï„Î±Î¹ ÎµÏƒÏ‰Ï„ÎµÏÎ¹ÎºÎ¬ ÎºÎ±Î¹ Î¼Ï€Î¿ÏÎµÎ¯ Î½Î± ÎºÎ»Î·Î¸ÎµÎ¯ Ï‡ÏÎ·ÏƒÎ¹Î¼Î¿Ï€Î¿Î¹ÏŽÎ½Ï„Î±Ï‚ `@general` ÏƒÏ„Î± Î¼Î·Î½ÏÎ¼Î±Ï„Î±.

ÎœÎ¬Î¸ÎµÏ„Îµ Ï€ÎµÏÎ¹ÏƒÏƒÏŒÏ„ÎµÏÎ± Î³Î¹Î± Ï„Î¿Ï…Ï‚ [Ï€ÏÎ¬ÎºÏ„Î¿ÏÎµÏ‚](https://voracode.ai/docs/agents).

### ÎŸÎ´Î·Î³ÏŒÏ‚ Î§ÏÎ®ÏƒÎ·Ï‚

Î“Î¹Î± Ï€ÎµÏÎ¹ÏƒÏƒÏŒÏ„ÎµÏÎµÏ‚ Ï€Î»Î·ÏÎ¿Ï†Î¿ÏÎ¯ÎµÏ‚ ÏƒÏ‡ÎµÏ„Î¹ÎºÎ¬ Î¼Îµ Ï„Î· ÏÏÎ¸Î¼Î¹ÏƒÎ· Ï„Î¿Ï… Voracode, [**Ï€Î»Î¿Î·Î³Î®ÏƒÎ¿Ï… ÏƒÏ„Î¿Î½ Î¿Î´Î·Î³ÏŒ Ï‡ÏÎ®ÏƒÎ·Ï‚ Î¼Î±Ï‚**](https://voracode.ai/docs).

### Î£Ï…Î½ÎµÎ¹ÏƒÏ†Î¿ÏÎ¬

Î•Î¬Î½ ÎµÎ½Î´Î¹Î±Ï†Î­ÏÎµÏƒÎ±Î¹ Î½Î± ÏƒÏ…Î½ÎµÎ¹ÏƒÏ†Î­ÏÎµÎ¹Ï‚ ÏƒÏ„Î¿ Voracode, Î´Î¹Î±Î²Î¬ÏƒÏ„Îµ Ï„Î± [Î¿Î´Î·Î³ÏŒ Ï‡ÏÎ®ÏƒÎ·Ï‚ ÏƒÏ…Î½ÎµÎ¹ÏƒÏ†Î¿ÏÎ¬Ï‚](./CONTRIBUTING.md) Ï€ÏÎ¹Î½ Ï…Ï€Î¿Î²Î¬Î»ÎµÎ¹Ï‚ Î­Î½Î± pull request.

### Î”Î·Î¼Î¹Î¿Ï…ÏÎ³Î¯Î± Ï€Î¬Î½Ï‰ ÏƒÏ„Î¿ Voracode

Î•Î¬Î½ ÎµÏÎ³Î¬Î¶ÎµÏƒÎ±Î¹ ÏƒÎµ Î­Î½Î± Î­ÏÎ³Î¿ ÏƒÏ‡ÎµÏ„Î¹ÎºÏŒ Î¼Îµ Ï„Î¿ Voracode ÎºÎ±Î¹ Ï‡ÏÎ·ÏƒÎ¹Î¼Î¿Ï€Î¿Î¹ÎµÎ¯Ï„Îµ Ï„Î¿ "voracode" Ï‰Ï‚ Î¼Î­ÏÎ¿Ï‚ Ï„Î¿Ï… Î¿Î½ÏŒÎ¼Î±Ï„ÏŒÏ‚ Ï„Î¿Ï…, Î³Î¹Î± Ï€Î±ÏÎ¬Î´ÎµÎ¹Î³Î¼Î± "voracode-dashboard" Î® "voracode-mobile", Ï€ÏÏŒÏƒÎ¸ÎµÏƒÎµ Î¼Î¹Î± ÏƒÎ·Î¼ÎµÎ¯Ï‰ÏƒÎ· ÏƒÏ„Î¿ README ÏƒÎ±Ï‚ Î³Î¹Î± Î½Î± Î´Î¹ÎµÏ…ÎºÏÎ¹Î½Î¯ÏƒÎµÎ¹Ï‚ ÏŒÏ„Î¹ Î´ÎµÎ½ ÎµÎ¯Î½Î±Î¹ ÎºÎ±Ï„Î±ÏƒÎºÎµÏ…Î±ÏƒÎ¼Î­Î½Î¿ Î±Ï€ÏŒ Ï„Î·Î½ Î¿Î¼Î¬Î´Î± Ï„Î¿Ï… Voracode ÎºÎ±Î¹ Î´ÎµÎ½ Î­Ï‡ÎµÎ¹ ÎºÎ±Î¼Î¯Î± ÏƒÏ‡Î­ÏƒÎ· Î¼Îµ ÎµÎ¼Î¬Ï‚.

---

**Î“Î¯Î½Îµ Î¼Î­Î»Î¿Ï‚ Ï„Î·Ï‚ ÎºÎ¿Î¹Î½ÏŒÏ„Î·Ï„Î¬Ï‚ Î¼Î±Ï‚** [Discord](https://discord.gg/voracode) | [X.com](https://x.com/voracode)
