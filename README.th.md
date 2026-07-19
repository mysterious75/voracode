<p align="center">
  <a href="https://voracode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Voracode logo">
    </picture>
  </a>
</p>
<p align="center">à¹€à¸­à¹€à¸ˆà¸™à¸•à¹Œà¸à¸²à¸£à¹€à¸‚à¸µà¸¢à¸™à¹‚à¸„à¹‰à¸”à¸”à¹‰à¸§à¸¢ AI à¹à¸šà¸šà¹‚à¸­à¹€à¸žà¸™à¸‹à¸­à¸£à¹Œà¸ª</p>
<p align="center">
  <a href="https://voracode.ai/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/voracode-ai"><img alt="npm" src="https://img.shields.io/npm/v/voracode-ai?style=flat-square" /></a>
  <a href="https://github.com/mysterious75/voracode/actions/workflows/publish.yml"><img alt="à¸ªà¸–à¸²à¸™à¸°à¸à¸²à¸£à¸ªà¸£à¹‰à¸²à¸‡" src="https://img.shields.io/github/actions/workflow/status/mysterious75/voracode/publish.yml?style=flat-square&branch=dev" /></a>
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

### à¸à¸²à¸£à¸•à¸´à¸”à¸•à¸±à¹‰à¸‡

```bash
# YOLO
curl -fsSL https://voracode.ai/install | bash

# à¸•à¸±à¸§à¸ˆà¸±à¸”à¸à¸²à¸£à¹à¸žà¹‡à¸à¹€à¸à¸ˆ
npm i -g voracode-ai@latest        # à¸«à¸£à¸·à¸­ bun/pnpm/yarn
scoop install voracode             # Windows
choco install voracode             # Windows
brew install mysterious75/tap/voracode # macOS à¹à¸¥à¸° Linux (à¹à¸™à¸°à¸™à¸³ à¸­à¸±à¸›à¹€à¸”à¸•à¹€à¸ªà¸¡à¸­)
brew install voracode              # macOS à¹à¸¥à¸° Linux (brew formula à¸­à¸¢à¹ˆà¸²à¸‡à¹€à¸›à¹‡à¸™à¸—à¸²à¸‡à¸à¸²à¸£ à¸­à¸±à¸›à¹€à¸”à¸•à¸™à¹‰à¸­à¸¢à¸à¸§à¹ˆà¸²)
sudo pacman -S voracode            # Arch Linux (Stable)
paru -S voracode-bin               # Arch Linux (Latest from AUR)
mise use -g voracode               # à¸£à¸°à¸šà¸šà¸›à¸à¸´à¸šà¸±à¸•à¸´à¸à¸²à¸£à¹ƒà¸”à¸à¹‡à¹„à¸”à¹‰
nix run nixpkgs#voracode           # à¸«à¸£à¸·à¸­ github:mysterious75/voracode à¸ªà¸³à¸«à¸£à¸±à¸šà¸ªà¸²à¸‚à¸²à¸žà¸±à¸’à¸™à¸²à¸¥à¹ˆà¸²à¸ªà¸¸à¸”
```

> [!TIP]
> à¸¥à¸šà¹€à¸§à¸­à¸£à¹Œà¸Šà¸±à¸™à¸—à¸µà¹ˆà¹€à¸à¹ˆà¸²à¸à¸§à¹ˆà¸² 0.1.x à¸à¹ˆà¸­à¸™à¸•à¸´à¸”à¸•à¸±à¹‰à¸‡

### à¹à¸­à¸›à¸žà¸¥à¸´à¹€à¸„à¸Šà¸±à¸™à¹€à¸”à¸ªà¸à¹Œà¸—à¹‡à¸­à¸› (à¹€à¸šà¸•à¹‰à¸²)

Voracode à¸¡à¸µà¹ƒà¸«à¹‰à¹ƒà¸Šà¹‰à¸‡à¸²à¸™à¹€à¸›à¹‡à¸™à¹à¸­à¸›à¸žà¸¥à¸´à¹€à¸„à¸Šà¸±à¸™à¹€à¸”à¸ªà¸à¹Œà¸—à¹‡à¸­à¸› à¸”à¸²à¸§à¸™à¹Œà¹‚à¸«à¸¥à¸”à¹‚à¸”à¸¢à¸•à¸£à¸‡à¸ˆà¸²à¸ [à¸«à¸™à¹‰à¸²à¸£à¸¸à¹ˆà¸™](https://github.com/mysterious75/voracode/releases) à¸«à¸£à¸·à¸­ [voracode.ai/download](https://voracode.ai/download)

| à¹à¸žà¸¥à¸•à¸Ÿà¸­à¸£à¹Œà¸¡             | à¸”à¸²à¸§à¸™à¹Œà¹‚à¸«à¸¥à¸”                          |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `voracode-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `voracode-desktop-mac-x64.dmg`     |
| Windows               | `voracode-desktop-windows-x64.exe` |
| Linux                 | `.deb`, `.rpm`, à¸«à¸£à¸·à¸­ AppImage      |

```bash
# macOS (Homebrew)
brew install --cask voracode-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/voracode-desktop
```

#### à¹„à¸”à¹€à¸£à¸à¸—à¸­à¸£à¸µà¸à¸²à¸£à¸•à¸´à¸”à¸•à¸±à¹‰à¸‡

à¸ªà¸„à¸£à¸´à¸›à¸•à¹Œà¸à¸²à¸£à¸•à¸´à¸”à¸•à¸±à¹‰à¸‡à¸ˆà¸°à¹ƒà¸Šà¹‰à¸¥à¸³à¸”à¸±à¸šà¸„à¸§à¸²à¸¡à¸ªà¸³à¸„à¸±à¸à¸•à¸²à¸¡à¹€à¸ªà¹‰à¸™à¸—à¸²à¸‡à¸à¸²à¸£à¸•à¸´à¸”à¸•à¸±à¹‰à¸‡:

1. `$VORACODE_INSTALL_DIR` - à¹„à¸”à¹€à¸£à¸à¸—à¸­à¸£à¸µà¸à¸²à¸£à¸•à¸´à¸”à¸•à¸±à¹‰à¸‡à¸—à¸µà¹ˆà¸à¸³à¸«à¸™à¸”à¹€à¸­à¸‡
2. `$XDG_BIN_DIR` - à¹€à¸ªà¹‰à¸™à¸—à¸²à¸‡à¸—à¸µà¹ˆà¸ªà¸­à¸”à¸„à¸¥à¹‰à¸­à¸‡à¸à¸±à¸š XDG Base Directory Specification
3. `$HOME/bin` - à¹„à¸”à¹€à¸£à¸à¸—à¸­à¸£à¸µà¹„à¸šà¸™à¸²à¸£à¸µà¸œà¸¹à¹‰à¹ƒà¸Šà¹‰à¸¡à¸²à¸•à¸£à¸à¸²à¸™ (à¸«à¸²à¸à¸¡à¸µà¸­à¸¢à¸¹à¹ˆà¸«à¸£à¸·à¸­à¸ªà¸²à¸¡à¸²à¸£à¸–à¸ªà¸£à¹‰à¸²à¸‡à¹„à¸”à¹‰)
4. `$HOME/.voracode/bin` - à¸„à¹ˆà¸²à¸ªà¸³à¸£à¸­à¸‡à¹€à¸£à¸´à¹ˆà¸¡à¸•à¹‰à¸™

```bash
# à¸•à¸±à¸§à¸­à¸¢à¹ˆà¸²à¸‡
VORACODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://voracode.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://voracode.ai/install | bash
```

### à¹€à¸­à¹€à¸ˆà¸™à¸•à¹Œ

Voracode à¸£à¸§à¸¡à¹€à¸­à¹€à¸ˆà¸™à¸•à¹Œà¹ƒà¸™à¸•à¸±à¸§à¸ªà¸­à¸‡à¸•à¸±à¸§à¸—à¸µà¹ˆà¸„à¸¸à¸“à¸ªà¸²à¸¡à¸²à¸£à¸–à¸ªà¸¥à¸±à¸šà¹„à¸”à¹‰à¸”à¹‰à¸§à¸¢à¸›à¸¸à¹ˆà¸¡ `Tab`

- **build** - à¹€à¸­à¹€à¸ˆà¸™à¸•à¹Œà¹€à¸£à¸´à¹ˆà¸¡à¸•à¹‰à¸™ à¸¡à¸µà¸ªà¸´à¸—à¸˜à¸´à¹Œà¹€à¸‚à¹‰à¸²à¸–à¸¶à¸‡à¹à¸šà¸šà¹€à¸•à¹‡à¸¡à¸ªà¸³à¸«à¸£à¸±à¸šà¸‡à¸²à¸™à¸žà¸±à¸’à¸™à¸²
- **plan** - à¹€à¸­à¹€à¸ˆà¸™à¸•à¹Œà¸­à¹ˆà¸²à¸™à¸­à¸¢à¹ˆà¸²à¸‡à¹€à¸”à¸µà¸¢à¸§à¸ªà¸³à¸«à¸£à¸±à¸šà¸à¸²à¸£à¸§à¸´à¹€à¸„à¸£à¸²à¸°à¸«à¹Œà¹à¸¥à¸°à¸à¸²à¸£à¸ªà¸³à¸£à¸§à¸ˆà¹‚à¸„à¹‰à¸”
  - à¸›à¸à¸´à¹€à¸ªà¸˜à¸à¸²à¸£à¹à¸à¹‰à¹„à¸‚à¹„à¸Ÿà¸¥à¹Œà¹‚à¸”à¸¢à¸„à¹ˆà¸²à¹€à¸£à¸´à¹ˆà¸¡à¸•à¹‰à¸™
  - à¸‚à¸­à¸ªà¸´à¸—à¸˜à¸´à¹Œà¸à¹ˆà¸­à¸™à¹€à¸£à¸µà¸¢à¸à¹ƒà¸Šà¹‰à¸„à¸³à¸ªà¸±à¹ˆà¸‡ bash
  - à¹€à¸«à¸¡à¸²à¸°à¸ªà¸³à¸«à¸£à¸±à¸šà¸ªà¸³à¸£à¸§à¸ˆà¹‚à¸„à¹‰à¸”à¹€à¸šà¸ªà¸—à¸µà¹ˆà¹„à¸¡à¹ˆà¸„à¸¸à¹‰à¸™à¹€à¸„à¸¢à¸«à¸£à¸·à¸­à¸§à¸²à¸‡à¹à¸œà¸™à¸à¸²à¸£à¹€à¸›à¸¥à¸µà¹ˆà¸¢à¸™à¹à¸›à¸¥à¸‡

à¸™à¸­à¸à¸ˆà¸²à¸à¸™à¸µà¹‰à¸¢à¸±à¸‡à¸¡à¸µà¹€à¸­à¹€à¸ˆà¸™à¸•à¹Œà¸¢à¹ˆà¸­à¸¢ **general** à¸ªà¸³à¸«à¸£à¸±à¸šà¸à¸²à¸£à¸„à¹‰à¸™à¸«à¸²à¸—à¸µà¹ˆà¸‹à¸±à¸šà¸‹à¹‰à¸­à¸™à¹à¸¥à¸°à¸‡à¸²à¸™à¸«à¸¥à¸²à¸¢à¸‚à¸±à¹‰à¸™à¸•à¸­à¸™
à¹ƒà¸Šà¹‰à¸ à¸²à¸¢à¹ƒà¸™à¹à¸¥à¸°à¸ªà¸²à¸¡à¸²à¸£à¸–à¹€à¸£à¸µà¸¢à¸à¹ƒà¸Šà¹‰à¹„à¸”à¹‰à¹‚à¸”à¸¢à¹ƒà¸Šà¹‰ `@general` à¹ƒà¸™à¸‚à¹‰à¸­à¸„à¸§à¸²à¸¡

à¹€à¸£à¸µà¸¢à¸™à¸£à¸¹à¹‰à¹€à¸žà¸´à¹ˆà¸¡à¹€à¸•à¸´à¸¡à¹€à¸à¸µà¹ˆà¸¢à¸§à¸à¸±à¸š [à¹€à¸­à¹€à¸ˆà¸™à¸•à¹Œ](https://voracode.ai/docs/agents)

### à¹€à¸­à¸à¸ªà¸²à¸£à¸›à¸£à¸°à¸à¸­à¸š

à¸ªà¸³à¸«à¸£à¸±à¸šà¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¹€à¸žà¸´à¹ˆà¸¡à¹€à¸•à¸´à¸¡à¹€à¸à¸µà¹ˆà¸¢à¸§à¸à¸±à¸šà¸§à¸´à¸˜à¸µà¸à¸³à¸«à¸™à¸”à¸„à¹ˆà¸² Voracode [**à¹„à¸›à¸—à¸µà¹ˆà¹€à¸­à¸à¸ªà¸²à¸£à¸‚à¸­à¸‡à¹€à¸£à¸²**](https://voracode.ai/docs)

### à¸à¸²à¸£à¸¡à¸µà¸ªà¹ˆà¸§à¸™à¸£à¹ˆà¸§à¸¡

à¸«à¸²à¸à¸„à¸¸à¸“à¸ªà¸™à¹ƒà¸ˆà¸—à¸µà¹ˆà¸ˆà¸°à¸¡à¸µà¸ªà¹ˆà¸§à¸™à¸£à¹ˆà¸§à¸¡à¹ƒà¸™ Voracode à¹‚à¸›à¸£à¸”à¸­à¹ˆà¸²à¸™ [à¹€à¸­à¸à¸ªà¸²à¸£à¸à¸²à¸£à¸¡à¸µà¸ªà¹ˆà¸§à¸™à¸£à¹ˆà¸§à¸¡](./CONTRIBUTING.md) à¸à¹ˆà¸­à¸™à¸ªà¹ˆà¸‡ Pull Request

### à¸à¸²à¸£à¸ªà¸£à¹‰à¸²à¸‡à¸šà¸™ Voracode

à¸«à¸²à¸à¸„à¸¸à¸“à¸—à¸³à¸‡à¸²à¸™à¹ƒà¸™à¹‚à¸›à¸£à¹€à¸ˆà¸à¸•à¹Œà¸—à¸µà¹ˆà¹€à¸à¸µà¹ˆà¸¢à¸§à¸‚à¹‰à¸­à¸‡à¸à¸±à¸š Voracode à¹à¸¥à¸°à¹ƒà¸Šà¹‰ "voracode" à¹€à¸›à¹‡à¸™à¸ªà¹ˆà¸§à¸™à¸«à¸™à¸¶à¹ˆà¸‡à¸‚à¸­à¸‡à¸Šà¸·à¹ˆà¸­ à¹€à¸Šà¹ˆà¸™ "voracode-dashboard" à¸«à¸£à¸·à¸­ "voracode-mobile" à¹‚à¸›à¸£à¸”à¹€à¸žà¸´à¹ˆà¸¡à¸«à¸¡à¸²à¸¢à¹€à¸«à¸•à¸¸à¹ƒà¸™ README à¸‚à¸­à¸‡à¸„à¸¸à¸“à¹€à¸žà¸·à¹ˆà¸­à¸Šà¸µà¹‰à¹à¸ˆà¸‡à¸§à¹ˆà¸²à¹„à¸¡à¹ˆà¹„à¸”à¹‰à¸ªà¸£à¹‰à¸²à¸‡à¹‚à¸”à¸¢à¸—à¸µà¸¡ Voracode à¹à¸¥à¸°à¹„à¸¡à¹ˆà¹„à¸”à¹‰à¹€à¸à¸µà¹ˆà¸¢à¸§à¸‚à¹‰à¸­à¸‡à¸à¸±à¸šà¹€à¸£à¸²à¹ƒà¸™à¸—à¸²à¸‡à¹ƒà¸”

---

**à¸£à¹ˆà¸§à¸¡à¸Šà¸¸à¸¡à¸Šà¸™à¸‚à¸­à¸‡à¹€à¸£à¸²** [Discord](https://discord.gg/voracode) | [X.com](https://x.com/voracode)
