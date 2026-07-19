<p align="center">
  <a href="https://voracode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Voracode logo">
    </picture>
  </a>
</p>
<p align="center">å¼€æºçš„ AI Coding Agentã€‚</p>
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

### å®‰è£…

```bash
# ç›´æŽ¥å®‰è£… (YOLO)
curl -fsSL https://voracode.ai/install | bash

# è½¯ä»¶åŒ…ç®¡ç†å™¨
npm i -g voracode-ai@latest        # ä¹Ÿå¯ä½¿ç”¨ bun/pnpm/yarn
scoop install voracode             # Windows
choco install voracode             # Windows
brew install mysterious75/tap/voracode # macOS å’Œ Linuxï¼ˆæŽ¨èï¼Œå§‹ç»ˆä¿æŒæœ€æ–°ï¼‰
brew install voracode              # macOS å’Œ Linuxï¼ˆå®˜æ–¹ brew formulaï¼Œæ›´æ–°é¢‘çŽ‡è¾ƒä½Žï¼‰
sudo pacman -S voracode            # Arch Linux (Stable)
paru -S voracode-bin               # Arch Linux (Latest from AUR)
mise use -g voracode               # ä»»æ„ç³»ç»Ÿ
nix run nixpkgs#voracode           # æˆ–ç”¨ github:mysterious75/voracode èŽ·å–æœ€æ–° dev åˆ†æ”¯
```

> [!TIP]
> å®‰è£…å‰è¯·å…ˆç§»é™¤ 0.1.x ä¹‹å‰çš„æ—§ç‰ˆæœ¬ã€‚

### æ¡Œé¢åº”ç”¨ç¨‹åº (BETA)

Voracode ä¹Ÿæä¾›æ¡Œé¢ç‰ˆåº”ç”¨ã€‚å¯ç›´æŽ¥ä»Ž [å‘å¸ƒé¡µ (releases page)](https://github.com/mysterious75/voracode/releases) æˆ– [voracode.ai/download](https://voracode.ai/download) ä¸‹è½½ã€‚

| å¹³å°                  | ä¸‹è½½æ–‡ä»¶                           |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `voracode-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `voracode-desktop-mac-x64.dmg`     |
| Windows               | `voracode-desktop-windows-x64.exe` |
| Linux                 | `.deb`ã€`.rpm` æˆ– AppImage         |

```bash
# macOS (Homebrew Cask)
brew install --cask voracode-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/voracode-desktop
```

#### å®‰è£…ç›®å½•

å®‰è£…è„šæœ¬æŒ‰ç…§ä»¥ä¸‹ä¼˜å…ˆçº§å†³å®šå®‰è£…è·¯å¾„ï¼š

1. `$VORACODE_INSTALL_DIR` - è‡ªå®šä¹‰å®‰è£…ç›®å½•
2. `$XDG_BIN_DIR` - ç¬¦åˆ XDG åŸºç¡€ç›®å½•è§„èŒƒçš„è·¯å¾„
3. `$HOME/bin` - å¦‚æžœå­˜åœ¨æˆ–å¯åˆ›å»ºçš„ç”¨æˆ·äºŒè¿›åˆ¶ç›®å½•
4. `$HOME/.voracode/bin` - é»˜è®¤å¤‡ç”¨è·¯å¾„

```bash
# ç¤ºä¾‹
VORACODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://voracode.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://voracode.ai/install | bash
```

### Agents

Voracode å†…ç½®ä¸¤ç§ Agentï¼Œå¯ç”¨ `Tab` é”®å¿«é€Ÿåˆ‡æ¢ï¼š

- **build** - é»˜è®¤æ¨¡å¼ï¼Œå…·å¤‡å®Œæ•´æƒé™ï¼Œé€‚åˆå¼€å‘å·¥ä½œ
- **plan** - åªè¯»æ¨¡å¼ï¼Œé€‚åˆä»£ç åˆ†æžä¸ŽæŽ¢ç´¢
  - é»˜è®¤æ‹’ç»ä¿®æ”¹æ–‡ä»¶
  - è¿è¡Œ bash å‘½ä»¤å‰ä¼šè¯¢é—®
  - ä¾¿äºŽæŽ¢ç´¢æœªçŸ¥ä»£ç åº“æˆ–è§„åˆ’æ”¹åŠ¨

å¦å¤–è¿˜åŒ…å«ä¸€ä¸ª **general** å­ Agentï¼Œç”¨äºŽå¤æ‚æœç´¢å’Œå¤šæ­¥ä»»åŠ¡ï¼Œå†…éƒ¨ä½¿ç”¨ï¼Œä¹Ÿå¯åœ¨æ¶ˆæ¯ä¸­è¾“å…¥ `@general` è°ƒç”¨ã€‚

äº†è§£æ›´å¤š [Agents](https://voracode.ai/docs/agents) ç›¸å…³ä¿¡æ¯ã€‚

### æ–‡æ¡£

æ›´å¤šé…ç½®è¯´æ˜Žè¯·æŸ¥çœ‹æˆ‘ä»¬çš„ [**å®˜æ–¹æ–‡æ¡£**](https://voracode.ai/docs)ã€‚

### å‚ä¸Žè´¡çŒ®

å¦‚æœ‰å…´è¶£è´¡çŒ®ä»£ç ï¼Œè¯·åœ¨æäº¤ PR å‰é˜…è¯» [è´¡çŒ®æŒ‡å— (Contributing Docs)](./CONTRIBUTING.md)ã€‚

### åŸºäºŽ Voracode è¿›è¡Œå¼€å‘

å¦‚æžœä½ åœ¨é¡¹ç›®åä¸­ä½¿ç”¨äº† â€œvoracodeâ€ï¼ˆå¦‚ â€œvoracode-dashboardâ€ æˆ– â€œvoracode-mobileâ€ï¼‰ï¼Œè¯·åœ¨ README é‡Œæ³¨æ˜Žè¯¥é¡¹ç›®ä¸æ˜¯ Voracode å›¢é˜Ÿå®˜æ–¹å¼€å‘ï¼Œä¸”ä¸å­˜åœ¨éš¶å±žå…³ç³»ã€‚

---

**åŠ å…¥æˆ‘ä»¬çš„ç¤¾åŒº** [é£žä¹¦](https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=52ao9352-5623-4fa0-b7dd-3407c392c1af&qr_code=true) | [X.com](https://x.com/voracode)
