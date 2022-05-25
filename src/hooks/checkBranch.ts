import { execSync } from 'child_process'

import { getConfig } from '../config'
import { ThookResponse } from '../types'

export async function checkBranch(): Promise<ThookResponse> {
  const stdout: string[] = []
  const errors: string[] = []

  const config = await getConfig()
  const settings = config?.settings['check-branch']

  // Checks
  // @todo: Refactor to check package
  if (!settings?.protectedBranches)
    throw new Error(
      'Missing settings["check-branch"].protectedBranches in config.'
    )

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
