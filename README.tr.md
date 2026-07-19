<p align="center">
  <a href="https://voracode.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Voracode logo">
    </picture>
  </a>
</p>
<p align="center">AÃ§Ä±k kaynaklÄ± yapay zeka kodlama asistanÄ±.</p>
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

### Kurulum

```bash
# YOLO
curl -fsSL https://voracode.ai/install | bash

# Paket yÃ¶neticileri
npm i -g voracode-ai@latest        # veya bun/pnpm/yarn
scoop install voracode             # Windows
choco install voracode             # Windows
brew install mysterious75/tap/voracode # macOS ve Linux (Ã¶nerilir, her zaman gÃ¼ncel)
brew install voracode              # macOS ve Linux (resmi brew formÃ¼lÃ¼, daha az gÃ¼ncellenir)
sudo pacman -S voracode            # Arch Linux (Stable)
paru -S voracode-bin               # Arch Linux (Latest from AUR)
mise use -g voracode               # TÃ¼m iÅŸletim sistemleri
nix run nixpkgs#voracode           # veya en gÃ¼ncel geliÅŸtirme dalÄ± iÃ§in github:mysterious75/voracode
```

> [!TIP]
> Kurulumdan Ã¶nce 0.1.x'ten eski sÃ¼rÃ¼mleri kaldÄ±rÄ±n.

### MasaÃ¼stÃ¼ UygulamasÄ± (BETA)

Voracode ayrÄ±ca masaÃ¼stÃ¼ uygulamasÄ± olarak da mevcuttur. DoÄŸrudan [sÃ¼rÃ¼m sayfasÄ±ndan](https://github.com/mysterious75/voracode/releases) veya [voracode.ai/download](https://voracode.ai/download) adresinden indirebilirsiniz.

| Platform              | Ä°ndirme                            |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `voracode-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `voracode-desktop-mac-x64.dmg`     |
| Windows               | `voracode-desktop-windows-x64.exe` |
| Linux                 | `.deb`, `.rpm` veya AppImage       |

```bash
# macOS (Homebrew)
brew install --cask voracode-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/voracode-desktop
```

#### Kurulum Dizini (Installation Directory)

Kurulum betiÄŸi (install script), kurulum yolu (installation path) iÃ§in aÅŸaÄŸÄ±daki Ã¶ncelik sÄ±rasÄ±nÄ± takip eder:

1. `$VORACODE_INSTALL_DIR` - Ã–zel kurulum dizini
2. `$XDG_BIN_DIR` - XDG Base Directory Specification uyumlu yol
3. `$HOME/bin` - Standart kullanÄ±cÄ± binary dizini (varsa veya oluÅŸturulabiliyorsa)
4. `$HOME/.voracode/bin` - VarsayÄ±lan yedek konum

```bash
# Ã–rnekler
VORACODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://voracode.ai/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://voracode.ai/install | bash
```

### Ajanlar

Voracode, `Tab` tuÅŸuyla aralarÄ±nda geÃ§iÅŸ yapabileceÄŸiniz iki yerleÅŸik (built-in) ajan iÃ§erir.

- **build** - VarsayÄ±lan, geliÅŸtirme Ã§alÄ±ÅŸmalarÄ± iÃ§in tam eriÅŸimli ajan
- **plan** - Analiz ve kod keÅŸfi iÃ§in salt okunur ajan
  - VarsayÄ±lan olarak dosya dÃ¼zenlemelerini reddeder
  - Bash komutlarÄ±nÄ± Ã§alÄ±ÅŸtÄ±rmadan Ã¶nce izin ister
  - TanÄ±madÄ±ÄŸÄ±nÄ±z kod tabanlarÄ±nÄ± keÅŸfetmek veya deÄŸiÅŸiklikleri planlamak iÃ§in ideal

AyrÄ±ca, karmaÅŸÄ±k aramalar ve Ã§ok adÄ±mlÄ± gÃ¶revler iÃ§in bir **genel** alt ajan bulunmaktadÄ±r.
Bu dahili olarak kullanÄ±lÄ±r ve mesajlarda `@general` ile Ã§aÄŸrÄ±labilir.

[Ajanlar](https://voracode.ai/docs/agents) hakkÄ±nda daha fazla bilgi edinin.

### DokÃ¼mantasyon

Voracode'u nasÄ±l yapÄ±landÄ±racaÄŸÄ±nÄ±z hakkÄ±nda daha fazla bilgi iÃ§in [**dokÃ¼mantasyonumuza gÃ¶z atÄ±n**](https://voracode.ai/docs).

### KatkÄ±da Bulunma

Voracode'a katkÄ±da bulunmak istiyorsanÄ±z, lÃ¼tfen bir pull request gÃ¶ndermeden Ã¶nce [katkÄ±da bulunma dokÃ¼manlarÄ±mÄ±zÄ±](./CONTRIBUTING.md) okuyun.

### Voracode Ãœzerine GeliÅŸtirme

Voracode ile ilgili bir proje Ã¼zerinde Ã§alÄ±ÅŸÄ±yorsanÄ±z ve projenizin adÄ±nÄ±n bir parÃ§asÄ± olarak "voracode" kullanÄ±yorsanÄ±z (Ã¶rneÄŸin, "voracode-dashboard" veya "voracode-mobile"), lÃ¼tfen README dosyanÄ±za projenin Voracode ekibi tarafÄ±ndan geliÅŸtirilmediÄŸini ve bizimle hiÃ§bir ÅŸekilde baÄŸlantÄ±lÄ± olmadÄ±ÄŸÄ±nÄ± belirten bir not ekleyin.

---

**TopluluÄŸumuza katÄ±lÄ±n** [Discord](https://discord.gg/voracode) | [X.com](https://x.com/voracode)
