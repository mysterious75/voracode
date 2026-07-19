# Voracode USP Features (to add after voracode port)

## Core Differentiators

### 1. Self-Improvement Engine (`src/skills/self-improve/`)
- 3-gate learning: repetition â†’ success rate â†’ user confirmation
- `task_patterns` table tracks tool sequences + success rates
- Auto-generates SKILL.md files from learned patterns
- `voracode skill patterns` to review learned patterns
- Rollback support for generated skills

### 2. Project Awareness System (`src/engine/scanner.ts`)
- Auto-detect: language, framework, build tools, package manager, test framework
- Injects project context into agent system prompt
- Updates on file system changes via git

### 3. Smart Context Compression (`src/engine/compressor.ts`)
- Auto-summarizes older messages when token budget >100K
- Preserves task context while reducing token usage
- Configurable threshold

### 4. Session Checkpoint Auto-Recovery
- Every 5 turns auto-saves checkpoint with full context
- Resuming a session rebuilds context from checkpoints
- `voracode session show --messages` to review history

### 5. Inline `/key set` in REPL
- Set API keys from inside the dashboard without restarting
- Keys stored in shared ModelRouter (persistent for session)

### 6. Provider Registry (Single Source of Truth)
- `src/models/providers.ts` â€” all provider configs in one place
- Used by router, CLI, config, and tests
- No duplication across codebase

### 7. Usage Statistics (`voracode stats`)
- Real SQLite queries: sessions, messages, tokens, API calls
- Cost estimation ($/M tokens)
- Self-learning stats (patterns, skills, preferences)
- `--json` flag for programmatic access

### 8. `voracode doctor`
- Runtime, platform, config, data, keychain, disk, memory checks
- `--fix` flag for auto-repair
- `--verbose` for detailed diagnostics

### 9. `voracode completion`
- Generates shell completion scripts for bash, zsh, fish, PowerShell
- Covers all subcommands and options

### 10. OWASP Security Shield (`src/security/owasp.ts`)
- Validates all tool inputs: files, URLs, commands
- Prevents path traversal, command injection, SSRF, credential leaks
- Integrated into ToolExecutor

---

## Architecture (to preserve in voracode port)

```
src/
â”œâ”€â”€ cli/           # CLI commands (keep voracode's structure + add our extras)
â”œâ”€â”€ engine/        # Agent, scanner, compressor, self-improvement
â”œâ”€â”€ models/        # Router, providers (single source of truth)
â”œâ”€â”€ security/      # OWASP shield
â”œâ”€â”€ session/       # Session manager
â”œâ”€â”€ skills/        # Self-improvement engine
â”œâ”€â”€ storage/       # Database (SQLite singleton)
â”œâ”€â”€ ui/            # Theme, logger
â”œâ”€â”€ tools/         # Tool executor
â””â”€â”€ errors.ts      # Typed error classes
```

## Future Ideas
- VS Code extension
- Web dashboard
- Plugin system (like voracode's plugin SDK)
- Multi-agent orchestration
- Cost tracking dashboard
- Automated PR creation
