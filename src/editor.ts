import path from "node:path"

export type EditorCommand = {
  command: string
  args: string[]
}

export function resolveEditorCommand(env = process.env): EditorCommand {
  const raw = env.VISUAL || env.EDITOR || "vi"
  return parseCommand(raw)
}

export function parseCommand(input: string): EditorCommand {
  const args: string[] = []
  let current = ""
  let quote: '"' | "'" | null = null

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i]

    if (quote) {
      if (char === quote) {
        quote = null
        continue
      }
      if (char === "\\" && i + 1 < input.length) {
        i += 1
        current += input[i]
        continue
      }
      current += char
      continue
    }

    if (char === "'" || char === '"') {
      quote = char
      continue
    }

    if (char === " ") {
      if (current) {
        args.push(current)
        current = ""
      }
      continue
    }

    current += char
  }

  if (current) {
    args.push(current)
  }

  if (!args.length) {
    return { command: "vi", args: [] }
  }

  const [command, ...rest] = args
  return { command, args: rest }
}

export async function openFileInEditor(
  filePath: string,
  editor: EditorCommand,
  cwd: string
): Promise<void> {
  const absolute = path.resolve(filePath)
  const command = [editor.command, ...editor.args, absolute]

  const process = Bun.spawn({
    cmd: command,
    cwd,
    stdout: "inherit",
    stderr: "inherit",
    stdin: "inherit",
  })

  await process.exited
}
