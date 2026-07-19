<p align="center">
  <a href="https://voracode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Voracode logo">
    </picture>
  </a>
</p>
<p align="center">AI-kodeagent med Ã¥pen kildekode.</p>
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

### Installasjon

```bash
# YOLO
curl -fsSL https://voracode.ai/install | bash

# PakkehÃ¥ndterere
npm i -g voracode-ai@latest        # eller bun/pnpm/yarn
scoop install voracode             # Windows
choco install voracode             # Windows
brew install mysterious75/tap/voracode # macOS og Linux (anbefalt, alltid oppdatert)
brew install voracode              # macOS og Linux (offisiell brew-formel, oppdateres sjeldnere)
sudo pacman -S voracode            # Arch Linux (Stable)
paru -S voracode-bin               # Arch Linux (Latest from AUR)
mise use -g voracode               # alle OS
nix run nixpkgs#voracode           # eller github:mysterious75/voracode for nyeste dev-branch
```

> [!TIP]
> Fjern versjoner eldre enn 0.1.x fÃ¸r du installerer.

### Desktop-app (BETA)

Voracode er ogsÃ¥ tilgjengelig som en desktop-app. Last ned direkte fra [releases-siden](https://github.com/mysterious75/voracode/releases) eller [voracode.ai/download](https://voracode.ai/download).

| Plattform             | Nedlasting                         |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `voracode-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `voracode-desktop-mac-x64.dmg`     |
| Windows               | `voracode-desktop-windows-x64.exe` |
| Linux                 | `.deb`, `.rpm` eller AppImage      |

```bash
# macOS (Homebrew)
brew install --cask voracode-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/voracode-desktop
```

#### Installasjonsmappe

Installasjonsskriptet bruker fÃ¸lgende prioritet for installasjonsstien:

1. `$VORACODE_INSTALL_DIR` - Egendefinert installasjonsmappe
2. `$XDG_BIN_DIR` - Sti som fÃ¸lger XDG Base Directory Specification
3. `$HOME/bin` - Standard brukerbinar-mappe (hvis den finnes eller kan opprettes)
4. `$HOME/.voracode/bin` - Standard fallback

```bash
# Eksempler
VORACODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://voracode.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://voracode.ai/install | bash
```

### Agents

Voracode har to innebygde agents du kan bytte mellom med `Tab`-tasten.

- **build** - Standard, agent med full tilgang for utviklingsarbeid
- **plan** - Skrivebeskyttet agent for analyse og kodeutforsking
  - Nekter filendringer som standard
  - SpÃ¸r om tillatelse fÃ¸r bash-kommandoer
  - Ideell for Ã¥ utforske ukjente kodebaser eller planlegge endringer

Det finnes ogsÃ¥ en **general**-subagent for komplekse sÃ¸k og flertrinnsoppgaver.
Den brukes internt og kan kalles via `@general` i meldinger.

Les mer om [agents](https://voracode.ai/docs/agents).

### Dokumentasjon

For mer info om hvordan du konfigurerer Voracode, [**se dokumentasjonen**](https://voracode.ai/docs).

### Bidra

Hvis du vil bidra til Voracode, les [contributing docs](./CONTRIBUTING.md) fÃ¸r du sender en pull request.

### Bygge pÃ¥ Voracode

Hvis du jobber med et prosjekt som er relatert til Voracode og bruker "voracode" som en del av navnet; for eksempel "voracode-dashboard" eller "voracode-mobile", legg inn en merknad i README som presiserer at det ikke er bygget av Voracode-teamet og ikke er tilknyttet oss pÃ¥ noen mÃ¥te.

---

**Bli med i fellesskapet** [Discord](https://discord.gg/voracode) | [X.com](https://x.com/voracode)
