<p align="center">
  <a href="https://voracode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Logo do Voracode">
    </picture>
  </a>
</p>
<p align="center">O agente de programaÃ§Ã£o com IA de cÃ³digo aberto.</p>
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

### InstalaÃ§Ã£o

```bash
# YOLO
curl -fsSL https://voracode.ai/install | bash

# Gerenciadores de pacotes
npm i -g voracode-ai@latest        # ou bun/pnpm/yarn
scoop install voracode             # Windows
choco install voracode             # Windows
brew install mysterious75/tap/voracode # macOS e Linux (recomendado, sempre atualizado)
brew install voracode              # macOS e Linux (fÃ³rmula oficial do brew, atualiza menos)
sudo pacman -S voracode            # Arch Linux (Stable)
paru -S voracode-bin               # Arch Linux (Latest from AUR)
mise use -g voracode               # qualquer sistema
nix run nixpkgs#voracode           # ou github:mysterious75/voracode para a branch dev mais recente
```

> [!TIP]
> Remova versÃµes anteriores a 0.1.x antes de instalar.

### App desktop (BETA)

O Voracode tambÃ©m estÃ¡ disponÃ­vel como aplicativo desktop. Baixe diretamente pela [pÃ¡gina de releases](https://github.com/mysterious75/voracode/releases) ou em [voracode.ai/download](https://voracode.ai/download).

| Plataforma            | Download                           |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `voracode-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `voracode-desktop-mac-x64.dmg`     |
| Windows               | `voracode-desktop-windows-x64.exe` |
| Linux                 | `.deb`, `.rpm` ou AppImage         |

```bash
# macOS (Homebrew)
brew install --cask voracode-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/voracode-desktop
```

#### DiretÃ³rio de instalaÃ§Ã£o

O script de instalaÃ§Ã£o respeita a seguinte ordem de prioridade para o caminho de instalaÃ§Ã£o:

1. `$VORACODE_INSTALL_DIR` - DiretÃ³rio de instalaÃ§Ã£o personalizado
2. `$XDG_BIN_DIR` - Caminho compatÃ­vel com a especificaÃ§Ã£o XDG Base Directory
3. `$HOME/bin` - DiretÃ³rio binÃ¡rio padrÃ£o do usuÃ¡rio (se existir ou puder ser criado)
4. `$HOME/.voracode/bin` - Fallback padrÃ£o

```bash
# Exemplos
VORACODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://voracode.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://voracode.ai/install | bash
```

### Agents

O Voracode inclui dois agents integrados, que vocÃª pode alternar com a tecla `Tab`.

- **build** - PadrÃ£o, agent com acesso total para trabalho de desenvolvimento
- **plan** - Agent somente leitura para anÃ¡lise e exploraÃ§Ã£o de cÃ³digo
  - Nega ediÃ§Ãµes de arquivos por padrÃ£o
  - Pede permissÃ£o antes de executar comandos bash
  - Ideal para explorar codebases desconhecidas ou planejar mudanÃ§as

TambÃ©m hÃ¡ um subagent **general** para buscas complexas e tarefas em vÃ¡rias etapas.
Ele Ã© usado internamente e pode ser invocado com `@general` nas mensagens.

Saiba mais sobre [agents](https://voracode.ai/docs/agents).

### DocumentaÃ§Ã£o

Para mais informaÃ§Ãµes sobre como configurar o Voracode, [**veja nossa documentaÃ§Ã£o**](https://voracode.ai/docs).

### Contribuir

Se vocÃª tem interesse em contribuir com o Voracode, leia os [contributing docs](./CONTRIBUTING.md) antes de enviar um pull request.

### Construindo com Voracode

Se vocÃª estiver trabalhando em um projeto relacionado ao Voracode e estiver usando "voracode" como parte do nome (por exemplo, "voracode-dashboard" ou "voracode-mobile"), adicione uma nota no README para deixar claro que nÃ£o foi construÃ­do pela equipe do Voracode e nÃ£o Ã© afiliado a nÃ³s de nenhuma forma.

---

**Junte-se Ã  nossa comunidade** [Discord](https://discord.gg/voracode) | [X.com](https://x.com/voracode)
