import { execSync } from 'child_process'

import { ThrowError, useHookResponse } from '../cli/response'
import { CONFIG_FILE } from '../config'
import { HookResponse } from '../hooks/index.types'

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
    const output = execSync(command, {
      stdio: ['ignore'],
    })
      .toString('utf8')
      .replace(/[\n\r\s]+$/, '')

    stdout.push(output)
  } catch (error) {
    //const errorMessage = error.message.replace(/[\n\r\s]+$/, '')
    //@ts-expect-error @todo We need to fix this
    ThrowError([error])
  }

  return { stdout, errors }
}
