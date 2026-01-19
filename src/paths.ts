import path from "node:path"
import { mkdir } from "node:fs/promises"

export type TimelinePaths = {
  root: string
  timelineDir: string
  entriesDir: string
  tmpDir: string
  indexFile: string
  stateFile: string
}

export function buildTimelinePaths(root: string): TimelinePaths {
  const timelineDir = path.join(root, ".opencode", "timeline")

  return {
    root,
    timelineDir,
    entriesDir: path.join(timelineDir, "entries"),
    tmpDir: path.join(timelineDir, "tmp"),
    indexFile: path.join(timelineDir, "index.json"),
    stateFile: path.join(timelineDir, "state.json"),
  }
}

export async function ensureTimelineDirs(paths: TimelinePaths): Promise<void> {
  // Only write under .opencode/timeline to respect project boundaries.
  await mkdir(paths.entriesDir, { recursive: true })
  await mkdir(paths.tmpDir, { recursive: true })
}

export function formatEntryPrefix(counter: number): string {
  return String(counter).padStart(6, "0")
}

export function sanitizeEntryId(value: string): string {
  return value.replace(/[\\/\s]/g, "_")
}
