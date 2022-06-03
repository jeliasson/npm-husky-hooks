import { CLIParser, ThrowSuccess, useCommandResponse } from '../cli'
import { CONFIG_FILE, createConfig } from '../config'
import { CommandResponse } from '../types'

export async function createConfigCommand(): Promise<CommandResponse> {
  const { stdout, errors } = useCommandResponse()

  const cli = await CLIParser()
  const force = cli.opts.force

  const config = await createConfig(force === true || false)

  if (config) ThrowSuccess([`Config file '${CONFIG_FILE}' was created.`])

  return { stdout, errors }
}
