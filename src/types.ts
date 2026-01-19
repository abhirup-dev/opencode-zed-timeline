export type FileDiff = {
  file: string
  before: string
  after: string
  additions: number
  deletions: number
}

export type DiffFileSummary = {
  file: string
  additions: number
  deletions: number
  status: "added" | "deleted" | "modified"
}

export type TimelineState = {
  sessionID?: string
  entryCounter: number
  touchedFiles: string[]
  lastUserMessageID?: string
  lastRecordedMessageID?: string
  lastDiffHash?: string
  updatedAt: number
}

export type TimelineEntryMeta = {
  id: string
  sessionID: string
  messageID?: string
  createdAt: number
  diffHash: string
  stats: {
    files: number
    additions: number
    deletions: number
  }
  files: DiffFileSummary[]
  touchedFiles: string[]
}

export type UnifiedDiffResult = {
  patch: string
  files: DiffFileSummary[]
  additions: number
  deletions: number
}
