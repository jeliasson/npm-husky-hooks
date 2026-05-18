import { CONFIG_FILE, PACKAGE_NAME, createConfig } from './config'
import { Commands } from './types'

import { CLIParser } from './cli'
import { ThrowError, ThrowSuccess, createResponse } from './response'

export async function createConfigCommand(): Promise<{ stdout: string[]; errors: string[] }> {
  const { stdout, errors } = createResponse()

  const cli = await CLIParser()
  const { force } = cli.opts

  const config = await createConfig(force === true || false)

  if (config) ThrowSuccess([`Config file '${CONFIG_FILE}' was created.`])

  return { stdout, errors }
}

export const commands: Commands = {
  'create-config': createConfigCommand,
}

export async function runCommand(name: string): Promise<boolean> {
  if (!name) {
    ThrowError([
      `Missing command, e.g. create-config.`,
      ``,
      `> npx ${PACKAGE_NAME} create-config`,
    ])
  }

  const command = commands[name]
  if (typeof command === 'function') {
    await command()
    return true
  }

  return false
}
