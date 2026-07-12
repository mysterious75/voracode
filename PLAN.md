# VORACODE — Complete Development Plan & Decision Record

> Generated: 2026-07-12
> Last Updated: 2026-07-12
> Status: Active Development — Phase 1 (CLI Core)
> License: MIT
> Brand: 100% original, zero third-party names in code

---

## Table of Decisions

This document records EVERY decision made during the research phase, with reasoning. Each decision has a unique ID (D-XXX) for traceability.

---

## D-001: Product Name — VORACODE

**Decision:** VORACODE
**Reasoning:**
- Unique name — no npm package or GitHub repo with this name
- Not conflicting with Veracode (security company) — different spelling (vera vs vora), different industry (security testing vs AI coding), different target audience
- Short, memorable, professional
- "Code" suffix clearly indicates purpose
- Can extend: VORACODE CLI, VORACODE Desktop, VORACODE Cloud, VORACODE Studio
- GitHub repo: github.com/mysterious75/voracode (will transfer to voracode org later)
- npm package: voracode (available)

---

## D-002: Product Philosophy

**Decision:** Build from original code. Study existing tools for concepts, but write every line ourselves.
**Reasoning:**
- Zero legal risk — clean room implementation
- 100% ownership — no third-party code dependencies
- MIT License — anyone can use, modify, distribute
- No brand name of any other tool will appear in our codebase (verified by grep)
- Standards are free to use (HTTP, JSON-RPC, MCP, etc.)
- Ideas are not copyrightable — only their expression

---

## D-003: Language Choice — TypeScript + Bun

**Decision:** TypeScript with Bun runtime
**Reasoning:**
- **Cross-platform:** Bun compiles to single binary for macOS (Intel + ARM), Linux (x64 + ARM), Windows (x64)
- **Fast development:** TypeScript is the fastest path from idea to working product
- **Ecosystem:** npm is the largest package ecosystem (best for plugins, skills distribution)
- **Proven:** OpenCode (185k stars) built with same stack — proven at scale
- **Performance:** Bun is 4x faster than Node.js, near-native speeds
- **Tree-sitter:** Available via WASM for smart codebase loading
- **SQLite:** Bun has built-in `bun:sqlite` — fastest SQLite binding available
- **2M Context:** Language doesn't limit context — architecture does. TypeScript handles this perfectly
- **Future:** Can rewrite performance-critical components in Rust later
- **Not Python:** No single binary, slow startup, runtime dependency
- **Not Rust:** 4x slower development, weaker plugin ecosystem, steeper learning curve

---

## D-004: Architecture Pattern — 3-Layer

**Decision:** Separate presentation (TUI/CLI/Web) from API (ACP) from Core (Engine)
**Reasoning:**
- Same agent engine can serve multiple surfaces (CLI, Desktop, Web, Mobile)
- Plugin system hooks into events at every layer
- Security layer wraps the core — consistently applied across all surfaces
- ACP (Agent Control Protocol) enables headless/CI/CD use
- This is the proven pattern used by all major tools

---

## D-005: 2M Context Strategy — Smart Sub-Tasking

**Decision:** Never send 2M tokens to model in one call. Use smart sub-task planning.
**Reasoning:**
- Model context limits are real (Claude: 200K, GPT-5: 272K, Gemini: 1M)
- But effective context can be much larger by:
  1. Tree-sitter project scan → find ONLY relevant files
  2. Task planning → break into sub-tasks (each < 30K tokens)
  3. Compression → old turns summarized, code changes compressed
  4. Semantic cache → identical requests skip API call
- Each sub-task gets a fresh context window with:
  - User's original request
  - Relevant files only (tree-sitter filtered)
  - Summary of previous sub-task results (compressed)
- User sees ONE coherent result — sub-tasking is invisible
- Architecture is language-agnostic — works in TypeScript, Rust, Go, anything

---

## D-006: Security Model — 7-Layer Defense

**Decision:** Defense in depth — 7 layers of protection
**Reasoning:**
- **Layer 1 (Input):** Strip control chars, detect injection patterns
- **Layer 2 (Prompt):** Immutable system boundary — user input isolated by delimiter
- **Layer 3 (Output):** Validate LLM output for prompt leaks, dangerous code
- **Layer 4 (Command):** 100+ blocked patterns, 30s timeout, 1MB output limit
- **Layer 5 (Network):** Domain allowlist, user approval for unknown
- **Layer 6 (Keys):** OS Keychain + AES-256-GCM encrypted fallback, never plain text
- **Layer 7 (Audit):** All actions logged, tamper-evident
- API keys NEVER leave system without user permission — this is a core USP
- Key exiting the system (even accidentally) → blocked + user warned

---

## D-007: Universal Model Adapter

**Decision:** Build adapters for every API protocol, not just OpenAI-compatible
**Reasoning:**
- OpenAI protocol adapter covers 60+ providers (DeepSeek, Groq, Together, Ollama, OpenRouter, HuggingFace, etc.)
- But Anthropic, Google, Cohere, AWS Bedrock use DIFFERENT protocols
- Adapter pattern: each provider implements the same `ModelAdapter` interface
- Auto-detect provider from model name (e.g., `claude-` → Anthropic adapter)
- Auto-fallback: primary fails → next provider in chain
- No provider lock-in EVER — user can switch anytime

---

## D-008: Self-Improvement Engine

**Decision:** Learning is per-user, local, privacy-first
**Reasoning:**
- Each user's VORACODE learns their patterns, preferences, coding style
- Learning is stored LOCALLY — in `~/.config/voracode/memory.db` (FTS5)
- After 3+ similar tasks → pattern detected → SKILL.md generated automatically
- Skills are personal to each user — User A's skills differ from User B's
- **Community skills (opt-in):** User can optionally share anonymized patterns → VORACODE team creates skill packs → all users can install
- Core engine updates (via GitHub releases) benefit ALL users equally
- This is the Hermes-style approach but with privacy-first design

---

## D-009: Free Model Strategy at Scale

**Decision:** 4-tier model with BYOK as primary
**Reasoning:**
- **Tier 0 (BYOK — 99% users):** User brings own key. Scales to infinity. $0 cost.
- **Tier 1 (Free Pool — new users):** Multi-key rotation (10 Groq keys = 5M TPD), fair use policy, queue with ETA
- **Tier 2 (Local):** Ollama integration — user's hardware, $0 cost, works offline
- **Tier 3 (Pro):** $5-10/mo — priority access, dedicated keys, cloud agents
- Circuit breaker pattern: provider fails 3 times → circuit open → try next
- Bulkhead: Free & Pro users have SEPARATE pools — Pro never affected by Free load
- Semantic cache: 80% similar questions hit cache → zero API cost
- Cost cap: Hard monthly limit on managed inference. When hit → queue/offline only.

---

## D-010: Repo Name

**Decision:** `voracode` (single word)
**Reasoning:**
- GitHub: `github.com/mysterious75/voracode` (will transfer to `voracode` org later)
- npm: `voracode` (available — verified)
- Stronger brand than `voracode-cli` — one word, memorable, professional
- Future product family: voracode (CLI) → voracode-desktop → voracode-cloud → voracode-studio
- npm package will publish as `voracode`, binary name `voracode`

---

## D-011: Product Family Vision

**Decision:** Start with CLI, expand to other surfaces over time
**Reasoning:**
- Phase 1 (Months 1-2): VORACODE CLI — terminal AI agent, all core features
- Phase 2 (Months 3-4): VORACODE Desktop — CodeMirror-based editor + agent panel
- Phase 3 (Months 5-6): VORACODE Cloud — serverless agents + web interface + mobile
- Phase 4 (Months 7-9): VORACODE Ecosystem — marketplace, review bot
- Phase 5 (Months 10-12): VORACODE Studio — AI-native dev environment
- Same agent engine, multiple surfaces — one VORACODE everywhere

---

## D-012: Skills System

**Decision:** SKILL.md format compatible with existing ecosystem standards
**Reasoning:**
- SKILL.md format is an emerging standard (YAML frontmatter + markdown body)
- Built-in skills at launch: web-search, web-fetch, research, code-review, git-helper, deploy, learn
- Skill discovery in `~/.config/voracode/skills/*/SKILL.md`
- Also supports `.voracode/skills/` (per-project) and `.agents/skills/` (ecosystem compatible)
- Self-improvement engine auto-generates skills from task patterns
- Marketplace for community skills (Phase 4)

---

## D-013: MCP Protocol Support

**Decision:** Full MCP integration with all transport types
**Reasoning:**
- MCP (Model Context Protocol) is becoming universal standard
- Support stdio (local processes), HTTP/SSE (remote), WebSocket (real-time)
- Built-in MCP servers: filesystem, GitHub, SQLite database, web search
- MCP server approval flow — user must explicitly allow
- Permission per MCP tool — granular control
- Audit log for all MCP calls
- `voracode mcp list | add | remove | test` commands

---

## D-014: Data Protection — Keys Never Leave System

**Decision:** Multi-layer key protection with zero-exfiltration guarantee
**Reasoning:**
- OS Keychain (primary): macOS Keychain, Windows Credential Manager, Linux libsecret
- Encrypted fallback: AES-256-GCM, master password, file permissions 0o600
- Memory guard: keys zeroed after use, never in logs/stacktraces/crash reports
- Network guard: outbound requests scanned for key patterns ("sk-..." detected → blocked)
- Prompt guard: LLM instructed to NEVER output credentials
- Git guard: staged files scanned for credentials before commit
- This is a USP for enterprise/security-conscious users

---

## D-015: Cursor-Inspired Features to Add

**Decision:** Add these features in Phase 2-3 (not Phase 1)
**Reasoning:**
- Plan mode with clarifying questions (Phase 1.5)
- Parallel sub-agents with model routing (Phase 1.5 — leverages Universal Adapter)
- Codebase indexing via tree-sitter + FTS5 (Phase 1)
- Visual checkpoints/timeline (Phase 2)
- Headless CI/CD via GitHub Action (Phase 2)
- Team marketplace for skills (Phase 3)
- Automated PR review bot (Phase 3)

---

## D-016: Veracode Analysis

**Decision:** Veracode is NOT a competitor. No conflict.
**Reasoning:**
- Veracode (veracode.com) = Enterprise Application Security (SAST, DAST, SCA)
- VORACODE (voracode.dev) = AI Coding Agent
- Different industry, different product, different audience
- Name spelling different (vera vs vora)
- We can LEARN from their security approach — especially their AI Fix product
- Future feature: "voracode scan" — code security scanning (like SAST lite)
- No trademark conflict — but will verify with trademark search before monetization

---

## D-017: Multi-Platform Distribution

**Decision:** Distribute via all major channels
**Reasoning:**
- **npm:** `npm i -g voracode` — works everywhere
- **Homebrew:** `brew install voracode` — macOS and Linux
- **Scoop:** `scoop install voracode` — Windows
- **Binary:** Direct download from GitHub releases
- **Install script:** `curl voracode.dev/install | bash` — one-liner
- **Bun build --compile:** Single binary per platform — no runtime needed

---

## D-018: Database Choice — SQLite

**Decision:** SQLite for all local storage
**Reasoning:**
- Bun has built-in `bun:sqlite` — fastest binding available
- Zero setup, zero config — file-based
- FTS5 for full-text search over memory
- Perfect for single-user CLI tool
- Sessions, messages, memory, skills registry, stats — all in one file
- Future cloud sync can use Supabase (PostgreSQL) for teams

---

## D-019: Self-Improvement — Per-User Only

**Decision:** No centralized learning. Each user's tool learns independently.
**Reasoning:**
- User A (8 hrs/day) → A's VORACODE becomes very smart
- User B (30 mins/day) → B's VORACODE learns slowly
- User C (tried once) → basic functionality only
- This is a FEATURE, not a bug — privacy-first design
- Community skill packs (optional, opt-in) allow sharing patterns
- Core engine improvements via GitHub releases benefit ALL users equally
- No user data is sent to our servers unless explicitly opted in

---

## D-020: License

**Decision:** MIT License
**Reasoning:**
- Most permissive open source license
- Used by OpenCode, Aider, and most successful CLI tools
- Allows commercial use, modification, distribution
- Requires only copyright notice preservation
- Compatible with all other licenses we might use
- No GPL/Affero dependencies — avoiding viral licenses

---

## D-021: Initial File Structure

**Decision:** `/src` based TypeScript project
**Reasoning:**
- Clean separation: cli/, engine/, models/, context/, security/, tools/, skills/, session/, storage/, server/, ui/
- Each module has single responsibility
- Easy to port to Rust later (same structure)
- Plugin system in separate directory
- Tests mirror src structure

---

## D-022: Development Priority

**Decision:** Core CLI first → Security → Skills → Plugin → TUI → Cloud
**Reasoning:**
- Phase 1 priority order:
  1. CLI framework + help text (functional CLI)
  2. Config system (voracode.json)
  3. Database (SQLite + schema)
  4. OpenAI protocol adapter (covers 60+ providers)
  5. Anthropic + Google adapters
  6. Agent loop (plan → execute → reflect)
  7. Basic tools (file, bash, git)
  8. Security layer (injection, sandbox, egress)
  9. Skills engine + built-in skills
  10. Session management
  11. TUI (basic)
  12. Plugin system

---

## D-023: No Fork — Original Code Only

**Decision:** Zero code copied from any other tool. Clean room implementation.
**Reasoning:**
- Legal safety — no copyright concerns
- Full ownership — no dependency on other projects
- Brand purity — no accidental brand name leaks
- Architectural freedom — not constrained by someone else's design
- Study concepts → close their docs → implement from memory
- Use standard protocols (HTTP, JSON-RPC, MCP) — these are free to implement
- VORACODE is 100% ours

---

## D-024: Revenue Model

**Decision:** Freemium with BYOK free tier
**Reasoning:**
- **Free (BYOK):** All core features, user brings own key. $0 forever.
- **Pro ($5-10/mo):** Cloud agents, team features, priority support
- **Teams ($25/mo):** Marketplace, centralized billing, SSO
- **Enterprise (Custom):** On-premise, SOC 2, dedicated support
- **Donations:** GitHub Sponsors for open source contributors
- **Marketplace:** 70/30 revenue share on community skills (Phase 4)
- Zero cost to start — break even from Day 1
- Gross margin: 90%+ (BYOK means no inference cost for us)

---

## D-025: CLI Name (Binary)

**Decision:** `voracode` (same as project name)
**Reasoning:**
- Consistent branding
- Short, easy to type
- `voracode --help` — clear purpose
- `voracode run "message"` — natural language
- No namespace conflict with any other tool

---

*End of Decision Record — 25 decisions documented.*
*For implementation status, see IMPLEMENT.md or run `voracode status`.*
