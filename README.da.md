<p align="center">
  <a href="https://voracode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Voracode logo">
    </picture>
  </a>
</p>
<p align="center">Den open source AI-kodeagent.</p>
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

### Installation

```bash
# YOLO
curl -fsSL https://voracode.ai/install | bash

# PakkehÃ¥ndteringer
npm i -g voracode-ai@latest        # eller bun/pnpm/yarn
scoop install voracode             # Windows
choco install voracode             # Windows
brew install mysterious75/tap/voracode # macOS og Linux (anbefalet, altid up to date)
brew install voracode              # macOS og Linux (officiel brew formula, opdateres sjÃ¦ldnere)
sudo pacman -S voracode            # Arch Linux (Stable)
paru -S voracode-bin               # Arch Linux (Latest from AUR)
mise use -g voracode               # alle OS
nix run nixpkgs#voracode           # eller github:mysterious75/voracode for nyeste dev-branch
```

> [!TIP]
> Fjern versioner Ã¦ldre end 0.1.x fÃ¸r installation.

### Desktop-app (BETA)

Voracode findes ogsÃ¥ som desktop-app. Download direkte fra [releases-siden](https://github.com/mysterious75/voracode/releases) eller [voracode.ai/download](https://voracode.ai/download).

| Platform              | Download                           |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `voracode-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `voracode-desktop-mac-x64.dmg`     |
| Windows               | `voracode-desktop-windows-x64.exe` |
| Linux                 | `.deb`, `.rpm`, eller AppImage     |

```bash
# macOS (Homebrew)
brew install --cask voracode-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/voracode-desktop
```

#### Installationsmappe

Installationsscriptet bruger fÃ¸lgende prioriteringsrÃ¦kkefÃ¸lge for installationsstien:

1. `$VORACODE_INSTALL_DIR` - Tilpasset installationsmappe
2. `$XDG_BIN_DIR` - Sti der fÃ¸lger XDG Base Directory Specification
3. `$HOME/bin` - Standard bruger-bin-mappe (hvis den findes eller kan oprettes)
4. `$HOME/.voracode/bin` - Standard fallback

```bash
# Eksempler
VORACODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://voracode.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://voracode.ai/install | bash
```

### Agents

Voracode har to indbyggede agents, som du kan skifte mellem med `Tab`-tasten.

- **build** - Standard, agent med fuld adgang til udviklingsarbejde
- **plan** - Skrivebeskyttet agent til analyse og kodeudforskning
  - Afviser filredigering som standard
  - SpÃ¸rger om tilladelse fÃ¸r bash-kommandoer
  - Ideel til at udforske ukendte kodebaser eller planlÃ¦gge Ã¦ndringer

Derudover findes der en **general**-subagent til komplekse sÃ¸gninger og flertrinsopgaver.
Den bruges internt og kan kaldes via `@general` i beskeder.

LÃ¦s mere om [agents](https://voracode.ai/docs/agents).

### Dokumentation

For mere info om konfiguration af Voracode, [**se vores docs**](https://voracode.ai/docs).

### Bidrag

Hvis du vil bidrage til Voracode, sÃ¥ lÃ¦s vores [contributing docs](./CONTRIBUTING.md) fÃ¸r du sender en pull request.

### Bygget pÃ¥ Voracode

Hvis du arbejder pÃ¥ et projekt der er relateret til Voracode og bruger "voracode" som en del af navnet; f.eks. "voracode-dashboard" eller "voracode-mobile", sÃ¥ tilfÃ¸j en note i din README, der tydeliggÃ¸r at projektet ikke er bygget af Voracode-teamet og ikke er tilknyttet os pÃ¥ nogen mÃ¥de.

---

**Bliv en del af vores community** [Discord](https://discord.gg/voracode) | [X.com](https://x.com/voracode)
