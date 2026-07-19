<p align="center">
  <a href="https://voracode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Voracode logo">
    </picture>
  </a>
</p>
<p align="center">El agente de programaciÃ³n con IA de cÃ³digo abierto.</p>
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

### InstalaciÃ³n

```bash
# YOLO
curl -fsSL https://voracode.ai/install | bash

# Gestores de paquetes
npm i -g voracode-ai@latest        # o bun/pnpm/yarn
scoop install voracode             # Windows
choco install voracode             # Windows
brew install mysterious75/tap/voracode # macOS y Linux (recomendado, siempre al dÃ­a)
brew install voracode              # macOS y Linux (fÃ³rmula oficial de brew, se actualiza menos)
sudo pacman -S voracode            # Arch Linux (Stable)
paru -S voracode-bin               # Arch Linux (Latest from AUR)
mise use -g voracode               # cualquier sistema
nix run nixpkgs#voracode           # o github:mysterious75/voracode para la rama dev mÃ¡s reciente
```

> [!TIP]
> Elimina versiones anteriores a 0.1.x antes de instalar.

### App de escritorio (BETA)

Voracode tambiÃ©n estÃ¡ disponible como aplicaciÃ³n de escritorio. DescÃ¡rgala directamente desde la [pÃ¡gina de releases](https://github.com/mysterious75/voracode/releases) o desde [voracode.ai/download](https://voracode.ai/download).

| Plataforma            | Descarga                           |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `voracode-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `voracode-desktop-mac-x64.dmg`     |
| Windows               | `voracode-desktop-windows-x64.exe` |
| Linux                 | `.deb`, `.rpm`, o AppImage         |

```bash
# macOS (Homebrew)
brew install --cask voracode-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/voracode-desktop
```

#### Directorio de instalaciÃ³n

El script de instalaciÃ³n respeta el siguiente orden de prioridad para la ruta de instalaciÃ³n:

1. `$VORACODE_INSTALL_DIR` - Directorio de instalaciÃ³n personalizado
2. `$XDG_BIN_DIR` - Ruta compatible con la especificaciÃ³n XDG Base Directory
3. `$HOME/bin` - Directorio binario estÃ¡ndar del usuario (si existe o se puede crear)
4. `$HOME/.voracode/bin` - Alternativa por defecto

```bash
# Ejemplos
VORACODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://voracode.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://voracode.ai/install | bash
```

### Agentes

Voracode incluye dos agentes integrados que puedes alternar con la tecla `Tab`.

- **build** - Por defecto, agente con acceso completo para tareas de desarrollo
- **plan** - Agente de solo lectura para anÃ¡lisis y exploraciÃ³n de cÃ³digo
  - Deniega ediciones de archivos por defecto
  - Pide permiso antes de ejecutar comandos bash
  - Ideal para explorar codebases desconocidas o planificar cambios

AdemÃ¡s, incluye un subagente **general** para bÃºsquedas complejas y tareas de varios pasos.
Se usa internamente y se puede invocar con `@general` en los mensajes.

MÃ¡s informaciÃ³n sobre [agentes](https://voracode.ai/docs/agents).

### DocumentaciÃ³n

Para mÃ¡s informaciÃ³n sobre cÃ³mo configurar Voracode, [**ve a nuestra documentaciÃ³n**](https://voracode.ai/docs).

### Contribuir

Si te interesa contribuir a Voracode, lee nuestras [docs de contribuciÃ³n](./CONTRIBUTING.md) antes de enviar un pull request.

### Proyectos basados en Voracode

Si estÃ¡s trabajando en un proyecto basado en Voracode y usas "voracode" como parte del nombre, por ejemplo, "voracode-dashboard" u "voracode-mobile", agrega una nota en tu README para aclarar que no estÃ¡ hecho por el equipo de Voracode y que no estÃ¡ afiliado con nosotros de ninguna manera.

---

**Ãšnete a nuestra comunidad** [Discord](https://discord.gg/voracode) | [X.com](https://x.com/voracode)
