import { HookResponse } from './types'

export class CLIError extends Error {
  constructor(
    public messages: string[],
    public exitCode = 1,
  ) {
    super(messages.join('\n'))
    this.name = 'CLIError'
  }
}

export function ThrowError(messages: string[]): never {
  throw new CLIError(messages, 1)
}

export function ThrowException(messages: string[]): never {
  const formatted = messages.join('\n')
  throw new Error(`\n\nException\n\n${formatted}\n\nStack trace\n`)
}

export function createResponse(): HookResponse {
  return { stdout: [], errors: [] }
}
