import path from "node:path"
import { createHash } from "node:crypto"
import { readFile, readdir, writeFile, mkdir } from "node:fs/promises"
import { ensureTimelineDirs, formatEntryPrefix, sanitizeEntryId, type TimelinePaths } from "./paths"
import type { DiffFileSummary, TimelineEntryMeta } from "./types"

export type EntryWriteResult = {
  entryDir: string
  meta: TimelineEntryMeta
  skipped: boolean
}

const META_FILENAME = "meta.json"
const PATCH_FILENAME = "patch.diff"
const PATCH_FILES_FILENAME = "patch.files.json"
const TOUCHED_FILES_FILENAME = "touched.files.json"

export function hashDiff(diffText: string): string {
  return createHash("sha256").update(diffText).digest("hex")
}

export async function findExistingEntryDir(
  paths: TimelinePaths,
  messageID: string
): Promise<string | null> {
  try {
    const entries = await readdir(paths.entriesDir)
    const suffix = `_${sanitizeEntryId(messageID)}`

    for (const entry of entries) {
      if (entry.endsWith(suffix)) {
        return path.join(paths.entriesDir, entry)
      }
    }
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    if (err.code !== "ENOENT") {
      throw error
    }
  }

  return null
}

export async function writeTimelineEntry(options: {
  paths: TimelinePaths
  messageID?: string
  sessionID: string
  patch: string
  files: DiffFileSummary[]
  touchedFiles: string[]
  entryCounter: number
}): Promise<EntryWriteResult> {
  const { paths, messageID, sessionID, patch, files, touchedFiles, entryCounter } = options
  await ensureTimelineDirs(paths)

  const safeMessageID = messageID ? sanitizeEntryId(messageID) : "session"
  const existingDir = messageID ? await findExistingEntryDir(paths, messageID) : null
  const entryPrefix = existingDir ? path.basename(existingDir).split("_")[0] : formatEntryPrefix(entryCounter)
  const entryName = `${entryPrefix}_${safeMessageID}`
  const entryDir = existingDir ?? path.join(paths.entriesDir, entryName)

  if (!existingDir) {
    await mkdir(entryDir, { recursive: true })
  }

  const diffHash = hashDiff(patch)
  const meta: TimelineEntryMeta = {
    id: entryName,
    sessionID,
    messageID,
    createdAt: Date.now(),
    diffHash,
    stats: {
      files: files.length,
      additions: files.reduce((sum, file) => sum + file.additions, 0),
      deletions: files.reduce((sum, file) => sum + file.deletions, 0),
    },
    files,
    touchedFiles,
  }

  const metaPath = path.join(entryDir, META_FILENAME)
  const patchPath = path.join(entryDir, PATCH_FILENAME)
  const patchFilesPath = path.join(entryDir, PATCH_FILES_FILENAME)
  const touchedPath = path.join(entryDir, TOUCHED_FILES_FILENAME)

  const previousMeta = await readJsonIfExists<TimelineEntryMeta>(metaPath)
  if (previousMeta?.diffHash === diffHash) {
    return { entryDir, meta: previousMeta, skipped: true }
  }

  if (previousMeta) {
    const revisionsDir = path.join(entryDir, "revisions")
    await mkdir(revisionsDir, { recursive: true })
    const timestamp = Date.now()

    await writeFile(path.join(revisionsDir, `${timestamp}_meta.json`), JSON.stringify(previousMeta, null, 2))
    const previousPatch = await readFileIfExists(patchPath)
    if (previousPatch) {
      await writeFile(path.join(revisionsDir, `${timestamp}_patch.diff`), previousPatch)
    }
  }

  await writeFile(metaPath, JSON.stringify(meta, null, 2))
  await writeFile(patchPath, patch)
  await writeFile(patchFilesPath, JSON.stringify(files, null, 2))
  await writeFile(touchedPath, JSON.stringify(touchedFiles, null, 2))

  return { entryDir, meta, skipped: false }
}

export async function exportTimelineIndex(paths: TimelinePaths): Promise<void> {
  await ensureTimelineDirs(paths)
  const entries = await readdir(paths.entriesDir)
  const metas: TimelineEntryMeta[] = []

  for (const entry of entries.sort()) {
    const metaPath = path.join(paths.entriesDir, entry, META_FILENAME)
    const meta = await readJsonIfExists<TimelineEntryMeta>(metaPath)
    if (meta) {
      metas.push(meta)
    }
  }

  const totals = metas.reduce(
    (acc, meta) => {
      acc.files += meta.stats.files
      acc.additions += meta.stats.additions
      acc.deletions += meta.stats.deletions
      return acc
    },
    { files: 0, additions: 0, deletions: 0 }
  )

  const index = {
    generatedAt: Date.now(),
    entries: metas,
    totals,
  }

  await writeFile(paths.indexFile, JSON.stringify(index, null, 2))
}

async function readJsonIfExists<T>(filePath: string): Promise<T | null> {
  const content = await readFileIfExists(filePath)
  if (!content) {
    return null
  }
  return JSON.parse(content) as T
}

async function readFileIfExists(filePath: string): Promise<string | null> {
  try {
    return await readFile(filePath, "utf8")
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    if (err.code === "ENOENT") {
      return null
    }
    throw error
  }
}
