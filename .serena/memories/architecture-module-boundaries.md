# Architecture: Module Boundaries for opencode-zed-timeline

## Module Organization
Library-style architecture with 7 focused modules. No barrel file pattern - imports use named exports from specific modules.

## Module Responsibilities

### types.ts
**Purpose**: Core type definitions and interfaces
**Exports**:
- `FileDiff`: Represents a single file diff (file path, before/after content, additions/deletions)
- `DiffFileSummary`: Summarized file diff with status (added/deleted/modified)
- `TimelineState`: Session state (entry counter, touched files, session/message IDs)
- `TimelineEntryMeta`: Timeline entry metadata (ID, timestamps, diff hash, stats)
- `UnifiedDiffResult`: Complete diff result with patch text and aggregated stats

**Usage**: Imported by all other modules as the single source of type truth

### storage.ts
**Purpose**: Timeline entry persistence and deduplication
**Key Functions**:
- `writeTimelineEntry()`: Write entry with SHA256 deduplication
- `exportTimelineIndex()`: Generate aggregated index of all entries
- `hashDiff()`: Generate SHA256 hash of diff text
- `findExistingEntryDir()`: Find existing entry directory by message ID

**Design Notes**:
- Deduplication: Compares SHA256 hashes to skip identical diffs
- Revision history: Stores previous versions in `revisions/` subdirectory when diff changes
- Uses standard JSON files with 2-space indentation

### state.ts
**Purpose**: Session state management
**Key Functions**:
- `readState()`: Read state from file with defaults
- `writeState()`: Write state with timestamp update
- `updateTouchedFiles()`: Merge touched files (deduplicated, sorted)

**Design Notes**:
- Defensive merging: Always includes defaults from DEFAULT_STATE
- Sorted touched files: Uses Set for deduplication, converts to sorted array
- Automatic timestamp: Updates `updatedAt` on every write

### diff.ts
**Purpose**: Diff generation and summarization
**Key Functions**:
- `buildUnifiedDiff()`: Generate unified diff from file diffs
- `summarizeFileDiff()`: Determine file status (added/deleted/modified)
- `normalizeText()`: Normalize line endings (CRLF -> LF, ensure trailing newline)

**Design Notes**:
- Sorted output: File diffs sorted alphabetically by path
- Context lines: 3 lines of context in unified diff
- Skips unchanged files: Filters out files with identical before/after content

### paths.ts
**Purpose**: Path resolution and directory structure
**Key Functions**:
- `buildTimelinePaths()`: Build all timeline-related paths from project root
- `ensureTimelineDirs()`: Create required directories under `.opencode/timeline/`
- `formatEntryPrefix()`: Format entry counter as 6-digit padded string
- `sanitizeEntryId()`: Sanitize message IDs for filesystem usage

**Design Notes**:
- Project boundary: Only creates directories under `.opencode/timeline/`
- No parent directory creation: Assumes `.opencode/` exists
- Filesystem-safe IDs: Replaces slashes and spaces with underscores

### editor.ts
**Purpose**: Editor command resolution and file opening
**Key Functions**:
- `resolveEditorCommand()`: Resolve editor from VISUAL/EDITOR env vars
- `parseCommand()`: Parse shell command string (supports quotes and escaping)
- `openFileInEditor()`: Open file in configured editor using Bun.spawn

**Design Notes**:
- Fallback: Defaults to `vi` if no editor configured
- Shell-like parsing: Handles quoted arguments and backslash escaping
- Inherited streams: Spawns editor with inherited stdio

### log.ts
**Purpose**: Structured logging
**Key Functions**:
- `createLogger()`: Create logger with optional LogClient support
- Returns logger with debug, info, warn, error methods

**Design Notes**:
- Service name: "opencode-zed-timeline" (prefixed to all logs)
- Dual output: Uses LogClient.app.log if available, otherwise console
- Extra metadata: Optional extra field for structured data

## Module Dependencies
```
storage.ts -> types.ts, paths.ts
state.ts -> types.ts, paths.ts
diff.ts -> types.ts
paths.ts -> (no dependencies)
editor.ts -> (no dependencies)
log.ts -> (no dependencies)
```

## Import Pattern
Import specific functions/types from modules:
```typescript
import { writeTimelineEntry } from "./storage"
import { buildTimelinePaths } from "./paths"
import type { TimelineState } from "./types"
```

**Do NOT**: Create or use index.ts barrel file
**Do NOT**: Import entire module (`import * as storage`)
