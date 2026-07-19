<p align="center">
  <a href="https://voracode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Logo Voracode">
    </picture>
  </a>
</p>
<p align="center">L'agent de codage IA open source.</p>
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

# Gestionnaires de paquets
npm i -g voracode-ai@latest        # ou bun/pnpm/yarn
scoop install voracode             # Windows
choco install voracode             # Windows
brew install mysterious75/tap/voracode # macOS et Linux (recommandÃ©, toujours Ã  jour)
brew install voracode              # macOS et Linux (formule officielle brew, mise Ã  jour moins frÃ©quente)
sudo pacman -S voracode            # Arch Linux (Stable)
paru -S voracode-bin               # Arch Linux (Latest from AUR)
mise use -g voracode               # n'importe quel OS
nix run nixpkgs#voracode           # ou github:mysterious75/voracode pour la branche dev la plus rÃ©cente
```

> [!TIP]
> Supprimez les versions antÃ©rieures Ã  0.1.x avant d'installer.

### Application de bureau (BETA)

Voracode est aussi disponible en application de bureau. TÃ©lÃ©chargez-la directement depuis la [page des releases](https://github.com/mysterious75/voracode/releases) ou [voracode.ai/download](https://voracode.ai/download).

| Plateforme            | TÃ©lÃ©chargement                     |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `voracode-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `voracode-desktop-mac-x64.dmg`     |
| Windows               | `voracode-desktop-windows-x64.exe` |
| Linux                 | `.deb`, `.rpm`, ou AppImage        |

```bash
# macOS (Homebrew)
brew install --cask voracode-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/voracode-desktop
```

#### RÃ©pertoire d'installation

Le script d'installation respecte l'ordre de prioritÃ© suivant pour le chemin d'installation :

1. `$VORACODE_INSTALL_DIR` - RÃ©pertoire d'installation personnalisÃ©
2. `$XDG_BIN_DIR` - Chemin conforme Ã  la spÃ©cification XDG Base Directory
3. `$HOME/bin` - RÃ©pertoire binaire utilisateur standard (s'il existe ou peut Ãªtre crÃ©Ã©)
4. `$HOME/.voracode/bin` - Repli par dÃ©faut

```bash
# Exemples
VORACODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://voracode.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://voracode.ai/install | bash
```

### Agents

Voracode inclut deux agents intÃ©grÃ©s que vous pouvez basculer avec la touche `Tab`.

- **build** - Par dÃ©faut, agent avec accÃ¨s complet pour le travail de dÃ©veloppement
- **plan** - Agent en lecture seule pour l'analyse et l'exploration du code
  - Refuse les modifications de fichiers par dÃ©faut
  - Demande l'autorisation avant d'exÃ©cuter des commandes bash
  - IdÃ©al pour explorer une base de code inconnue ou planifier des changements

Un sous-agent **general** est aussi inclus pour les recherches complexes et les tÃ¢ches en plusieurs Ã©tapes.
Il est utilisÃ© en interne et peut Ãªtre invoquÃ© via `@general` dans les messages.

En savoir plus sur les [agents](https://voracode.ai/docs/agents).

### Documentation

Pour plus d'informations sur la configuration d'Voracode, [**consultez notre documentation**](https://voracode.ai/docs).

### Contribuer

Si vous souhaitez contribuer Ã  Voracode, lisez nos [docs de contribution](./CONTRIBUTING.md) avant de soumettre une pull request.

### Construire avec Voracode

Si vous travaillez sur un projet liÃ© Ã  Voracode et que vous utilisez "voracode" dans le nom du projet (par exemple, "voracode-dashboard" ou "voracode-mobile"), ajoutez une note dans votre README pour prÃ©ciser qu'il n'est pas construit par l'Ã©quipe Voracode et qu'il n'est pas affiliÃ© Ã  nous.

---

**Rejoignez notre communautÃ©** [Discord](https://discord.gg/voracode) | [X.com](https://x.com/voracode)
