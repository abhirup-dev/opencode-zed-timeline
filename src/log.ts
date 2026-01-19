type LogLevel = "debug" | "info" | "warn" | "error"

type LogClient = {
  app?: {
    log: (entry: {
      service: string
      level: LogLevel
      message: string
      extra?: Record<string, unknown>
    }) => Promise<void>
  }
}

const SERVICE = "opencode-zed-timeline"

export function createLogger(client?: LogClient) {
  const send = async (level: LogLevel, message: string, extra?: Record<string, unknown>) => {
    if (client?.app?.log) {
      await client.app.log({ service: SERVICE, level, message, extra })
      return
    }

    const details = extra ? ` ${JSON.stringify(extra)}` : ""
    console.log(`[${SERVICE}] ${level.toUpperCase()}: ${message}${details}`)
  }

  return {
    debug: (message: string, extra?: Record<string, unknown>) => send("debug", message, extra),
    info: (message: string, extra?: Record<string, unknown>) => send("info", message, extra),
    warn: (message: string, extra?: Record<string, unknown>) => send("warn", message, extra),
    error: (message: string, extra?: Record<string, unknown>) => send("error", message, extra),
  }
}
