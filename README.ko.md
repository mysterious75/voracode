<p align="center">
  <a href="https://voracode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Voracode logo">
    </picture>
  </a>
</p>
<p align="center">ì˜¤í”ˆ ì†ŒìŠ¤ AI ì½”ë”© ì—ì´ì „íŠ¸.</p>
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

### ì„¤ì¹˜

```bash
# YOLO
curl -fsSL https://voracode.ai/install | bash

# íŒ¨í‚¤ì§€ ë§¤ë‹ˆì €
npm i -g voracode-ai@latest        # bun/pnpm/yarn ë„ ê°€ëŠ¥
scoop install voracode             # Windows
choco install voracode             # Windows
brew install mysterious75/tap/voracode # macOS ë° Linux (ê¶Œìž¥, í•­ìƒ ìµœì‹ )
brew install voracode              # macOS ë° Linux (ê³µì‹ brew formula, ì—…ë°ì´íŠ¸ ë¹ˆë„ ë‚®ìŒ)
sudo pacman -S voracode            # Arch Linux (Stable)
paru -S voracode-bin               # Arch Linux (Latest from AUR)
mise use -g voracode               # ì–´ë–¤ OSë“ 
nix run nixpkgs#voracode           # ë˜ëŠ” github:mysterious75/voracode ë¡œ ìµœì‹  dev ë¸Œëžœì¹˜
```

> [!TIP]
> ì„¤ì¹˜ ì „ì— 0.1.x ë³´ë‹¤ ì˜¤ëž˜ëœ ë²„ì „ì„ ì œê±°í•˜ì„¸ìš”.

### ë°ìŠ¤í¬í†± ì•± (BETA)

Voracode ëŠ” ë°ìŠ¤í¬í†± ì•±ìœ¼ë¡œë„ ì œê³µë©ë‹ˆë‹¤. [releases page](https://github.com/mysterious75/voracode/releases) ì—ì„œ ì§ì ‘ ë‹¤ìš´ë¡œë“œí•˜ê±°ë‚˜ [voracode.ai/download](https://voracode.ai/download) ë¥¼ ì´ìš©í•˜ì„¸ìš”.

| í”Œëž«í¼                | ë‹¤ìš´ë¡œë“œ                           |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `voracode-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `voracode-desktop-mac-x64.dmg`     |
| Windows               | `voracode-desktop-windows-x64.exe` |
| Linux                 | `.deb`, `.rpm`, ë˜ëŠ” AppImage      |

```bash
# macOS (Homebrew)
brew install --cask voracode-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/voracode-desktop
```

#### ì„¤ì¹˜ ë””ë ‰í„°ë¦¬

ì„¤ì¹˜ ìŠ¤í¬ë¦½íŠ¸ëŠ” ì„¤ì¹˜ ê²½ë¡œë¥¼ ë‹¤ìŒ ìš°ì„ ìˆœìœ„ë¡œ ê²°ì •í•©ë‹ˆë‹¤.

1. `$VORACODE_INSTALL_DIR` - ì‚¬ìš©ìž ì§€ì • ì„¤ì¹˜ ë””ë ‰í„°ë¦¬
2. `$XDG_BIN_DIR` - XDG Base Directory Specification ì¤€ìˆ˜ ê²½ë¡œ
3. `$HOME/bin` - í‘œì¤€ ì‚¬ìš©ìž ë°”ì´ë„ˆë¦¬ ë””ë ‰í„°ë¦¬ (ì¡´ìž¬í•˜ê±°ë‚˜ ìƒì„± ê°€ëŠ¥í•  ê²½ìš°)
4. `$HOME/.voracode/bin` - ê¸°ë³¸ í´ë°±

```bash
# ì˜ˆì‹œ
VORACODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://voracode.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://voracode.ai/install | bash
```

### Agents

Voracode ì—ëŠ” ë‚´ìž¥ ì—ì´ì „íŠ¸ 2ê°œê°€ ìžˆìœ¼ë©° `Tab` í‚¤ë¡œ ì „í™˜í•  ìˆ˜ ìžˆìŠµë‹ˆë‹¤.

- **build** - ê¸°ë³¸ê°’, ê°œë°œ ìž‘ì—…ì„ ìœ„í•œ ì „ì²´ ê¶Œí•œ ì—ì´ì „íŠ¸
- **plan** - ë¶„ì„ ë° ì½”ë“œ íƒìƒ‰ì„ ìœ„í•œ ì½ê¸° ì „ìš© ì—ì´ì „íŠ¸
  - ê¸°ë³¸ì ìœ¼ë¡œ íŒŒì¼ íŽ¸ì§‘ì„ ê±°ë¶€
  - bash ëª…ë ¹ ì‹¤í–‰ ì „ì— ê¶Œí•œì„ ìš”ì²­
  - ë‚¯ì„  ì½”ë“œë² ì´ìŠ¤ë¥¼ íƒìƒ‰í•˜ê±°ë‚˜ ë³€ê²½ì„ ê³„íší•  ë•Œ ì í•©

ë˜í•œ ë³µìž¡í•œ ê²€ìƒ‰ê³¼ ì—¬ëŸ¬ ë‹¨ê³„ ìž‘ì—…ì„ ìœ„í•œ **general** ì„œë¸Œ ì—ì´ì „íŠ¸ê°€ í¬í•¨ë˜ì–´ ìžˆìŠµë‹ˆë‹¤.
ë‚´ë¶€ì ìœ¼ë¡œ ì‚¬ìš©ë˜ë©°, ë©”ì‹œì§€ì—ì„œ `@general` ë¡œ í˜¸ì¶œí•  ìˆ˜ ìžˆìŠµë‹ˆë‹¤.

[agents](https://voracode.ai/docs/agents) ì— ëŒ€í•´ ë” ì•Œì•„ë³´ì„¸ìš”.

### ë¬¸ì„œ

Voracode ì„¤ì •ì— ëŒ€í•œ ìžì„¸í•œ ë‚´ìš©ì€ [**ë¬¸ì„œ**](https://voracode.ai/docs) ë¥¼ ì°¸ê³ í•˜ì„¸ìš”.

### ê¸°ì—¬í•˜ê¸°

Voracode ì— ê¸°ì—¬í•˜ê³  ì‹¶ë‹¤ë©´, Pull Request ë¥¼ ì œì¶œí•˜ê¸° ì „ì— [contributing docs](./CONTRIBUTING.md) ë¥¼ ì½ì–´ì£¼ì„¸ìš”.

### Voracode ê¸°ë°˜ìœ¼ë¡œ ë§Œë“¤ê¸°

Voracode ì™€ ê´€ë ¨ëœ í”„ë¡œì íŠ¸ë¥¼ ì§„í–‰í•˜ë©´ì„œ ì´ë¦„ì— "voracode"(ì˜ˆ: "voracode-dashboard" ë˜ëŠ” "voracode-mobile") ë¥¼ í¬í•¨í•œë‹¤ë©´, README ì— í•´ë‹¹ í”„ë¡œì íŠ¸ê°€ Voracode íŒ€ì´ ë§Œë“  ê²ƒì´ ì•„ë‹ˆë©° ì–´ë–¤ ë°©ì‹ìœ¼ë¡œë„ ìš°ë¦¬ì™€ ì œíœ´ë˜ì–´ ìžˆì§€ ì•Šë‹¤ëŠ” ì ì„ ëª…ì‹œí•´ ì£¼ì„¸ìš”.

---

**ì»¤ë®¤ë‹ˆí‹°ì— ì°¸ì—¬í•˜ê¸°** [Discord](https://discord.gg/voracode) | [X.com](https://x.com/voracode)
