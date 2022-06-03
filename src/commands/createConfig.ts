import { CLIParser } from '../cli'
import { ThrowSuccess, useCommandResponse } from '../cli/response'
import { CommandResponse } from '../commands/index.types'
import { CONFIG_FILE, createConfig } from '../config'

export async function createConfigCommand(): Promise<CommandResponse> {
  const { stdout, errors } = useCommandResponse()

  const cli = await CLIParser()
  const force = cli.opts.force

  const config = await createConfig(force === true || false)

  if (config) ThrowSuccess([`Config file '${CONFIG_FILE}' was created.`])

  return { stdout, errors }
}
