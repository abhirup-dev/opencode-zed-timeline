# Conventions: Code Style for opencode-zed-timeline

## TypeScript Configuration
- **Target**: ES2022
- **Module System**: ESNext
- **Module Resolution**: Bundler
- **Strict Mode**: Enabled (`strict: true`)
- **No Emit**: Type-check only (`noEmit: true`)
- **Type Definitions**: `bun-types` and `node` types included

## Naming Conventions
- **Files**: kebab-case (`storage.ts`, `build-unified-diff.ts`)
- **Types**: PascalCase (`FileDiff`, `TimelineState`, `TimelineEntryMeta`)
- **Functions**: camelCase (`writeTimelineEntry`, `readState`)
- **Constants**: UPPER_SNAKE_CASE with top-level or module-level (`META_FILENAME`, `PATCH_FILENAME`, `CONTEXT_LINES`)
- **Type Parameters**: PascalCase (`T`)

## Code Organization

### Import Style
```typescript
// 1. Node.js built-ins
import path from "node:path"
import { readFile } from "node:fs/promises"

// 2. External dependencies
import { createTwoFilesPatch } from "diff"

// 3. Internal modules
import { ensureTimelinePaths, type TimelinePaths } from "./paths"
import type { TimelineEntryMeta } from "./types"
```

### Export Style
- **Named exports only**: No default exports
- **Export types separately**: Use `export type` for type-only exports
- **Group related exports**: Keep type and value exports together

## Type Definitions
```typescript
// Interface for object types
export type FileDiff = {
  file: string
  before: string
  after: string
  additions: number
  deletions: number
}

// Optional properties with explicit undefined
export type TimelineState = {
  sessionID?: string
  entryCounter: number
  touchedFiles: string[]
  lastUserMessageID?: string
  lastRecordedMessageID?: string
  lastDiffHash?: string
  updatedAt: number
}
```

## Function Definitions
```typescript
// Async functions
export async function writeTimelineEntry(options: {
  paths: TimelinePaths
  messageID?: string
  sessionID: string
  patch: string
  files: DiffFileSummary[]
  touchedFiles: string[]
  entryCounter: number
}): Promise<EntryWriteResult> {
  // implementation
}

// Simple functions
export function hashDiff(diffText: string): string {
  return createHash("sha256").update(diffText).digest("hex")
}
```

## Error Handling
```typescript
// Type assertion for error objects
catch (error) {
  const err = error as NodeJS.ErrnoException
  if (err.code !== "ENOENT") {
    throw error
  }
}
```

## File I/O
- Use `node:fs/promises` for async file operations
- Use `node:path` for path manipulation (posix paths)
- Use `node:crypto` for hashing

## Default Values
```typescript
// Merge defaults with loaded state
const parsed = JSON.parse(contents) as TimelineState
return { ...DEFAULT_STATE, ...parsed }
```

## Constants
```typescript
const CONTEXT_LINES = 3
const META_FILENAME = "meta.json"
const SERVICE = "opencode-zed-timeline"
```

## Type Assertions
```typescript
// Prefer type assertions over type annotations for parsed JSON
const meta = await readJsonIfExists<TimelineEntryMeta>(metaPath)

// Type annotation for function returns
export function formatEntryPrefix(counter: number): string {
  return String(counter).padStart(6, "0")
}
```

## No Linting/Formatting
This project does NOT have ESLint or Prettier configured. Manual formatting conventions:
- 2-space indentation
- Trailing commas in multi-line objects/arrays
- Blank lines between logical sections
- Consistent spacing around operators

## Anti-Patterns
- **Do NOT create index.ts barrel file** (design choice)
- **Do NOT use default exports** (named exports only)
- **Do NOT use `any` type** (strict mode enforced)
- **Do NOT suppress type errors** (`@ts-ignore`, `as any`)
- **Do NOT use npm** (Bun runtime)
