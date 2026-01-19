import { createTwoFilesPatch } from "diff"
import type { DiffFileSummary, FileDiff, UnifiedDiffResult } from "./types"

const CONTEXT_LINES = 3

export function normalizeText(value: string): string {
  if (!value) {
    return ""
  }
  const normalized = value.replace(/\r\n/g, "\n").replace(/\r/g, "\n")
  return normalized.endsWith("\n") ? normalized : `${normalized}\n`
}

export function summarizeFileDiff(fileDiff: FileDiff): DiffFileSummary {
  const beforeEmpty = !fileDiff.before
  const afterEmpty = !fileDiff.after

  let status: DiffFileSummary["status"] = "modified"
  if (beforeEmpty && !afterEmpty) {
    status = "added"
  } else if (!beforeEmpty && afterEmpty) {
    status = "deleted"
  }

  return {
    file: fileDiff.file,
    additions: fileDiff.additions,
    deletions: fileDiff.deletions,
    status,
  }
}

export function buildUnifiedDiff(fileDiffs: FileDiff[]): UnifiedDiffResult {
  const sorted = [...fileDiffs].sort((a, b) => a.file.localeCompare(b.file))

  const patches: string[] = []
  const summaries: DiffFileSummary[] = []
  let additions = 0
  let deletions = 0

  for (const diff of sorted) {
    const before = normalizeText(diff.before)
    const after = normalizeText(diff.after)

    if (before === after) {
      continue
    }

    const patch = createTwoFilesPatch(
      `a/${diff.file}`,
      `b/${diff.file}`,
      before,
      after,
      "",
      "",
      { context: CONTEXT_LINES }
    ).trimEnd()

    patches.push(patch)
    summaries.push(summarizeFileDiff(diff))
    additions += diff.additions
    deletions += diff.deletions
  }

  return {
    patch: patches.length ? `${patches.join("\n\n")}\n` : "",
    files: summaries,
    additions,
    deletions,
  }
}
