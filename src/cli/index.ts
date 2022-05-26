import { hideBin } from 'yargs/helpers'
import yargs from 'yargs/yargs'

// @todo: Type and jsdoc
export async function CLIParser() {
  const _argv = await yargs(hideBin(process.argv)).argv

  // Construct arguments
  const args = _argv._

  // Construct options
  const opts: any = {}
  Object.keys(_argv).map(function (something) {
    if (something !== '_' && something.substring(0, 1) !== '$') {
      opts[something] = _argv[something]
    }
  })

  return {
    _argv,
    args,
    opts,
  }
}

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

  console.log(`\n❌ Error\n\n${formated}`)

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
