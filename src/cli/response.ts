import process from 'process'

import { CommandResponse } from '../types/commands.ts'
import { HookResponse } from '../types/hooks.ts'

/**
 * Throw success
 *
 * @param   <string[]>  messages    Array of error messages
 * @returns <unkown>                Console.log formatted error messages
 *                                  with Process.exit(0)
 */
export function ThrowSuccess(messages: string[]): Error {
  const formated = messages.map((message) => `${message}`).join('\n')

  console.log(`\n✅ All good!\n\n${formated}`)

  process.exit(0)
}

/**
 * Throw errors
 *
 * @param   <string[]>  messages    Array of error messages
 * @returns <Error>                 Console.log formatted error messages
 *                                  with Process.exit(1)
 */
export function ThrowError(messages: string[], prefixStopSign = true): Error {
  const formated = messages.map((message) => `${message}`).join('\n')

  console.log(`${prefixStopSign ? '❌' : ''}\n❌ Error\n\n${formated}`)

  process.exit(1)
}

/**
 * Throw exceptions
 *
 * @param   <string[]>  messages    Array of error messages
 * @returns <Error>                 New error with formatted messages
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
