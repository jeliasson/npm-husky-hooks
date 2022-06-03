import { execSync } from 'child_process'

import { ThrowError, useHookResponse } from '../cli/response'
import { getConfig } from '../config'
import { HookResponse } from '../hooks/index.types'

export async function checkBranch(): Promise<HookResponse> {
  const { stdout, errors } = useHookResponse()

  const config = await getConfig()
  const settings = config?.settings['check-branch']

  // Checks
  // @todo: Refactor to check package
  if (!settings?.protectedBranches)
    ThrowError([
      'Missing settings["check-branch"].protectedBranches in config.',
    ])

  //console.log(config)
  const protectedBranches = settings.protectedBranches

  const branch = execSync(`git branch --show-current`, {
    stdio: ['pipe', 'pipe', 'ignore'],
  })
    .toString('utf8')
    .replace(/[\n\r\s]+$/, '')

  if (typeof branch === 'string' && protectedBranches.includes(branch)) {
    errors.push(`Branch "${branch}" is protected.`)
  }

  return { stdout, errors }
}
