# Project Overview: opencode-zed-timeline

## Purpose
Zed editor plugin (TypeScript/Bun) for OpenCode AI that captures code changes as a timeline during AI-assisted coding sessions. Stores unified diffs with SHA256 deduplication in `.opencode/timeline/` per project.

## Tech Stack
- **Runtime**: Bun
- **Language**: TypeScript 5.6.3 (ES2022 target, ESNext modules)
- **Dependencies**:
  - `@opencode-ai/plugin`: Framework dependency for plugin integration
  - `diff`: Unified diff generation library (v5.2.0)
- **Dev Dependencies**:
  - `@types/node`: Node.js type definitions
  - `bun-types`: Bun-specific type definitions
  - `typescript`: TypeScript compiler

## Key Features
- **Timeline Entry Creation**: Captures code changes during AI sessions
- **SHA256 Deduplication**: Hash-based diff deduplication (best effort, documented collision risk)
- **Per-Project Storage**: Stores entries in `.opencode/timeline/` directory
- **Unified Diff Format**: Uses standard diff format with context lines
- **State Management**: Tracks entry counters, touched files, and session metadata
- **Entry Revisions**: Supports revision history when diffs change for same entry

## Architecture
Modular design with 7 focused modules:
- `types.ts`: Core type definitions (FileDiff, TimelineState, TimelineEntryMeta)
- `storage.ts`: Timeline entry persistence and index generation
- `state.ts`: Session state management
- `diff.ts`: Diff generation and file diff summarization
- `paths.ts`: Path resolution and directory structure
- `editor.ts`: Editor command resolution and file opening
- `log.ts`: Structured logging with service name support

## Storage Structure
```
.opencode/timeline/
├── entries/
│   ├── 000001_msg_id/
│   │   ├── meta.json
│   │   ├── patch.diff
│   │   ├── patch.files.json
│   │   ├── touched.files.json
│   │   └── revisions/ (optional)
│   └── 000002_another_msg/
├── index.json
└── state.json
```

## Constraints & Anti-Patterns
- No `index.ts` barrel file (design choice: selective imports)
- No ESLint/Prettier configured
- No compilation step (type-check only)
- SHA256 collision documented as acceptable risk
- Timeline entries stored only under `.opencode/timeline/` to respect project boundaries
