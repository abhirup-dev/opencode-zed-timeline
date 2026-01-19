# Suggested Commands for opencode-zed-timeline

## Development Commands

### Install Dependencies
```bash
bun install
```

### Type Check
```bash
bun run typecheck
# or
tsc --noEmit
```

### Run Tests
```bash
bun test
```

### Build
No build step required. TypeScript is configured with `noEmit: true` for type-check only.

## Utility Commands

### Git Status
```bash
git status
```

### List Source Files
```bash
ls -la src/
```

### Check Timeline Entries
```bash
ls -la .opencode/timeline/entries/
```

### View Timeline Index
```bash
cat .opencode/timeline/index.json
```

### View Timeline State
```bash
cat .opencode/timeline/state.json
```

### View Specific Timeline Entry
```bash
ls .opencode/timeline/entries/
cat .opencode/timeline/entries/<entry_id>/meta.json
cat .opencode/timeline/entries/<entry_id>/patch.diff
```

## Notes
- No linting or formatting configured in this project
- Tests directory exists but contains no test files
- Uses Bun runtime, not npm
- Project uses TypeScript strict mode with no compilation output
