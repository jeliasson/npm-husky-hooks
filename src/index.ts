import { getConfig, PACKAGE_NAME, validateConfig } from './config'

import { CLIParser } from './cli'
import { CLIError, ThrowError } from './response'

import { runCommand } from './commands'
import { runHook } from './hooks'

function parseHook(hook: string | [string, string]): { name: string; arg?: string } {
  if (typeof hook === 'string') return { name: hook }
  return { name: hook[0], arg: hook[1] }
}

export async function init(): Promise<void> {
  const { args, opts } = await CLIParser()

  const [command] = args
  const handled = await runCommand(command)
  if (handled) return

  const config = await getConfig()
  await validateConfig(config)

  const allHooks = config.hooks[command]

  if (!allHooks) {
    ThrowError([
      `Unknown command ${command}.`,
      '',
      ...Object.keys(config.hooks).map((cmd) => `> npx ${PACKAGE_NAME} ${cmd}`),
    ])
  }

  for (const hook of allHooks) {
    const { name, arg } = parseHook(hook)

    const label = arg
      ? `Running hook ${name} with argument '${arg}'... `
      : `Running hook ${name}... `
    process.stdout.write(label)

    try {
      const response = await runHook(name, arg)

      if (response.errors.length > 0) {
        console.log('FAIL')
        console.log()
        response.errors.forEach((error: string) => console.log(error))
        throw new CLIError([], 1)
      }

      console.log('OK')

      if (opts.stdout && response.stdout.length > 0) {
        console.log()
        response.stdout.forEach((line: string) => console.log(line))
        console.log()
      }
    } catch (error) {
      if (error instanceof CLIError) throw error
      throw new CLIError([String(error)], 1)
    }
  }
}
