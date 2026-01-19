import { readFile, writeFile } from "node:fs/promises"
import { ensureTimelineDirs, type TimelinePaths } from "./paths"
import type { TimelineState } from "./types"

const DEFAULT_STATE: TimelineState = {
  entryCounter: 0,
  touchedFiles: [],
  updatedAt: Date.now(),
}

export async function readState(paths: TimelinePaths): Promise<TimelineState> {
  try {
    const contents = await readFile(paths.stateFile, "utf8")
    const parsed = JSON.parse(contents) as TimelineState
    return { ...DEFAULT_STATE, ...parsed }
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    if (err.code === "ENOENT") {
      return { ...DEFAULT_STATE }
    }
    throw error
  }
}

export async function writeState(paths: TimelinePaths, state: TimelineState): Promise<void> {
  await ensureTimelineDirs(paths)
  const nextState = { ...state, updatedAt: Date.now() }
  await writeFile(paths.stateFile, JSON.stringify(nextState, null, 2))
}

export function updateTouchedFiles(state: TimelineState, files: Iterable<string>): TimelineState {
  const merged = new Set(state.touchedFiles)
  for (const file of files) {
    merged.add(file)
  }
  return { ...state, touchedFiles: Array.from(merged).sort() }
}
