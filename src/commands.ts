import { CONFIG_FILE, PACKAGE_NAME, createConfig } from './config'
import { CommandResponse, Commands } from './types'

import { CLIParser } from './cli'
import { ThrowError } from './response'

export async function createConfigCommand(): Promise<CommandResponse> {
  const cli = await CLIParser()
  const { force } = cli.opts

  const created = await createConfig(force === true || false)

  return {
    stdout: created ? [`Config file '${CONFIG_FILE}' was created.`] : [],
    errors: [],
  }
}

export const commands: Commands = {
  'create-config': createConfigCommand,
}

export async function runCommand(name: string): Promise<CommandResponse | false> {
  if (!name) {
    ThrowError([
      `Missing command, e.g. create-config.`,
      ``,
      `> npx ${PACKAGE_NAME} create-config`,
    ])
  }

  const command = commands[name]
  if (typeof command === 'function') {
    return await command()
  }

  return false
}
