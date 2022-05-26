/**
 * Handle errors
 *
 * @param   <string[]>  messages
 * @returns <Error>
 */
export function ThrowError(messages: string[]): Error {
  const formated = messages.map((message) => `${message}`).join('\n')

  throw new Error(`\n\n💀 Exception\n\n${formated}\n`)
}
