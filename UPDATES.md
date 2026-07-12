# PLAN.md Cross-Check Corrections — Applied Changes

> Date: 2026-07-12
> Reference: Cross-check from AI analysis

## Changes Applied to PLAN.md

### D-001: Product Name
- "voracode scan" → **"voracode audit"**
- Added: Trademark search required before monetization (USPTO + India)

### D-002: Product Philosophy
- "Zero legal risk" → **"Minimal legal risk"**
- Added: Document independent development process

### D-003: Language Choice
- "Bun is 4x faster" → **"Bun is significantly faster for I/O and startup tasks"**
- "2M Context" → **"Unlimited codebase support through intelligent context management"**
- OpenCode stars: **Verified correct (185k)**

### D-005: Context Strategy
- "80% cache hit rate" → **Removed. Cache helps reduce redundant calls, no specific % claim**
- Added: Honest framing — "intelligent context management, not 2M tokens to model"

### D-006: Security
- "keys zeroed after use" → **"keys are not persisted after use; held in memory for minimum duration"**
- "100+ blocked patterns" → **"continuously updated blocklist"**

### D-008: Self-Improvement
- "3 tasks → auto-generate skill" → **"10+ tasks → suggest pattern → user confirms → create skill"**

### D-009: Free Model Strategy — CRITICAL FIX
- "10 Groq keys = 5M TPD" → **REMOVED (ToS violation)**
- New: **Multi-provider rotation** (Groq + Together + Cerebras + Fireworks) — legal approach
- New: Single key per provider with proper rate limiting
- New: Queue system when limits hit
- New: Cost cap — hard monthly limit on managed inference

### D-011: Timeline
- 12 months → **18-24 months realistic**
- Phase 5 (Studio) → **Dropped. Not building AI-native IDE. Cursor already dominates.**
- Phase 1 CLI: 1-2 months → **3-4 months**

### D-012: Skills System
- "SKILL.md is emerging standard" → **"VORACODE uses its own voracode-skill.json format + SKILL.md compatibility"**

### D-013: MCP Protocol
- "Universal standard" → **"Gaining widespread adoption in AI tool ecosystem"**

### D-015: Cursor-Inspired Features
- Added: Differentiation points — cost estimation, risk assessment, approval gates

### D-016: Veracode Analysis
- "voracode scan" → **"voracode audit"** (resolves D-001 contradiction)
- Added: Clear statement — "No security scanning product. VORACODE is an AI coding agent."

### D-024: Revenue Model
- "90% margin" → **Added real cost breakdown**
- Pro tier: $5/mo → **$10-15/mo recommended**
- Added: Realistic Year 1 budget (~$1000)

## New Sections Added

### D-026: Revenue Model — Based on OpenCode Go + Zen
- **Free (BYOK):** Tool free, user brings key. NO free managed models. Like Mimo Code.
- **VORACODE Lite:** $5-10/mo subscription. Curated open models. Like OpenCode Go.
- **VORACODE Pro:** Pay-as-you-go credits. Frontier models. Like OpenCode Zen.
- **VORACODE Enterprise:** Custom pricing. On-premise, SSO, audit.

### D-027: "Why VORACODE?" (Unique Value Proposition)
1. **100% Free Forever** — BYOK model, no subscription needed
2. **100% Offline Capable** — Ollama local models, zero internet required
3. **Zero-Telemetry by Default** — Privacy-first, no data collection
4. **India/Hindi-First** — No competitor in this space

### D-028: Testing Strategy
- Unit tests: vitest for all modules
- Integration tests: provider connectivity, tool execution
- E2E tests: complete agent workflows
- CI/CD: GitHub Actions on every push

### D-029: Error Handling
- API rate limits → Queue + retry with backoff
- Network failures → Exponential backoff, fallback providers
- Partial failures → Sub-task resume, not restart
- User messages → Clear, actionable error messages

### D-030: Community Building
- Discord server for support
- Twitter/X for updates
- Dev.to blog for tutorials
- First 100 users: Hacker News + Product Hunt + Reddit

### D-031: Offline Strategy
- Ollama local models: 100% offline capable
- Graceful degradation: internet drops → cached responses + local mode
- Offline features: Project navigation, code review (basic), git operations
- Online features: Web search, web fetch, cloud models

### D-032: Performance Benchmarks
- Startup time: <100ms target
- Context loading: <500ms for 100K files project
- First response: <2s with API, <5s with local models
- Memory: <100MB idle, <500MB under load

### D-033: Release Strategy
- Semantic versioning (semver)
- Channels: stable, beta, nightly
- Auto-update: `voracode update` with GitHub releases
- Changelog: auto-generated from commits

### D-034: Documentation Plan
- Website: VitePress (voracode.dev)
- README: GitHub repo
- API docs: auto-generated from TypeScript types
- Contributing guide: CONTRIBUTING.md

### D-035: Budget Breakdown (Year 1)
- Domain: $12/year
- Email: $0 (free tier)
- CI/CD: $0 (GitHub free)
- Legal (trademark): $500-2000
- Cloud hosting: $0 (GitHub Pages)
- Marketing: $0 (organic)
- **Total: ~$1000**

## New Business Model Section

### OpenCode Go-like Subscription (VORACODE Lite)
- $5 first month → $10/month
- Curated open models: DeepSeek, Qwen, Kimi, MiniMax, MiMo
- Usage limits: $12/5 hours, $30/week, $60/month
- Target: International users, stable global access

### OpenCode Zen-like Pay-as-you-go (VORACODE Pro)
- Credits-based, pay per token
- Frontier models: GPT, Claude, Gemini
- Auto-reload when balance < $5
- Monthly spending limits
- Team management (admin/member roles)
- BYOK supported alongside

### Mimo Code-like BYOK (VORACODE Free)
- Tool completely free
- User must provide own API key
- No free managed models
- No work without key
- All core features available

### Revenue Projections
- Year 1: $0 (building, no monetization)
- Year 2: $500-2000/mo (Lite subscribers + Zen credits)
- Year 3: $5000-15000/mo (growing user base + enterprise)
