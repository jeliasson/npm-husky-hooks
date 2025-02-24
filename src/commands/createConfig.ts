import { CONFIG_FILE, createConfig } from '../config.ts'
import { CommandResponse } from '../types/commands.ts'

import { CLIParser } from '../cli.ts'
import { ThrowSuccess, useCommandResponse } from '../cli/response.ts'

export async function createConfigCommand(): Promise<CommandResponse> {
  const { stdout, errors } = useCommandResponse()

  const cli = await CLIParser()
  const { force } = cli.opts

  const config = await createConfig(force === true || false)

  if (config) ThrowSuccess([`Config file '${CONFIG_FILE}' was created.`])

  return { stdout, errors }
}
