import { execSync } from 'child_process'

import { ThrowError } from '../cli'
import { HookResponse } from '../types'

export async function runCmd(command: string): Promise<HookResponse> {
  const stdout: string[] = []
  const errors: string[] = []

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
