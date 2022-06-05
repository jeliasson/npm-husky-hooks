import { execSync } from 'child_process'

import { CONFIG_FILE } from '../config'
import { HookResponse } from '../types/hooks'

import { ThrowError, useHookResponse } from '../cli/response'

export async function runCmd(command: string): Promise<HookResponse> {
  const { stdout, errors } = useHookResponse()

  if (!command)
    ThrowError([
      `Command to run is empty.`,
      `It's probabaly a typo in the hooks section of the ${CONFIG_FILE} config file.`,
      '',
      'Example:',
      "['run-cmd', 'yarn lint']",
    ])

  try {
    // Exec command
    const exec = execSync(command, {
      stdio: ['ignore'],
    })

    // Format output
    // @todo: Refactor this to exec package
    const output = exec.toString('utf8').replace(/[\n\r\s]+$/, '')

    // Push to stdout
    stdout.push(output)
  } catch (error) {
    //const errorMessage = error.message.replace(/[\n\r\s]+$/, '')
    //@ts-expect-error @todo We need to fix this
    ThrowError([error])
  }

  return { stdout, errors }
}
