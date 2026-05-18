import { spawnSync } from 'node:child_process'

import { CONFIG_FILE } from '../config'
import { HookResponse } from '../types'

import { ThrowError, createResponse } from '../response'

export async function runCmd(command: string): Promise<HookResponse> {
  const { stdout, errors } = createResponse()

  if (!command)
    ThrowError([
      `Command to run is empty.`,
      `It's probably a typo in the hooks section of the ${CONFIG_FILE} config file.`,
      '',
      'Example:',
      "['run-cmd', 'npm run lint']",
    ])

  const result = spawnSync(command, {
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  if (result.status !== 0) {
    const errorOutput = result.stderr?.toString('utf8').replace(/[\n\r\s]+$/, '')
      || result.stdout?.toString('utf8').replace(/[\n\r\s]+$/, '')
      || `Command "${command}" exited with code ${result.status}`
    errors.push(errorOutput)
    return { stdout, errors }
  }

  if (result.stdout) {
    const output = result.stdout.toString('utf8').replace(/[\n\r\s]+$/, '')
    if (output) stdout.push(output)
  }

  return { stdout, errors }
}
