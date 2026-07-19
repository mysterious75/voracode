<p align="center">
  <a href="https://voracode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Voracode logo">
    </picture>
  </a>
</p>
<p align="center">ÐžÑ‚ÐºÑ€Ñ‹Ñ‚Ñ‹Ð¹ AI-Ð°Ð³ÐµÐ½Ñ‚ Ð´Ð»Ñ Ð¿Ñ€Ð¾Ð³Ñ€Ð°Ð¼Ð¼Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ.</p>
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

### Ð£ÑÑ‚Ð°Ð½Ð¾Ð²ÐºÐ°

```bash
# YOLO
curl -fsSL https://voracode.ai/install | bash

# ÐœÐµÐ½ÐµÐ´Ð¶ÐµÑ€Ñ‹ Ð¿Ð°ÐºÐµÑ‚Ð¾Ð²
npm i -g voracode-ai@latest        # Ð¸Ð»Ð¸ bun/pnpm/yarn
scoop install voracode             # Windows
choco install voracode             # Windows
brew install mysterious75/tap/voracode # macOS Ð¸ Linux (Ñ€ÐµÐºÐ¾Ð¼ÐµÐ½Ð´ÑƒÐµÐ¼, Ð²ÑÐµÐ³Ð´Ð° Ð°ÐºÑ‚ÑƒÐ°Ð»ÑŒÐ½Ð¾)
brew install voracode              # macOS Ð¸ Linux (Ð¾Ñ„Ð¸Ñ†Ð¸Ð°Ð»ÑŒÐ½Ð°Ñ Ñ„Ð¾Ñ€Ð¼ÑƒÐ»Ð° brew, Ð¾Ð±Ð½Ð¾Ð²Ð»ÑÐµÑ‚ÑÑ Ñ€ÐµÐ¶Ðµ)
sudo pacman -S voracode            # Arch Linux (Stable)
paru -S voracode-bin               # Arch Linux (Latest from AUR)
mise use -g voracode               # Ð»ÑŽÐ±Ð°Ñ ÐžÐ¡
nix run nixpkgs#voracode           # Ð¸Ð»Ð¸ github:mysterious75/voracode Ð´Ð»Ñ ÑÐ°Ð¼Ð¾Ð¹ ÑÐ²ÐµÐ¶ÐµÐ¹ Ð²ÐµÑ‚ÐºÐ¸ dev
```

> [!TIP]
> ÐŸÐµÑ€ÐµÐ´ ÑƒÑÑ‚Ð°Ð½Ð¾Ð²ÐºÐ¾Ð¹ ÑƒÐ´Ð°Ð»Ð¸Ñ‚Ðµ Ð²ÐµÑ€ÑÐ¸Ð¸ ÑÑ‚Ð°Ñ€ÑˆÐµ 0.1.x.

### Ð”ÐµÑÐºÑ‚Ð¾Ð¿Ð½Ð¾Ðµ Ð¿Ñ€Ð¸Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ (BETA)

Voracode Ñ‚Ð°ÐºÐ¶Ðµ Ð´Ð¾ÑÑ‚ÑƒÐ¿ÐµÐ½ ÐºÐ°Ðº Ð´ÐµÑÐºÑ‚Ð¾Ð¿Ð½Ð¾Ðµ Ð¿Ñ€Ð¸Ð»Ð¾Ð¶ÐµÐ½Ð¸Ðµ. Ð¡ÐºÐ°Ñ‡Ð°Ð¹Ñ‚Ðµ ÐµÐ³Ð¾ ÑÐ¾ [ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ñ‹ Ñ€ÐµÐ»Ð¸Ð·Ð¾Ð²](https://github.com/mysterious75/voracode/releases) Ð¸Ð»Ð¸ Ñ [voracode.ai/download](https://voracode.ai/download).

| ÐŸÐ»Ð°Ñ‚Ñ„Ð¾Ñ€Ð¼Ð°             | Ð—Ð°Ð³Ñ€ÑƒÐ·ÐºÐ°                           |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `voracode-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `voracode-desktop-mac-x64.dmg`     |
| Windows               | `voracode-desktop-windows-x64.exe` |
| Linux                 | `.deb`, `.rpm` Ð¸Ð»Ð¸ AppImage        |

```bash
# macOS (Homebrew)
brew install --cask voracode-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/voracode-desktop
```

#### ÐšÐ°Ñ‚Ð°Ð»Ð¾Ð³ ÑƒÑÑ‚Ð°Ð½Ð¾Ð²ÐºÐ¸

Ð¡ÐºÑ€Ð¸Ð¿Ñ‚ ÑƒÑÑ‚Ð°Ð½Ð¾Ð²ÐºÐ¸ Ð²Ñ‹Ð±Ð¸Ñ€Ð°ÐµÑ‚ Ð¿ÑƒÑ‚ÑŒ ÑƒÑÑ‚Ð°Ð½Ð¾Ð²ÐºÐ¸ Ð² ÑÐ»ÐµÐ´ÑƒÑŽÑ‰ÐµÐ¼ Ð¿Ð¾Ñ€ÑÐ´ÐºÐµ Ð¿Ñ€Ð¸Ð¾Ñ€Ð¸Ñ‚ÐµÑ‚Ð°:

1. `$VORACODE_INSTALL_DIR` - ÐŸÐ¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒÑÐºÐ¸Ð¹ ÐºÐ°Ñ‚Ð°Ð»Ð¾Ð³ ÑƒÑÑ‚Ð°Ð½Ð¾Ð²ÐºÐ¸
2. `$XDG_BIN_DIR` - ÐŸÑƒÑ‚ÑŒ, ÑÐ¾Ð²Ð¼ÐµÑÑ‚Ð¸Ð¼Ñ‹Ð¹ ÑÐ¾ ÑÐ¿ÐµÑ†Ð¸Ñ„Ð¸ÐºÐ°Ñ†Ð¸ÐµÐ¹ XDG Base Directory
3. `$HOME/bin` - Ð¡Ñ‚Ð°Ð½Ð´Ð°Ñ€Ñ‚Ð½Ñ‹Ð¹ ÐºÐ°Ñ‚Ð°Ð»Ð¾Ð³ Ð¿Ð¾Ð»ÑŒÐ·Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒÑÐºÐ¸Ñ… Ð±Ð¸Ð½Ð°Ñ€Ð½Ð¸ÐºÐ¾Ð² (ÐµÑÐ»Ð¸ ÑÑƒÑ‰ÐµÑÑ‚Ð²ÑƒÐµÑ‚ Ð¸Ð»Ð¸ Ð¼Ð¾Ð¶Ð½Ð¾ ÑÐ¾Ð·Ð´Ð°Ñ‚ÑŒ)
4. `$HOME/.voracode/bin` - Fallback Ð¿Ð¾ ÑƒÐ¼Ð¾Ð»Ñ‡Ð°Ð½Ð¸ÑŽ

```bash
# ÐŸÑ€Ð¸Ð¼ÐµÑ€Ñ‹
VORACODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://voracode.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://voracode.ai/install | bash
```

### Agents

Ð’ Voracode ÐµÑÑ‚ÑŒ Ð´Ð²Ð° Ð²ÑÑ‚Ñ€Ð¾ÐµÐ½Ð½Ñ‹Ñ… Ð°Ð³ÐµÐ½Ñ‚Ð°, Ð¼ÐµÐ¶Ð´Ñƒ ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ð¼Ð¸ Ð¼Ð¾Ð¶Ð½Ð¾ Ð¿ÐµÑ€ÐµÐºÐ»ÑŽÑ‡Ð°Ñ‚ÑŒÑÑ ÐºÐ»Ð°Ð²Ð¸ÑˆÐµÐ¹ `Tab`.

- **build** - ÐŸÐ¾ ÑƒÐ¼Ð¾Ð»Ñ‡Ð°Ð½Ð¸ÑŽ, Ð°Ð³ÐµÐ½Ñ‚ Ñ Ð¿Ð¾Ð»Ð½Ñ‹Ð¼ Ð´Ð¾ÑÑ‚ÑƒÐ¿Ð¾Ð¼ Ð´Ð»Ñ Ñ€Ð°Ð·Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ¸
- **plan** - ÐÐ³ÐµÐ½Ñ‚ Ñ‚Ð¾Ð»ÑŒÐºÐ¾ Ð´Ð»Ñ Ñ‡Ñ‚ÐµÐ½Ð¸Ñ Ð´Ð»Ñ Ð°Ð½Ð°Ð»Ð¸Ð·Ð° Ð¸ Ð¸Ð·ÑƒÑ‡ÐµÐ½Ð¸Ñ ÐºÐ¾Ð´Ð°
  - ÐŸÐ¾ ÑƒÐ¼Ð¾Ð»Ñ‡Ð°Ð½Ð¸ÑŽ Ð·Ð°Ð¿Ñ€ÐµÑ‰Ð°ÐµÑ‚ Ñ€ÐµÐ´Ð°ÐºÑ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ðµ Ñ„Ð°Ð¹Ð»Ð¾Ð²
  - Ð—Ð°Ð¿Ñ€Ð°ÑˆÐ¸Ð²Ð°ÐµÑ‚ Ñ€Ð°Ð·Ñ€ÐµÑˆÐµÐ½Ð¸Ðµ Ð¿ÐµÑ€ÐµÐ´ Ð²Ñ‹Ð¿Ð¾Ð»Ð½ÐµÐ½Ð¸ÐµÐ¼ bash-ÐºÐ¾Ð¼Ð°Ð½Ð´
  - Ð˜Ð´ÐµÐ°Ð»ÐµÐ½ Ð´Ð»Ñ Ð¸Ð·ÑƒÑ‡ÐµÐ½Ð¸Ñ Ð½ÐµÐ·Ð½Ð°ÐºÐ¾Ð¼Ñ‹Ñ… ÐºÐ¾Ð´Ð¾Ð²Ñ‹Ñ… Ð±Ð°Ð· Ð¸Ð»Ð¸ Ð¿Ð»Ð°Ð½Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð¸Ñ Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ð¹

Ð¢Ð°ÐºÐ¶Ðµ Ð²ÐºÐ»ÑŽÑ‡ÐµÐ½ ÑÐ°Ð±Ð°Ð³ÐµÐ½Ñ‚ **general** Ð´Ð»Ñ ÑÐ»Ð¾Ð¶Ð½Ñ‹Ñ… Ð¿Ð¾Ð¸ÑÐºÐ¾Ð² Ð¸ Ð¼Ð½Ð¾Ð³Ð¾ÑˆÐ°Ð³Ð¾Ð²Ñ‹Ñ… Ð·Ð°Ð´Ð°Ñ‡.
ÐžÐ½ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÑ‚ÑÑ Ð²Ð½ÑƒÑ‚Ñ€ÐµÐ½Ð½Ðµ Ð¸ Ð¼Ð¾Ð¶ÐµÑ‚ Ð±Ñ‹Ñ‚ÑŒ Ð²Ñ‹Ð·Ð²Ð°Ð½ Ð² ÑÐ¾Ð¾Ð±Ñ‰ÐµÐ½Ð¸ÑÑ… Ñ‡ÐµÑ€ÐµÐ· `@general`.

ÐŸÐ¾Ð´Ñ€Ð¾Ð±Ð½ÐµÐµ Ð¾Ð± [agents](https://voracode.ai/docs/agents).

### Ð”Ð¾ÐºÑƒÐ¼ÐµÐ½Ñ‚Ð°Ñ†Ð¸Ñ

Ð‘Ð¾Ð»ÑŒÑˆÐµ Ð¸Ð½Ñ„Ð¾Ñ€Ð¼Ð°Ñ†Ð¸Ð¸ Ð¾ Ñ‚Ð¾Ð¼, ÐºÐ°Ðº Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¸Ñ‚ÑŒ Voracode: [**Ð½Ð°ÑˆÐ¸ docs**](https://voracode.ai/docs).

### Ð’ÐºÐ»Ð°Ð´

Ð•ÑÐ»Ð¸ Ð²Ñ‹ Ñ…Ð¾Ñ‚Ð¸Ñ‚Ðµ Ð²Ð½ÐµÑÑ‚Ð¸ Ð²ÐºÐ»Ð°Ð´ Ð² Voracode, Ð¿Ñ€Ð¾Ñ‡Ð¸Ñ‚Ð°Ð¹Ñ‚Ðµ [contributing docs](./CONTRIBUTING.md) Ð¿ÐµÑ€ÐµÐ´ Ñ‚ÐµÐ¼, ÐºÐ°Ðº Ð¾Ñ‚Ð¿Ñ€Ð°Ð²Ð»ÑÑ‚ÑŒ pull request.

### Ð Ð°Ð·Ñ€Ð°Ð±Ð¾Ñ‚ÐºÐ° Ð½Ð° Ð±Ð°Ð·Ðµ Voracode

Ð•ÑÐ»Ð¸ Ð²Ñ‹ Ð´ÐµÐ»Ð°ÐµÑ‚Ðµ Ð¿Ñ€Ð¾ÐµÐºÑ‚, ÑÐ²ÑÐ·Ð°Ð½Ð½Ñ‹Ð¹ Ñ Voracode, Ð¸ Ð¸ÑÐ¿Ð¾Ð»ÑŒÐ·ÑƒÐµÑ‚Ðµ "voracode" ÐºÐ°Ðº Ñ‡Ð°ÑÑ‚ÑŒ Ð¸Ð¼ÐµÐ½Ð¸ (Ð½Ð°Ð¿Ñ€Ð¸Ð¼ÐµÑ€, "voracode-dashboard" Ð¸Ð»Ð¸ "voracode-mobile"), Ð´Ð¾Ð±Ð°Ð²ÑŒÑ‚Ðµ Ð¿Ñ€Ð¸Ð¼ÐµÑ‡Ð°Ð½Ð¸Ðµ Ð² README, Ñ‡Ñ‚Ð¾Ð±Ñ‹ ÑƒÑ‚Ð¾Ñ‡Ð½Ð¸Ñ‚ÑŒ, Ñ‡Ñ‚Ð¾ Ð¿Ñ€Ð¾ÐµÐºÑ‚ Ð½Ðµ ÑÐ¾Ð·Ð´Ð°Ð½ ÐºÐ¾Ð¼Ð°Ð½Ð´Ð¾Ð¹ Voracode Ð¸ Ð½Ðµ Ð°Ñ„Ñ„Ð¸Ð»Ð¸Ñ€Ð¾Ð²Ð°Ð½ Ñ Ð½Ð°Ð¼Ð¸.

---

**ÐŸÑ€Ð¸ÑÐ¾ÐµÐ´Ð¸Ð½ÑÐ¹Ñ‚ÐµÑÑŒ Ðº Ð½Ð°ÑˆÐµÐ¼Ñƒ ÑÐ¾Ð¾Ð±Ñ‰ÐµÑÑ‚Ð²Ñƒ** [Discord](https://discord.gg/voracode) | [X.com](https://x.com/voracode)
