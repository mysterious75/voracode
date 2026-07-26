# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **EVOLVE.md** — Complete design document for self-learning AI system
- **Evolve Engine** — Full implementation of self-learning system with 11 modules:
  - `memory.ts` — Structured auto-memory with persistence
  - `conventions.ts` — Automatic project convention extraction
  - `feedback.ts` — Implicit/explicit feedback signal collection
  - `reflection.ts` — Reflexion-style learning loop
  - `skills.ts` — Voyager-style skill library
  - `git-learning.ts` — Git history analysis for learning
  - `adaptive-context.ts` — Query complexity-based context loading
  - `consolidation.ts` — Memory deduplication and pruning
  - `engine.ts` — Main orchestrator
  - `integration.ts` — Voracode session lifecycle integration
  - `prompt-injection.ts` — System prompt injection hook
  - `cli.ts` — CLI commands (status, memory, skills, conventions, etc.)
- **56 comprehensive tests** — All passing (43 unit + 13 integration)
- **Working CLI** — `bun run evolve status/memory/skills/conventions/context`
- CHANGELOG.md for tracking project changes
- Fork attribution to opencode-ai/opencode in README and CONTRIBUTING.md

### Fixed
- Removed misleading STATS.md (contained opencode download stats, not voracode)
- Updated all fork package references from opencode to voracode
- Fixed CONTRIBUTING.md opencode references

### Security
- Path traversal fix via x-voracode-directory header (C-2)
- Server now requires password or --allow-unauthenticated flag (H-1)
- Replaced exec() with execFile() for taskkill (H-2)

## [0.1.0] - 2026-07-19

### Added
- Initial release based on opencode-ai/opencode
- CLI with 15 commands (BYOK, Lite, Pro, Audit, Doctor)
- 75+ AI provider support via Vercel AI SDK
- TUI (Terminal UI) built with SolidJS + OpenTUI
- Web UI (SolidStart)
- Desktop app (Electron)
- MCP Protocol integration
- Session management & history
- Git-aware context
- LSP integration
- Codesearch (BM25 semantic search)
- Plugin system
- Lamborghini loading animation for TUI
- Voracode branding and logo system
