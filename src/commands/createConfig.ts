import { CLIParser, ThrowSuccess } from '../cli'
import { CONFIG_FILE, createConfig } from '../config'
import { TCommandResponse } from '../types'

// @todo Fix better typing
export async function createConfigCommand(): Promise<TCommandResponse> {
  const stdout: string[] = []
  const errors: string[] = []

  const cli = await CLIParser()
  const force = cli.opts.force

  const config = await createConfig(force === true || false)

  if (config) ThrowSuccess([`Config file '${CONFIG_FILE}' was created.`])

  return { stdout, errors }
}
