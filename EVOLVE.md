# VORACODE EVOLVE — Self-Learning AI Coding System

> **Version:** 1.0
> **Date:** 2026-07-26
> **Status:** IMPLEMENTED ✅
> **Based on:** Deep research across 28+ sources (papers, products, repos, blogs)
> **Tests:** 43/43 passing

---

## What is Evolve?

Evolve is Voracode's **self-learning engine** — the feature that makes Voracode fundamentally different from every other AI coding tool.

While other tools treat every session as a blank slate, Evolve makes Voracode **remember, learn, and improve** from every interaction. The more you use it, the better it gets — at YOUR project, YOUR style, YOUR workflow.

**No other open-source tool does this today.**

---

## The Problem

Every AI coding assistant has the same fundamental flaw:

```
Session 1: AI generates code → User corrects it → Session ends
Session 2: AI generates the SAME bad code → User corrects AGAIN
Session 3: Same thing. Forever.
```

The user's corrections, preferences, and project knowledge evaporate at the end of each session. This is like working with an intern who has amnesia every morning.

---

## How Evolve Solves It

```
┌─────────────────────────────────────────────────────────────┐
│                    EVOLVE ENGINE                             │
│                                                              │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐ │
│  │  OBSERVE  │──▶│ DISTILL  │──▶│  STORE   │──▶│  APPLY   │ │
│  │          │   │          │   │          │   │          │ │
│  │ Signals  │   │ Lessons  │   │ Memory   │   │ Context  │ │
│  │ from     │   │ from     │   │ files    │   │ injection│ │
│  │ usage    │   │ signals  │   │ + skills │   │ at start │ │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘ │
│       │                                              │      │
│       └──────────────────────────────────────────────┘      │
│                    FEEDBACK LOOP                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Four Phases of Evolution

### Phase 1: MEMORY — "I Remember"
### Phase 2: REFLECTION — "I Learn"  
### Phase 3: ADAPTATION — "I Evolve"
### Phase 4: SELF-IMPROVEMENT — "I Improve Myself"

---

## PHASE 1: MEMORY (Weeks 1-4)

### Feature 1.1: Auto-Memory System

**What:** Voracode automatically writes notes about what it learns during coding sessions.

**How it works:**

1. During a session, when something significant happens, Voracode extracts a lesson:
   - User corrects AI's code → "User prefers X over Y"
   - AI discovers a build command → "Project builds with `bun run build`"
   - User says "always use try-catch" → "Preference: try-catch for error handling"
   - Tests pass after a fix → "Docker issue fixed by pruning images"

2. After each significant interaction, a background process writes a structured memory entry:

```markdown
# Memory Entry Format
- **Category:** convention | debugging | preference | architecture | tool
- **Confidence:** 0.0-1.0 (increases with repeated observations)
- **Source:** explicit (user said it) | inferred (AI figured it out)
- **Content:** The actual lesson
- **Context:** When/where this was learned
```

3. At session start, Voracode reads its memory files and injects relevant context.

**Storage structure:**
```
.voracode/
├── memory/
│   ├── index.md          # Quick-reference memory index
│   ├── conventions.md    # Coding conventions detected
│   ├── architecture.md   # Project structure knowledge
│   ├── debugging.md      # Past debugging insights
│   ├── preferences.md    # User preferences
│   └── tools.md          # Tool configurations & workarounds
```

**User commands:**
```bash
voracode memory list          # Show all memories
voracode memory edit          # Open memory files for editing
voracode memory prune         # Remove stale/low-confidence entries
voracode memory export        # Export memories for sharing
voracode memory import        # Import shared memories
```

**Why it matters:** This is the foundation. Everything else builds on memory.

---

### Feature 1.2: Project Convention Extraction

**What:** Voracode automatically analyzes your codebase to detect coding conventions.

**How it works:**

On first run in a project, Voracode samples 20-50 files and detects:

```typescript
interface ProjectConventions {
  naming: {
    functions: 'camelCase' | 'snake_case' | 'PascalCase';
    variables: 'camelCase' | 'snake_case';
    files: 'kebab-case' | 'camelCase' | 'PascalCase' | 'snake_case';
    components: 'PascalCase' | 'camelCase';
  };
  imports: {
    style: 'relative' | 'absolute' | 'barrel';
    sorting: 'alphabetical' | 'grouped' | 'none';
  };
  errorHandling: 'try-catch' | 'result-type' | 'mixed';
  testing: {
    framework: 'jest' | 'vitest' | 'bun' | 'mocha' | 'other';
    pattern: 'describe-it' | 'test' | 'flat';
    assertion: 'expect' | 'assert' | 'chai';
  };
  architecture: 'layered' | 'feature-based' | 'clean' | 'flat';
  formatting: {
    semicolons: boolean;
    quotes: 'single' | 'double';
    trailingComma: boolean;
  };
}
```

**Storage:** `.voracode/memory/conventions.md`

**Example output:**
```markdown
# Project Conventions (auto-detected)

## Naming
- Functions: camelCase (95% confidence, 47/50 files)
- Files: kebab-case (88% confidence, 44/50 files)
- Components: PascalCase (100% confidence, 12/12 components)

## Error Handling
- Pattern: try-catch (92% confidence)
- Custom error class: AppError (found in src/errors/)

## Testing
- Framework: vitest
- Pattern: describe/it/expect
- Test files: co-located with source (*.test.ts)

## Imports
- Style: relative for same-dir, absolute for cross-dir
- Sorting: grouped (stdlib → external → internal)
```

**Why it matters:** No more "write code like the rest of the project" instructions. Voracode just knows.

---

### Feature 1.3: Basic Feedback Signals

**What:** Collect implicit signals about code quality from user behavior.

**Signals collected:**

| Signal | How | Weight |
|--------|-----|--------|
| Code kept without edits | Git diff analysis | +1.0 (positive) |
| Code edited after generation | Git diff within 5min | -0.5 (negative) |
| Code deleted shortly after | Git diff within 10min | -1.0 (negative) |
| Tests pass | Test runner output | +0.5 (positive) |
| Tests fail | Test runner output | -0.5 (negative) |
| Lint errors | LSP output | -0.3 (negative) |
| Type errors | TypeScript/tsgo output | -0.3 (negative) |
| User correction in chat | "That's wrong", "use X instead" | -0.8 (negative) |
| User approval in chat | "perfect", "exactly what I wanted" | +0.8 (positive) |

**Storage:** `.voracode/signals.jsonl` (append-only log)

**Privacy:** All signals stored locally. Never sent to cloud unless explicitly opted in.

---

## PHASE 2: REFLECTION (Weeks 5-8)

### Feature 2.1: Reflexion Loop

**What:** After each significant task, Voracode reflects on what worked and what didn't.

**How it works:**

```typescript
// After task completion
async function reflect(task: string, outcome: Outcome): Promise<void> {
  const reflection = await llm.generate({
    prompt: `
      Task: ${task}
      Outcome: ${outcome.success ? 'Success' : 'Failure'}
      User feedback: ${outcome.feedback || 'None'}
      Errors encountered: ${outcome.errors.join(', ')}
      
      Reflect on:
      1. What approach worked?
      2. What went wrong (if anything)?
      3. What should I do differently next time?
      4. What did I learn about this project/codebase?
      
      Be specific and actionable. This will be used to improve future sessions.
    `,
    maxTokens: 500
  });
  
  await memory.store({
    category: 'reflection',
    content: reflection,
    task: task,
    success: outcome.success,
    timestamp: new Date()
  });
}
```

**When reflections are triggered:**
- After completing a multi-step task
- After a user correction
- After a debugging session
- After a failed attempt that eventually succeeded

**How reflections are used:**
- At session start, load reflections for the current project
- Before generating code, search for reflections about similar tasks
- Include relevant reflections in the system prompt

---

### Feature 2.2: Skill Library

**What:** Store successful code patterns as reusable, searchable skills.

**Inspired by:** Voyager (Wang et al., 2023) — the first LLM agent with a skill library.

**How it works:**

1. When Voracode successfully completes a task, it extracts the solution pattern:

```typescript
interface Skill {
  id: string;                    // Unique ID
  name: string;                  // Human-readable name
  description: string;           // What this skill does
  trigger: string;               // When to use this skill
  tags: string[];                // ['react', 'api', 'testing', 'debugging']
  code: string;                  // The actual solution
  context: string;               // Project/codebase context
  successCount: number;          // How many times it worked
  lastUsed: Date;                // When it was last used
  confidence: number;            // 0-1 based on success rate
}
```

2. Before generating new code, search the skill library for relevant past solutions.

3. Skills are stored in `.voracode/skills/` as JSON files.

**Example skill:**
```json
{
  "id": "skill_001",
  "name": "Express Error Handler Middleware",
  "description": "Creates a centralized error handling middleware for Express.js with AppError class",
  "trigger": "When the user asks to add error handling to an Express API",
  "tags": ["express", "error-handling", "middleware", "node"],
  "code": "class AppError extends Error { ... }",
  "context": "Express.js REST API with TypeScript",
  "successCount": 3,
  "confidence": 0.9
}
```

**User commands:**
```bash
voracode skills list            # Show all saved skills
voracode skills search <query>  # Search skills by description
voracode skills edit <id>       # Edit a skill
voracode skills delete <id>     # Remove a skill
voracode skills export          # Export skills for sharing
voracode skills import          # Import shared skills
```

**Community skills:**
- Users can share skill libraries
- Community-curated skill packs for common frameworks
- `voracode skills install <pack>` for community packs

---

### Feature 2.3: Git-Based Learning

**What:** Learn from git history about what the user actually does with AI-generated code.

**How it works:**

```typescript
async function analyzeGitHistory(since: Date): Promise<Lesson[]> {
  const commits = await git.log({ since });
  const lessons: Lesson[] = [];
  
  for (const commit of commits) {
    const diff = await git.diff(commit);
    
    // Detect: user modified AI-generated code shortly after
    if (isEditAfterAI(diff, commit.timestamp)) {
      lessons.push({
        type: 'correction',
        pattern: extractPattern(diff),
        lesson: `User prefers ${extractPreference(diff)} over AI's approach`
      });
    }
    
    // Detect: user kept AI code without changes
    if (isKeptWithoutEdit(diff, commit.timestamp)) {
      lessons.push({
        type: 'approval',
        pattern: extractPattern(diff),
        lesson: `AI's approach was acceptable for this pattern`
      });
    }
  }
  
  return lessons;
}
```

**Privacy:** Only analyzes the local git repo. No data sent anywhere.

---

## PHASE 3: ADAPTATION (Weeks 9-12)

### Feature 3.1: Adaptive Context Loading

**What:** Adjust how much context to load based on query complexity.

**Inspired by:** Adaptive-RAG (Jeong et al., NAACL 2024)

**How it works:**

```typescript
type QueryComplexity = 'simple' | 'medium' | 'complex';

async function classifyComplexity(query: string): Promise<QueryComplexity> {
  // Simple: "fix this typo", "add a semicolon", "rename this variable"
  // Medium: "add a new endpoint", "fix this bug", "add tests"
  // Complex: "refactor the auth system", "add caching layer", "migrate to v2"
  
  const classification = await llm.classify(query, {
    categories: ['simple', 'medium', 'complex'],
    examples: [...]
  });
  
  return classification;
}

async function selectContext(query: string, project: ProjectInfo): Promise<Context> {
  const complexity = await classifyComplexity(query);
  
  switch (complexity) {
    case 'simple':
      return {
        memory: false,        // Don't need project memory for typos
        skills: false,        // Don't need skills
        conventions: true,    // Always use conventions
        files: [currentFile], // Only current file
        deepSearch: false
      };
    
    case 'medium':
      return {
        memory: true,         // Load relevant memories
        skills: true,         // Search skill library
        conventions: true,    // Always use conventions
        files: relevantFiles, // Files related to the task
        deepSearch: false
      };
    
    case 'complex':
      return {
        memory: true,         // Full memory
        skills: true,         // Full skill search
        conventions: true,    // Full conventions
        files: allRelated,    // All related files
        deepSearch: true      // Deep codebase search
      };
  }
}
```

**Why it matters:** Saves tokens and latency for simple tasks. Ensures thoroughness for complex ones.

---

### Feature 3.2: Memory Consolidation

**What:** Periodically clean up, merge, and improve stored memories.

**How it works:**

1. **Deduplication:** Merge memories that say the same thing differently
2. **Confidence updates:** Increase confidence for repeated observations, decrease for old/unused
3. **Conflict resolution:** When memories contradict, keep the newer one with higher confidence
4. **Pruning:** Remove memories below confidence threshold or older than N days without use
5. **Summarization:** Compress verbose memories into concise entries

**Trigger:** Runs automatically every 5 sessions, or on `voracode memory prune`.

**Example consolidation:**
```
Before:
  - "User prefers camelCase for functions" (confidence: 0.8, 5 observations)
  - "Functions should be camelCase" (confidence: 0.6, 2 observations)
  - "I noticed the user uses camelCase naming" (confidence: 0.7, 3 observations)

After:
  - "Functions: camelCase" (confidence: 0.95, 10 observations)
```

---

### Feature 3.3: Memory Graph (Optional — Advanced)

**What:** Build a knowledge graph of project relationships for multi-hop reasoning.

**Inspired by:** HippoRAG — knowledge graph memory for LLM agents.

**Example:**
```
User asks: "How should I handle errors in the payment service?"

Memory graph path:
  "payment service" → uses → "Stripe SDK"
  "Stripe SDK" → requires → "try-catch for API errors"
  "Project" → prefers → "AppError class for custom errors"
  "AppError" → defined in → "src/errors/app-error.ts"

Result: Voracode knows to use try-catch with AppError class, referencing the existing error module.
```

**Complexity:** High (4-6 weeks)
**Priority:** P3 (nice to have, not critical)

---

## PHASE 4: SELF-IMPROVEMENT (Weeks 13+)

### Feature 4.1: Harness Self-Review

**What:** Voracode periodically reviews its own effectiveness and suggests improvements.

**How it works:**

1. Track metrics:
   - How often are memories used vs ignored?
   - How often are skills retrieved and applied?
   - What's the user's edit-after-generation rate?
   - What's the test pass rate for AI-generated code?

2. Generate improvement suggestions:
   - "Your debugging memories are rarely used. Consider pruning them."
   - "Skills for React testing have a 90% success rate. Consider adding more."
   - "The convention detection missed your import sorting preference. Adding it."

3. User can approve or reject suggestions.

---

### Feature 4.2: STOP-Style Self-Optimization (Advanced)

**What:** Voracode can modify its own hooks and skills to improve performance.

**Inspired by:** STOP (Zelikman et al., COLM 2024) — self-taught optimizer.

**How it works:**

1. Voracode identifies a skill or hook that could be improved
2. Generates an improved version
3. Tests the improved version in a sandbox
4. If it performs better, replaces the original
5. Keeps rollback capability

**Safety:**
- Sandboxed execution only
- Human approval required for destructive changes
- Automatic rollback if metrics degrade
- Hard limits on self-modification depth

**Complexity:** Very High (6-8 weeks)
**Priority:** P4 (future)

---

## Technical Architecture

### File Structure
```
.voracode/
├── memory/
│   ├── index.md              # Memory index (loaded at session start)
│   ├── conventions.md        # Project conventions
│   ├── architecture.md       # Project structure
│   ├── debugging.md          # Debugging insights
│   ├── preferences.md        # User preferences
│   ├── tools.md              # Tool configurations
│   └── reflections/
│       ├── 2026-07-26.md     # Daily reflections
│       └── ...
├── skills/
│   ├── index.json            # Skill index
│   ├── skill_001.json        # Individual skills
│   └── ...
├── signals.jsonl             # Feedback signal log
└── config.json               # Evolve configuration
```

### Configuration
```json
{
  "evolve": {
    "enabled": true,
    "autoMemory": true,
    "conventionExtraction": true,
    "skillLibrary": true,
    "reflectionLoop": true,
    "adaptiveContext": true,
    "memoryConsolidation": {
      "interval": 5,
      "pruneThreshold": 0.3,
      "maxAgeDays": 90
    },
    "privacy": {
      "cloudSync": false,
      "telemetry": false
    }
  }
}
```

### API Integration Points

The Evolve engine integrates with Voracode's existing architecture:

1. **Session start:** Load memory + conventions → inject into system prompt
2. **During generation:** Search skills for relevant patterns → include in context
3. **After generation:** Collect feedback signals → update memory
4. **Periodically:** Run consolidation → prune → optimize

---

## Comparison with Existing Tools

| Feature | Voracode Evolve | Claude Code | Cursor | Windsurf | Copilot |
|---------|:---------------:|:-----------:|:------:|:--------:|:-------:|
| Auto-memory | ✅ | ✅ | ❌ | ✅ | ❌ |
| Convention extraction | ✅ | ❌ | ❌ | ❌ | ❌ |
| Skill library | ✅ | ❌ | ❌ | ❌ | ❌ |
| Reflexion loop | ✅ | ❌ | ❌ | ❌ | ❌ |
| Git-based learning | ✅ | ❌ | ❌ | ❌ | ❌ |
| Adaptive context | ✅ | ❌ | ❌ | ❌ | ❌ |
| Self-optimization | ✅ | ❌ | ❌ | ❌ | ❌ |
| Open source | ✅ | ❌ | ❌ | ❌ | ❌ |
| Privacy-first | ✅ | Partial | ❌ | ❌ | ❌ |

**Voracode Evolve would be the FIRST open-source self-learning AI coding system.**

---

## Implementation Priority

| Priority | Feature | Effort | Impact | Week |
|:--------:|---------|--------|--------|------|
| **P0** | Auto-memory system | 2-3w | 🔴 Very High | 1-3 |
| **P0** | Convention extraction | 2-3w | 🔴 Very High | 2-4 |
| **P1** | Feedback signals | 2-3w | 🟠 High | 3-5 |
| **P1** | Reflexion loop | 1-2w | 🟠 High | 5-6 |
| **P1** | Skill library | 3-4w | 🟠 High | 5-8 |
| **P2** | Adaptive context | 2w | 🟡 Medium | 9-10 |
| **P2** | Memory consolidation | 2w | 🟡 Medium | 10-11 |
| **P3** | Memory graph | 4-6w | 🟡 Medium | 12-16 |
| **P4** | Self-optimization | 6-8w | 🟢 Lower | 17+ |

---

## Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Memory bloat | High | Auto-pruning, size limits, consolidation |
| Stale/contradictory memories | High | Temporal ordering, confidence scores |
| Hallucinated lessons | Medium | Ground in actual outcomes (git, tests) |
| Privacy concerns | Medium | Local-only by default, no cloud sync |
| Performance overhead | Medium | Lazy loading, background processing |
| Cross-project contamination | Medium | Strict project scoping |
| Users don't trust auto-memory | High | Transparency: show all stored data |

---

## The Vision

**Month 1:** Voracode remembers your conventions and preferences.

**Month 3:** Voracode learns from its mistakes and suggests better approaches.

**Month 6:** Voracode has a library of proven patterns for your project.

**Month 12:** Voracode is genuinely better at coding in YOUR project than a generic AI.

**The flywheel:**
```
More usage → More memories → Better context → Better output → More usage
```

This is what makes Voracode different. Not another wrapper around an API. A system that **evolves**.

---

## Next Steps

1. Review and approve this design document
2. Create detailed technical specs for P0 features
3. Set up the `.voracode/memory/` infrastructure
4. Implement auto-memory extraction prompt
5. Build convention detection pipeline
6. Alpha test with real projects
7. Iterate based on feedback

---

*"The best AI coding assistant is the one that knows YOUR code better than you do."*
