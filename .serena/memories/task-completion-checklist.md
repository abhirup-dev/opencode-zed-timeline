# Task Completion Checklist for opencode-zed-timeline

## After Code Changes

### Type Checking
**MANDATORY**: Always run type checking before marking task complete
```bash
bun run typecheck
# or
tsc --noEmit
```

**Expected Result**: No type errors (exit code 0)

### Verification
- Check `lsp_diagnostics` on changed files if using language server
- Ensure no TypeScript errors remain

## After Task Complete

### Git Status
```bash
git status
```

### Stage Changes
```bash
git add <changed-files>
# or
git add src/
```

### Commit
```bash
git commit -m "descriptive commit message"
```

### Beads Sync (if using bd)
```bash
bd sync --from-main
```

### Beads Close (if closing issues)
```bash
bd close <issue-id> --reason "completed task"
```

## When Working with Timeline Storage

### Verify Entry Structure
```bash
# List entries
ls -la .opencode/timeline/entries/

# Check entry contents
cat .opencode/timeline/entries/<entry-id>/meta.json
cat .opencode/timeline/entries/<entry-id>/patch.diff
```

### Verify Index
```bash
# Regenerate index
# (Need to call exportTimelineIndex function)
```

## When Modifying Core Types

### Update All Dependent Modules
After changing types in `types.ts`:
1. Run `bun run typecheck` to catch all affected modules
2. Update all dependent modules
3. Re-run type checking

## Before Session End

### Check for Uncommitted Changes
```bash
git status
```

### Sync Beads
```bash
bd sync --from-main
```

### Commit Everything
```bash
git add .
git commit -m "session summary"
```

## Notes

### No Build Step
This project does NOT have a compilation step. TypeScript is configured with `noEmit: true` for type-check only.

### No Tests Currently
Tests directory exists but contains no test files. Type checking is the primary verification method.

### No Linting/Formatting
No ESLint or Prettier configured. Manual code review required for style consistency.

### Beads Workflow
This project uses **bd** (beads) for issue tracking. See `AGENTS.md` for beads commands and workflow.

### Ephemeral Branch Work
According to beads context, work is on an ephemeral branch. Code is merged to main locally, not pushed. However, verify if this applies to your current workflow.
