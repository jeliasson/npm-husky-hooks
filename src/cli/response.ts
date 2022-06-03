import { CommandResponse, HookResponse } from '../types'

/**
 * Throw success
 *
 * @param   <string[]>  messages
 * @returns <Error>
 */
export function ThrowSuccess(messages: string[]): Error {
  const formated = messages.map((message) => `${message}`).join('\n')

  console.log(`\n✅ All good!\n\n${formated}`)

  process.exit(0)
}

/**
 * Throw errors
 *
 * @param   <string[]>  messages
 * @returns <Error>
 */
export function ThrowError(messages: string[]): Error {
  const formated = messages.map((message) => `${message}`).join('\n')

  console.log(`❌\n\n❌ Error\n\n${formated}`)

  process.exit(1)
}

/**
 * Throw exceptions
 *
 * @param   <string[]>  messages
 * @returns <Error>
 */
export function ThrowException(messages: string[]): Error {
  const formated = messages.map((message) => `${message}`).join('\n')

  throw new Error(`\n\n💀 Exception\n\n${formated}\n\n🐛 Stack trace\n`)
}

/**
 * Construct command response
 *
 * @returns <CommandResponse>
 */
export function useCommandResponse(): CommandResponse {
  const stdout: string[] = []
  const errors: string[] = []

  return {
    stdout,
    errors,
  }
}

/**
 * Construct hook response
 *
 * @returns <HookResponse>
 */
export function useHookResponse(): HookResponse {
  const stdout: string[] = []
  const errors: string[] = []

  return {
    stdout,
    errors,
  }
}
