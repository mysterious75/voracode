<p align="center">
  <a href="https://voracode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Voracode logo">
    </picture>
  </a>
</p>
<p align="center">é–‹æºçš„ AI Coding Agentã€‚</p>
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

### å®‰è£

```bash
# ç›´æŽ¥å®‰è£ (YOLO)
curl -fsSL https://voracode.ai/install | bash

# å¥—ä»¶ç®¡ç†å“¡
npm i -g voracode-ai@latest        # ä¹Ÿå¯ä½¿ç”¨ bun/pnpm/yarn
scoop install voracode             # Windows
choco install voracode             # Windows
brew install mysterious75/tap/voracode # macOS èˆ‡ Linuxï¼ˆæŽ¨è–¦ï¼Œå§‹çµ‚ä¿æŒæœ€æ–°ï¼‰
brew install voracode              # macOS èˆ‡ Linuxï¼ˆå®˜æ–¹ brew formulaï¼Œæ›´æ–°é »çŽ‡è¼ƒä½Žï¼‰
sudo pacman -S voracode            # Arch Linux (Stable)
paru -S voracode-bin               # Arch Linux (Latest from AUR)
mise use -g voracode               # ä»»ä½•ä½œæ¥­ç³»çµ±
nix run nixpkgs#voracode           # æˆ–ä½¿ç”¨ github:mysterious75/voracode ä»¥å–å¾—æœ€æ–°é–‹ç™¼åˆ†æ”¯
```

> [!TIP]
> å®‰è£å‰è«‹å…ˆç§»é™¤ 0.1.x ä»¥å‰çš„èˆŠç‰ˆæœ¬ã€‚

### æ¡Œé¢æ‡‰ç”¨ç¨‹å¼ (BETA)

Voracode ä¹Ÿæä¾›æ¡Œé¢ç‰ˆæ‡‰ç”¨ç¨‹å¼ã€‚æ‚¨å¯ä»¥ç›´æŽ¥å¾ž [ç™¼ä½ˆé é¢ (releases page)](https://github.com/mysterious75/voracode/releases) æˆ– [voracode.ai/download](https://voracode.ai/download) ä¸‹è¼‰ã€‚

| å¹³å°                  | ä¸‹è¼‰é€£çµ                           |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `voracode-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `voracode-desktop-mac-x64.dmg`     |
| Windows               | `voracode-desktop-windows-x64.exe` |
| Linux                 | `.deb`, `.rpm`, æˆ– AppImage        |

```bash
# macOS (Homebrew Cask)
brew install --cask voracode-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/voracode-desktop
```

#### å®‰è£ç›®éŒ„

å®‰è£è…³æœ¬æœƒä¾æ“šä»¥ä¸‹å„ªå…ˆé †åºæ±ºå®šå®‰è£è·¯å¾‘ï¼š

1. `$VORACODE_INSTALL_DIR` - è‡ªå®šç¾©å®‰è£ç›®éŒ„
2. `$XDG_BIN_DIR` - ç¬¦åˆ XDG åŸºç¤Žç›®éŒ„è¦ç¯„çš„è·¯å¾‘
3. `$HOME/bin` - æ¨™æº–ä½¿ç”¨è€…åŸ·è¡Œæª”ç›®éŒ„ (è‹¥å­˜åœ¨æˆ–å¯å»ºç«‹)
4. `$HOME/.voracode/bin` - é è¨­å‚™ç”¨è·¯å¾‘

```bash
# ç¯„ä¾‹
VORACODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://voracode.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://voracode.ai/install | bash
```

### Agents

Voracode å…§å»ºäº†å…©ç¨® Agentï¼Œæ‚¨å¯ä»¥ä½¿ç”¨ `Tab` éµå¿«é€Ÿåˆ‡æ›ã€‚

- **build** - é è¨­æ¨¡å¼ï¼Œå…·å‚™å®Œæ•´æ¬Šé™çš„ Agentï¼Œé©ç”¨æ–¼é–‹ç™¼å·¥ä½œã€‚
- **plan** - å”¯è®€æ¨¡å¼ï¼Œé©ç”¨æ–¼ç¨‹å¼ç¢¼åˆ†æžèˆ‡æŽ¢ç´¢ã€‚
  - é è¨­ç¦æ­¢ä¿®æ”¹æª”æ¡ˆã€‚
  - åŸ·è¡Œ bash æŒ‡ä»¤å‰æœƒè©¢å•æ¬Šé™ã€‚
  - éžå¸¸é©åˆç”¨ä¾†æŽ¢ç´¢é™Œç”Ÿçš„ç¨‹å¼ç¢¼åº«æˆ–è¦åŠƒè®Šæ›´ã€‚

æ­¤å¤–ï¼ŒVoracode é‚„åŒ…å«ä¸€å€‹ **general** å­ Agentï¼Œç”¨æ–¼è™•ç†è¤‡é›œæœå°‹èˆ‡å¤šæ­¥é©Ÿä»»å‹™ã€‚æ­¤ Agent ä¾›ç³»çµ±å…§éƒ¨ä½¿ç”¨ï¼Œäº¦å¯é€éŽåœ¨è¨Šæ¯ä¸­è¼¸å…¥ `@general` ä¾†å‘¼å«ã€‚

äº†è§£æ›´å¤šé—œæ–¼ [Agents](https://voracode.ai/docs/agents) çš„è³‡è¨Šã€‚

### ç·šä¸Šæ–‡ä»¶

é—œæ–¼å¦‚ä½•è¨­å®š Voracode çš„è©³ç´°è³‡è¨Šï¼Œè«‹åƒé–±æˆ‘å€‘çš„ [**å®˜æ–¹æ–‡ä»¶**](https://voracode.ai/docs)ã€‚

### åƒèˆ‡è²¢ç»

å¦‚æžœæ‚¨æœ‰èˆˆè¶£åƒèˆ‡ Voracode çš„é–‹ç™¼ï¼Œè«‹åœ¨æäº¤ Pull Request å‰å…ˆé–±è®€æˆ‘å€‘çš„ [è²¢ç»æŒ‡å— (Contributing Docs)](./CONTRIBUTING.md)ã€‚

### åŸºæ–¼ Voracode é€²è¡Œé–‹ç™¼

å¦‚æžœæ‚¨æ­£åœ¨é–‹ç™¼èˆ‡ Voracode ç›¸é—œçš„å°ˆæ¡ˆï¼Œä¸¦åœ¨åç¨±ä¸­ä½¿ç”¨äº† "voracode"ï¼ˆä¾‹å¦‚ "voracode-dashboard" æˆ– "voracode-mobile"ï¼‰ï¼Œè«‹åœ¨æ‚¨çš„ README ä¸­åŠ å…¥è²æ˜Žï¼Œèªªæ˜Žè©²å°ˆæ¡ˆä¸¦éžç”± Voracode åœ˜éšŠé–‹ç™¼ï¼Œä¸”èˆ‡æˆ‘å€‘æ²’æœ‰ä»»ä½•éš¸å±¬é—œä¿‚ã€‚

---

**åŠ å…¥æˆ‘å€‘çš„ç¤¾ç¾¤** [é£žä¹¦](https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=52ao9352-5623-4fa0-b7dd-3407c392c1af&qr_code=true) | [X.com](https://x.com/voracode)
