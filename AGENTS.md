# Agent Instructions

**Generated:** 2026-01-19
**Branch:** main

## OVERVIEW

Zed editor plugin (TypeScript/Bun) for OpenCode AI that captures code changes as a timeline during AI-assisted coding sessions. Stores unified diffs with SHA256 deduplication in `.opencode/timeline/` per project.

## STRUCTURE

```
opencode-zed-timeline/
├── src/               # All source code (7 modules)
│   ├── types.ts       # FileDiff, TimelineState, TimelineEntryMeta
│   ├── storage.ts     # writeTimelineEntry, exportTimelineIndex, hashDiff
│   ├── state.ts       # readState, writeState, updateTouchedFiles
│   ├── diff.ts        # buildUnifiedDiff, summarizeFileDiff
│   ├── paths.ts       # buildTimelinePaths, ensureTimelineDirs
│   ├── editor.ts      # openFileInEditor, resolveEditorCommand
│   └── log.ts         # Structured logging
├── .beads/            # Issue tracking (bd commands)
├── package.json       # Bun + @opencode-ai/plugin + diff
├── tsconfig.json      # ES2022/ESNext/Bundler, strict
└── Makefile           # Wraps bun commands
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Timeline entry creation | `src/storage.ts` | writeTimelineEntry, hashDiff |
| Session state management | `src/state.ts` | Entry counters, touched files |
| Diff generation | `src/diff.ts` | buildUnifiedDiff, text normalization |
| Path resolution | `src/paths.ts` | .opencode/timeline/ structure |
| Type definitions | `src/types.ts` | All interfaces |

## CONVENTIONS

- **No index.ts**: Library of modules with named exports. Import specific functions.
- **Bun runtime**: Use `bun` not `npm`. Package resolution via Bundler.
- **Type-check only**: `noEmit: true`. No compilation step.
- **@opencode-ai/plugin**: Framework dependency for plugin integration.

## ANTI-PATTERNS

- Do NOT create index.ts barrel file (design choice: selective imports)
- Do NOT add ESLint/Prettier (not configured in this project)
- Do NOT use npm (Bun is the runtime)

## COMMANDS

```bash
bun install           # Install dependencies
bun run typecheck     # tsc --noEmit (type check only)
bun test              # Run tests (none exist yet)
```

## NOTES

- SHA256 hashing for deduplication is "best effort" (collision documented as acceptable)
- Timeline entries stored per-project in `.opencode/timeline/`
- Tests directory configured but no test files exist yet

---

## Beads Workflow

This project uses **bd** (beads) for issue tracking. Run `bd onboard` to get started.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --status in_progress  # Claim work
bd close <id>         # Complete work
bd sync               # Sync with git
```

### Session Close Protocol

**Before ending any session**, complete ALL steps:

1. `git status` - Check what changed
2. `git add <files>` - Stage code changes  
3. `bd sync` - Commit beads changes
4. `git commit -m "..."` - Commit code
5. `git push` - **MANDATORY** - Work is NOT complete until push succeeds

**CRITICAL**: NEVER stop before pushing. NEVER say "ready to push when you are" - YOU must push.
