<p align="center">
  <a href="https://voracode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Voracode logo">
    </picture>
  </a>
</p>
<p align="center">AI-Ð°Ð³ÐµÐ½Ñ‚ Ð´Ð»Ñ Ð¿Ñ€Ð¾Ð³Ñ€Ð°Ð¼ÑƒÐ²Ð°Ð½Ð½Ñ Ð· Ð²Ñ–Ð´ÐºÑ€Ð¸Ñ‚Ð¸Ð¼ ÐºÐ¾Ð´Ð¾Ð¼.</p>
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

### Ð’ÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð½Ñ

```bash
# YOLO
curl -fsSL https://voracode.ai/install | bash

# ÐœÐµÐ½ÐµÐ´Ð¶ÐµÑ€Ð¸ Ð¿Ð°ÐºÐµÑ‚Ñ–Ð²
npm i -g voracode-ai@latest        # Ð°Ð±Ð¾ bun/pnpm/yarn
scoop install voracode             # Windows
choco install voracode             # Windows
brew install mysterious75/tap/voracode # macOS Ñ– Linux (Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´Ð¾Ð²Ð°Ð½Ð¾, Ð·Ð°Ð²Ð¶Ð´Ð¸ Ð°ÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ð¾)
brew install voracode              # macOS Ñ– Linux (Ð¾Ñ„Ñ–Ñ†Ñ–Ð¹Ð½Ð° Ñ„Ð¾Ñ€Ð¼ÑƒÐ»Ð° Homebrew, Ð¾Ð½Ð¾Ð²Ð»ÑŽÑ”Ñ‚ÑŒÑÑ Ñ€Ñ–Ð´ÑˆÐµ)
sudo pacman -S voracode            # Arch Linux (Stable)
paru -S voracode-bin               # Arch Linux (Latest from AUR)
mise use -g voracode               # Ð‘ÑƒÐ´ÑŒ-ÑÐºÐ° ÐžÐ¡
nix run nixpkgs#voracode           # Ð°Ð±Ð¾ github:mysterious75/voracode Ð´Ð»Ñ Ð½Ð°Ð¹Ð½Ð¾Ð²Ñ–ÑˆÐ¾Ñ— dev-Ð³Ñ–Ð»ÐºÐ¸
```

> [!TIP]
> ÐŸÐµÑ€ÐµÐ´ Ð²ÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð½ÑÐ¼ Ð²Ð¸Ð´Ð°Ð»Ñ–Ñ‚ÑŒ Ð²ÐµÑ€ÑÑ–Ñ— ÑÑ‚Ð°Ñ€ÑˆÑ– Ð·Ð° 0.1.x.

### Ð”ÐµÑÐºÑ‚Ð¾Ð¿Ð½Ð¸Ð¹ Ð·Ð°ÑÑ‚Ð¾ÑÑƒÐ½Ð¾Ðº (BETA)

Voracode Ñ‚Ð°ÐºÐ¾Ð¶ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¸Ð¹ ÑÐº Ð´ÐµÑÐºÑ‚Ð¾Ð¿Ð½Ð¸Ð¹ Ð·Ð°ÑÑ‚Ð¾ÑÑƒÐ½Ð¾Ðº. Ð—Ð°Ð²Ð°Ð½Ñ‚Ð°Ð¶ÑƒÐ¹Ñ‚Ðµ Ð½Ð°Ð¿Ñ€ÑÐ¼Ñƒ Ð·Ñ– [ÑÑ‚Ð¾Ñ€Ñ–Ð½ÐºÐ¸ Ñ€ÐµÐ»Ñ–Ð·Ñ–Ð²](https://github.com/mysterious75/voracode/releases) Ð°Ð±Ð¾ [voracode.ai/download](https://voracode.ai/download).

| ÐŸÐ»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ð°             | Ð—Ð°Ð²Ð°Ð½Ñ‚Ð°Ð¶ÐµÐ½Ð½Ñ                       |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `voracode-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `voracode-desktop-mac-x64.dmg`     |
| Windows               | `voracode-desktop-windows-x64.exe` |
| Linux                 | `.deb`, `.rpm` Ð°Ð±Ð¾ AppImage        |

```bash
# macOS (Homebrew)
brew install --cask voracode-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/voracode-desktop
```

#### ÐšÐ°Ñ‚Ð°Ð»Ð¾Ð³ Ð²ÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð½Ñ

Ð¡ÐºÑ€Ð¸Ð¿Ñ‚ Ð²ÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð½Ñ Ð´Ð¾Ñ‚Ñ€Ð¸Ð¼ÑƒÑ”Ñ‚ÑŒÑÑ Ñ‚Ð°ÐºÐ¾Ð³Ð¾ Ð¿Ð¾Ñ€ÑÐ´ÐºÑƒ Ð¿Ñ€Ñ–Ð¾Ñ€Ð¸Ñ‚ÐµÑ‚Ñƒ Ð´Ð»Ñ ÑˆÐ»ÑÑ…Ñƒ Ð²ÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð½Ñ:

1. `$VORACODE_INSTALL_DIR` - ÐšÐ¾Ñ€Ð¸ÑÑ‚ÑƒÐ²Ð°Ñ†ÑŒÐºÐ¸Ð¹ ÐºÐ°Ñ‚Ð°Ð»Ð¾Ð³ Ð²ÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð½Ñ
2. `$XDG_BIN_DIR` - Ð¨Ð»ÑÑ…, ÑÑƒÐ¼Ñ–ÑÐ½Ð¸Ð¹ Ð·Ñ– ÑÐ¿ÐµÑ†Ð¸Ñ„Ñ–ÐºÐ°Ñ†Ñ–Ñ”ÑŽ XDG Base Directory
3. `$HOME/bin` - Ð¡Ñ‚Ð°Ð½Ð´Ð°Ñ€Ñ‚Ð½Ð¸Ð¹ ÐºÐ°Ñ‚Ð°Ð»Ð¾Ð³ ÐºÐ¾Ñ€Ð¸ÑÑ‚ÑƒÐ²Ð°Ñ†ÑŒÐºÐ¸Ñ… Ð±Ñ–Ð½Ð°Ñ€Ð½Ð¸ÐºÑ–Ð² (ÑÐºÑ‰Ð¾ Ñ–ÑÐ½ÑƒÑ” Ð°Ð±Ð¾ Ð¹Ð¾Ð³Ð¾ Ð¼Ð¾Ð¶Ð½Ð° ÑÑ‚Ð²Ð¾Ñ€Ð¸Ñ‚Ð¸)
4. `$HOME/.voracode/bin` - Ð ÐµÐ·ÐµÑ€Ð²Ð½Ð¸Ð¹ Ð²Ð°Ñ€Ñ–Ð°Ð½Ñ‚ Ð·Ð° Ð·Ð°Ð¼Ð¾Ð²Ñ‡ÑƒÐ²Ð°Ð½Ð½ÑÐ¼

```bash
# ÐŸÑ€Ð¸ÐºÐ»Ð°Ð´Ð¸
VORACODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://voracode.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://voracode.ai/install | bash
```

### ÐÐ³ÐµÐ½Ñ‚Ð¸

Voracode Ð¼Ñ–ÑÑ‚Ð¸Ñ‚ÑŒ Ð´Ð²Ð° Ð²Ð±ÑƒÐ´Ð¾Ð²Ð°Ð½Ñ– Ð°Ð³ÐµÐ½Ñ‚Ð¸, Ð¼Ñ–Ð¶ ÑÐºÐ¸Ð¼Ð¸ Ð¼Ð¾Ð¶Ð½Ð° Ð¿ÐµÑ€ÐµÐ¼Ð¸ÐºÐ°Ñ‚Ð¸ÑÑ ÐºÐ»Ð°Ð²Ñ–ÑˆÐµÑŽ `Tab`.

- **build** - ÐÐ³ÐµÐ½Ñ‚ Ð·Ð° Ð·Ð°Ð¼Ð¾Ð²Ñ‡ÑƒÐ²Ð°Ð½Ð½ÑÐ¼ Ñ–Ð· Ð¿Ð¾Ð²Ð½Ð¸Ð¼ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð¾Ð¼ Ð´Ð»Ñ Ð·Ð°Ð²Ð´Ð°Ð½ÑŒ Ñ€Ð¾Ð·Ñ€Ð¾Ð±ÐºÐ¸
- **plan** - ÐÐ³ÐµÐ½Ñ‚ Ð»Ð¸ÑˆÐµ Ð´Ð»Ñ Ñ‡Ð¸Ñ‚Ð°Ð½Ð½Ñ Ð´Ð»Ñ Ð°Ð½Ð°Ð»Ñ–Ð·Ñƒ Ñ‚Ð° Ð´Ð¾ÑÐ»Ñ–Ð´Ð¶ÐµÐ½Ð½Ñ ÐºÐ¾Ð´Ñƒ
  - Ð—Ð° Ð·Ð°Ð¼Ð¾Ð²Ñ‡ÑƒÐ²Ð°Ð½Ð½ÑÐ¼ Ð·Ð°Ð±Ð¾Ñ€Ð¾Ð½ÑÑ” Ñ€ÐµÐ´Ð°Ð³ÑƒÐ²Ð°Ð½Ð½Ñ Ñ„Ð°Ð¹Ð»Ñ–Ð²
  - Ð—Ð°Ð¿Ð¸Ñ‚ÑƒÑ” Ð´Ð¾Ð·Ð²Ñ–Ð» Ð¿ÐµÑ€ÐµÐ´ Ð·Ð°Ð¿ÑƒÑÐºÐ¾Ð¼ bash-ÐºÐ¾Ð¼Ð°Ð½Ð´
  - Ð†Ð´ÐµÐ°Ð»ÑŒÐ½Ð¾ Ð¿Ñ–Ð´Ñ…Ð¾Ð´Ð¸Ñ‚ÑŒ Ð´Ð»Ñ Ð´Ð¾ÑÐ»Ñ–Ð´Ð¶ÐµÐ½Ð½Ñ Ð½ÐµÐ·Ð½Ð°Ð¹Ð¾Ð¼Ð¸Ñ… ÐºÐ¾Ð´Ð¾Ð²Ð¸Ñ… Ð±Ð°Ð· Ð°Ð±Ð¾ Ð¿Ð»Ð°Ð½ÑƒÐ²Ð°Ð½Ð½Ñ Ð·Ð¼Ñ–Ð½

Ð¢Ð°ÐºÐ¾Ð¶ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð½Ð¸Ð¹ Ð´Ð¾Ð¿Ð¾Ð¼Ñ–Ð¶Ð½Ð¸Ð¹ Ð°Ð³ÐµÐ½Ñ‚ **general** Ð´Ð»Ñ ÑÐºÐ»Ð°Ð´Ð½Ð¾Ð³Ð¾ Ð¿Ð¾ÑˆÑƒÐºÑƒ Ñ‚Ð° Ð±Ð°Ð³Ð°Ñ‚Ð¾ÐºÑ€Ð¾ÐºÐ¾Ð²Ð¸Ñ… Ð·Ð°Ð²Ð´Ð°Ð½ÑŒ.
Ð’Ñ–Ð½ Ð²Ð¸ÐºÐ¾Ñ€Ð¸ÑÑ‚Ð¾Ð²ÑƒÑ”Ñ‚ÑŒÑÑ Ð²ÑÐµÑ€ÐµÐ´Ð¸Ð½Ñ– ÑÐ¸ÑÑ‚ÐµÐ¼Ð¸ Ð¹ Ð¼Ð¾Ð¶Ðµ Ð±ÑƒÑ‚Ð¸ Ð²Ð¸ÐºÐ»Ð¸ÐºÐ°Ð½Ð¸Ð¹ Ñƒ Ð¿Ð¾Ð²Ñ–Ð´Ð¾Ð¼Ð»ÐµÐ½Ð½ÑÑ… Ñ‡ÐµÑ€ÐµÐ· `@general`.

Ð”Ñ–Ð·Ð½Ð°Ð¹Ñ‚ÐµÑÑ Ð±Ñ–Ð»ÑŒÑˆÐµ Ð¿Ñ€Ð¾ [agents](https://voracode.ai/docs/agents).

### Ð”Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð°Ñ†Ñ–Ñ

Ð©Ð¾Ð± Ð´Ñ–Ð·Ð½Ð°Ñ‚Ð¸ÑÑ Ð±Ñ–Ð»ÑŒÑˆÐµ Ð¿Ñ€Ð¾ Ð½Ð°Ð»Ð°ÑˆÑ‚ÑƒÐ²Ð°Ð½Ð½Ñ Voracode, [**Ð¿ÐµÑ€ÐµÐ¹Ð´Ñ–Ñ‚ÑŒ Ð´Ð¾ Ð½Ð°ÑˆÐ¾Ñ— Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð°Ñ†Ñ–Ñ—**](https://voracode.ai/docs).

### Ð’Ð½ÐµÑÐ¾Ðº

Ð¯ÐºÑ‰Ð¾ Ð²Ð¸ Ñ…Ð¾Ñ‡ÐµÑ‚Ðµ Ð·Ñ€Ð¾Ð±Ð¸Ñ‚Ð¸ Ð²Ð½ÐµÑÐ¾Ðº Ð² Voracode, Ð±ÑƒÐ´ÑŒ Ð»Ð°ÑÐºÐ°, Ð¿Ñ€Ð¾Ñ‡Ð¸Ñ‚Ð°Ð¹Ñ‚Ðµ Ð½Ð°ÑˆÑƒ [Ð´Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð°Ñ†Ñ–ÑŽ Ð´Ð»Ñ ÐºÐ¾Ð½Ñ‚Ñ€Ð¸Ð±'ÑŽÑ‚Ð¾Ñ€Ñ–Ð²](./CONTRIBUTING.md) Ð¿ÐµÑ€ÐµÐ´ Ð½Ð°Ð´ÑÐ¸Ð»Ð°Ð½Ð½ÑÐ¼ pull request.

### ÐŸÑ€Ð¾Ñ”ÐºÑ‚Ð¸ Ð½Ð° Ð±Ð°Ð·Ñ– Voracode

Ð¯ÐºÑ‰Ð¾ Ð²Ð¸ Ð¿Ñ€Ð°Ñ†ÑŽÑ”Ñ‚Ðµ Ð½Ð°Ð´ Ð¿Ñ€Ð¾Ñ”ÐºÑ‚Ð¾Ð¼, Ð¿Ð¾Ð²'ÑÐ·Ð°Ð½Ð¸Ð¼ Ð· Voracode, Ñ– Ð²Ð¸ÐºÐ¾Ñ€Ð¸ÑÑ‚Ð¾Ð²ÑƒÑ”Ñ‚Ðµ "voracode" Ñƒ Ð½Ð°Ð·Ð²Ñ–, Ð½Ð°Ð¿Ñ€Ð¸ÐºÐ»Ð°Ð´ "voracode-dashboard" Ð°Ð±Ð¾ "voracode-mobile", Ð´Ð¾Ð´Ð°Ð¹Ñ‚Ðµ Ð¿Ñ€Ð¸Ð¼Ñ–Ñ‚ÐºÑƒ Ð´Ð¾ ÑÐ²Ð¾Ð³Ð¾ README.
Ð£Ñ‚Ð¾Ñ‡Ð½Ñ–Ñ‚ÑŒ, Ñ‰Ð¾ Ñ†ÐµÐ¹ Ð¿Ñ€Ð¾Ñ”ÐºÑ‚ Ð½Ðµ ÑÑ‚Ð²Ð¾Ñ€ÐµÐ½Ð¸Ð¹ ÐºÐ¾Ð¼Ð°Ð½Ð´Ð¾ÑŽ Voracode Ñ– Ð¶Ð¾Ð´Ð½Ð¸Ð¼ Ñ‡Ð¸Ð½Ð¾Ð¼ Ð½Ðµ Ð°Ñ„Ñ–Ð»Ñ–Ð¹Ð¾Ð²Ð°Ð½Ð¸Ð¹ Ñ–Ð· Ð½Ð°Ð¼Ð¸.

---

**ÐŸÑ€Ð¸Ñ”Ð´Ð½ÑƒÐ¹Ñ‚ÐµÑÑ Ð´Ð¾ Ð½Ð°ÑˆÐ¾Ñ— ÑÐ¿Ñ–Ð»ÑŒÐ½Ð¾Ñ‚Ð¸** [Discord](https://discord.gg/voracode) | [X.com](https://x.com/voracode)
