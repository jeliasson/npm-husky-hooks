import { execSync } from 'child_process'

import { getConfigSettingByName } from '../config'
import { HookResponse } from '../types/hooks'

import { useHookResponse } from '../cli/response'

export async function checkBranch(): Promise<HookResponse> {
  const { stdout, errors } = useHookResponse()

  // Protected branch setting
  const protectedBranches = await getConfigSettingByName(
    'check-branch',
    'protectedBranches'
  )

  // Exec command
  const exec = execSync(`git branch --show-current`, {
    stdio: ['pipe', 'pipe', 'ignore'],
  })

  // Format output
  // @todo: Refactor this to exec package
  const branch = exec.toString('utf8').replace(/[\n\r\s]+$/, '')

  if (
    Array.isArray(protectedBranches.value) &&
    protectedBranches.value.includes(branch)
  ) {
    errors.push(`Branch "${branch}" is protected.`)
  }

  return { stdout, errors }
}
