<p align="center">
  <a href="https://voracode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Voracode logo">
    </picture>
  </a>
</p>
<p align="center">ã‚ªãƒ¼ãƒ—ãƒ³ã‚½ãƒ¼ã‚¹ã®AIã‚³ãƒ¼ãƒ‡ã‚£ãƒ³ã‚°ã‚¨ãƒ¼ã‚¸ã‚§ãƒ³ãƒˆã€‚</p>
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

### ã‚¤ãƒ³ã‚¹ãƒˆãƒ¼ãƒ«

```bash
# YOLO
curl -fsSL https://voracode.ai/install | bash

# ãƒ‘ãƒƒã‚±ãƒ¼ã‚¸ãƒžãƒãƒ¼ã‚¸ãƒ£ãƒ¼
npm i -g voracode-ai@latest        # bun/pnpm/yarn ã§ã‚‚OK
scoop install voracode             # Windows
choco install voracode             # Windows
brew install mysterious75/tap/voracode # macOS ã¨ Linuxï¼ˆæŽ¨å¥¨ã€‚å¸¸ã«æœ€æ–°ï¼‰
brew install voracode              # macOS ã¨ Linuxï¼ˆå…¬å¼ brew formulaã€‚æ›´æ–°é »åº¦ã¯ä½Žã‚ï¼‰
sudo pacman -S voracode            # Arch Linux (Stable)
paru -S voracode-bin               # Arch Linux (Latest from AUR)
mise use -g voracode               # ã©ã®OSã§ã‚‚
nix run nixpkgs#voracode           # ã¾ãŸã¯ github:mysterious75/voracode ã§æœ€æ–° dev ãƒ–ãƒ©ãƒ³ãƒ
```

> [!TIP]
> ã‚¤ãƒ³ã‚¹ãƒˆãƒ¼ãƒ«å‰ã« 0.1.x ã‚ˆã‚Šå¤ã„ãƒãƒ¼ã‚¸ãƒ§ãƒ³ã‚’å‰Šé™¤ã—ã¦ãã ã•ã„ã€‚

### ãƒ‡ã‚¹ã‚¯ãƒˆãƒƒãƒ—ã‚¢ãƒ—ãƒª (BETA)

Voracode ã¯ãƒ‡ã‚¹ã‚¯ãƒˆãƒƒãƒ—ã‚¢ãƒ—ãƒªã¨ã—ã¦ã‚‚åˆ©ç”¨ã§ãã¾ã™ã€‚[releases page](https://github.com/mysterious75/voracode/releases) ã‹ã‚‰ç›´æŽ¥ãƒ€ã‚¦ãƒ³ãƒ­ãƒ¼ãƒ‰ã™ã‚‹ã‹ã€[voracode.ai/download](https://voracode.ai/download) ã‚’åˆ©ç”¨ã—ã¦ãã ã•ã„ã€‚

| ãƒ—ãƒ©ãƒƒãƒˆãƒ•ã‚©ãƒ¼ãƒ       | ãƒ€ã‚¦ãƒ³ãƒ­ãƒ¼ãƒ‰                       |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `voracode-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `voracode-desktop-mac-x64.dmg`     |
| Windows               | `voracode-desktop-windows-x64.exe` |
| Linux                 | `.deb`ã€`.rpm`ã€ã¾ãŸã¯ AppImage    |

```bash
# macOS (Homebrew)
brew install --cask voracode-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/voracode-desktop
```

#### ã‚¤ãƒ³ã‚¹ãƒˆãƒ¼ãƒ«ãƒ‡ã‚£ãƒ¬ã‚¯ãƒˆãƒª

ã‚¤ãƒ³ã‚¹ãƒˆãƒ¼ãƒ«ã‚¹ã‚¯ãƒªãƒ—ãƒˆã¯ã€ã‚¤ãƒ³ã‚¹ãƒˆãƒ¼ãƒ«å…ˆãƒ‘ã‚¹ã‚’æ¬¡ã®å„ªå…ˆé †ä½ã§æ±ºå®šã—ã¾ã™ã€‚

1. `$VORACODE_INSTALL_DIR` - ã‚«ã‚¹ã‚¿ãƒ ã®ã‚¤ãƒ³ã‚¹ãƒˆãƒ¼ãƒ«ãƒ‡ã‚£ãƒ¬ã‚¯ãƒˆãƒª
2. `$XDG_BIN_DIR` - XDG Base Directory Specification ã«æº–æ‹ ã—ãŸãƒ‘ã‚¹
3. `$HOME/bin` - æ¨™æº–ã®ãƒ¦ãƒ¼ã‚¶ãƒ¼ç”¨ãƒã‚¤ãƒŠãƒªãƒ‡ã‚£ãƒ¬ã‚¯ãƒˆãƒªï¼ˆå­˜åœ¨ã™ã‚‹å ´åˆã€ã¾ãŸã¯ä½œæˆã§ãã‚‹å ´åˆï¼‰
4. `$HOME/.voracode/bin` - ãƒ‡ãƒ•ã‚©ãƒ«ãƒˆã®ãƒ•ã‚©ãƒ¼ãƒ«ãƒãƒƒã‚¯

```bash
# ä¾‹
VORACODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://voracode.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://voracode.ai/install | bash
```

### Agents

Voracode ã«ã¯çµ„ã¿è¾¼ã¿ã® Agent ãŒ2ã¤ã‚ã‚Šã€`Tab` ã‚­ãƒ¼ã§åˆ‡ã‚Šæ›¿ãˆã‚‰ã‚Œã¾ã™ã€‚

- **build** - ãƒ‡ãƒ•ã‚©ãƒ«ãƒˆã€‚é–‹ç™ºå‘ã‘ã®ãƒ•ãƒ«ã‚¢ã‚¯ã‚»ã‚¹ Agent
- **plan** - åˆ†æžã¨ã‚³ãƒ¼ãƒ‰æŽ¢ç´¢å‘ã‘ã®èª­ã¿å–ã‚Šå°‚ç”¨ Agent
  - ãƒ‡ãƒ•ã‚©ãƒ«ãƒˆã§ãƒ•ã‚¡ã‚¤ãƒ«ç·¨é›†ã‚’æ‹’å¦
  - bash ã‚³ãƒžãƒ³ãƒ‰å®Ÿè¡Œå‰ã«ç¢ºèª
  - æœªçŸ¥ã®ã‚³ãƒ¼ãƒ‰ãƒ™ãƒ¼ã‚¹æŽ¢ç´¢ã‚„å¤‰æ›´è¨ˆç”»ã«æœ€é©

ã¾ãŸã€è¤‡é›‘ãªæ¤œç´¢ã‚„ãƒžãƒ«ãƒã‚¹ãƒ†ãƒƒãƒ—ã®ã‚¿ã‚¹ã‚¯å‘ã‘ã« **general** ã‚µãƒ– Agent ã‚‚å«ã¾ã‚Œã¦ã„ã¾ã™ã€‚
å†…éƒ¨çš„ã«ä½¿ç”¨ã•ã‚Œã¦ãŠã‚Šã€ãƒ¡ãƒƒã‚»ãƒ¼ã‚¸ã§ `@general` ã¨å…¥åŠ›ã—ã¦å‘¼ã³å‡ºã›ã¾ã™ã€‚

[agents](https://voracode.ai/docs/agents) ã®è©³ç´°ã¯ã“ã¡ã‚‰ã€‚

### ãƒ‰ã‚­ãƒ¥ãƒ¡ãƒ³ãƒˆ

Voracode ã®è¨­å®šã«ã¤ã„ã¦ã¯ [**ãƒ‰ã‚­ãƒ¥ãƒ¡ãƒ³ãƒˆ**](https://voracode.ai/docs) ã‚’å‚ç…§ã—ã¦ãã ã•ã„ã€‚

### ã‚³ãƒ³ãƒˆãƒªãƒ“ãƒ¥ãƒ¼ãƒˆ

Voracode ã«è²¢çŒ®ã—ãŸã„å ´åˆã¯ã€Pull Request ã‚’é€ã‚‹å‰ã« [contributing docs](./CONTRIBUTING.md) ã‚’èª­ã‚“ã§ãã ã•ã„ã€‚

### Voracode ã®ä¸Šã«æ§‹ç¯‰ã™ã‚‹

Voracode ã«é–¢é€£ã™ã‚‹ãƒ—ãƒ­ã‚¸ã‚§ã‚¯ãƒˆã§ã€åå‰ã« "voracode"ï¼ˆä¾‹: "voracode-dashboard" ã‚„ "voracode-mobile"ï¼‰ã‚’å«ã‚ã‚‹å ´åˆã¯ã€ãã®ãƒ—ãƒ­ã‚¸ã‚§ã‚¯ãƒˆãŒ Voracode ãƒãƒ¼ãƒ ã«ã‚ˆã£ã¦ä½œã‚‰ã‚ŒãŸã‚‚ã®ã§ã¯ãªãã€ã„ã‹ãªã‚‹å½¢ã§ã‚‚é–¢ä¿‚ãŒãªã„ã“ã¨ã‚’ README ã«æ˜Žè¨˜ã—ã¦ãã ã•ã„ã€‚

---

**ã‚³ãƒŸãƒ¥ãƒ‹ãƒ†ã‚£ã«å‚åŠ ** [Discord](https://discord.gg/voracode) | [X.com](https://x.com/voracode)
