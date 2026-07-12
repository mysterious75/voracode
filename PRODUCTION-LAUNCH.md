# VORACODE — Production Launch Checklist

## Current Status: Ready for Launch 🚀

---

## Phase 1: Code Quality (Days 1-3)

### Testing
- [ ] Unit tests for Model Router (provider detection, chat methods)
- [ ] Unit tests for Tool Executor (file read/write/edit, bash, search)
- [ ] Unit tests for Self-Improvement Engine (patterns, skills)
- [ ] Integration test: end-to-end agent loop with mock provider
- [ ] Integration test: MCP config manager CRUD
- [ ] Security tests: injection attempts, dangerous commands, key leakage

### Code Quality
- [ ] Run `bun run lint` — fix all warnings
- [ ] Run `bun run format` — consistent style
- [ ] Remove all `console.log` debugging artifacts
- [ ] Ensure all error messages are user-friendly
- [ ] Remove unused imports

---

## Phase 2: Packaging (Days 4-5)

### npm
- [ ] Final package.json fields:
  - name: "voracode"
  - version: "0.1.0"
  - repository, bugs, homepage URLs
  - keywords complete
  - bin field pointing to dist/main.js
- [ ] `npm publish --access public`

### Binaries (Bun compile)
- [ ] Linux x64: `bun build --compile --target=bun-linux-x64-modern`
- [ ] macOS ARM: `bun build --compile --target=bun-darwin-arm64`
- [ ] macOS Intel: `bun build --compile --target=bun-darwin-x64`
- [ ] Windows x64: `bun build --compile --target=bun-windows-x64`
- [ ] Test each binary works

### Distribution
- [ ] npm: `npm i -g voracode`
- [ ] Homebrew: Create formula for macOS/Linux
- [ ] Scoop: Create manifest for Windows
- [ ] GitHub Releases: Upload binaries + changelog
- [ ] Install script: `curl voracode.dev/install | bash`

---

## Phase 3: Documentation (Days 6-7)

### README.md (DONE)
- [x] Full command reference
- [x] Installation instructions
- [x] Configuration guide
- [x] Self-improvement explanation
- [x] Security features

### Additional Docs
- [ ] CHANGELOG.md (initial release notes)
- [ ] CONTRIBUTING.md (how to contribute)
- [ ] SECURITY.md (security policy)
- [ ] CODE_OF_CONDUCT.md

---

## Phase 4: Security Audit (Days 8-9)

### Pre-Launch Security Review
- [ ] Audit command sandbox (no dangerous commands)
- [ ] Verify API keys never logged
- [ ] Test prompt injection protection
- [ ] Verify network egress control
- [ ] Check key storage (no plaintext)
- [ ] Review error messages for info leakage
- [ ] Test race conditions in session handling

### Vulnerability Scan
- [ ] Run npm audit (no high/critical deps)
- [ ] Check for known CVEs in dependencies
- [ ] Review bun version for security patches

---

## Phase 5: Marketing (Day 10)

### GitHub
- [ ] Repo name: voracode-cli/voracode
- [ ] README with badges (npm, CI, license)
- [ ] Topics: ai, cli, coding-agent, terminal, voracode
- [ ] Discussions enabled
- [ ] Templates: bug report, feature request

### Launch Channels
- [ ] Hacker News: "Show HN: VORACODE — open-source AI coding agent"
- [ ] Product Hunt: Schedule launch
- [ ] Reddit: r/programming, r/node, r/developersIndia
- [ ] Dev.to: "How I built VORACODE from scratch"
- [ ] Twitter/X: @voracode_dev (if available)
- [ ] Discord: Create server for community

---

## Phase 6: Post-Launch (Days 11-14)

### Monitoring
- [ ] Track npm downloads (npmjs.com)
- [ ] Monitor GitHub stars/issues
- [ ] Track error reports
- [ ] Community feedback collection

### Quick Wins
- [ ] Respond to all GitHub issues within 24h
- [ ] Fix any critical bugs immediately
- [ ] Thank early contributors

---

## Revenue Model

| Tier | Price | Revenue Stream |
|------|-------|----------------|
| Free (BYOK) | $0 | Community + open source |
| Lite | $5→$10/mo | Curated models subscription |
| Pro | Pay-as-you-go | Credits + frontier models |
| Enterprise | Custom | Sales team |

---

## Metrics to Track

| Metric | Target (3 months) |
|--------|-------------------|
| npm weekly downloads | 1,000+ |
| GitHub stars | 500+ |
| GitHub issues | Active engagement |
| Discord members | 100+ |
| First Lite subscription | Month 1 |
| Revenue (monthly) | $500+ by Month 3 |

---

## Timeline

| Date | Milestone |
|------|-----------|
| Day 1 | Code quality + testing |
| Day 2 | Packaging binaries |
| Day 3 | npm publish |
| Day 4 | Documentation |
| Day 5 | Security audit |
| Day 6 | Marketing prep |
| Day 7 | Launch on HN + Reddit |
| Day 8 | Product Hunt |
| Day 9 | Follow-up + bug fixes |
| Day 10 | Community building |
