import { execSync } from 'child_process'

import { useHookResponse } from '../cli/response'
import { getConfigSettingByName } from '../config'
import { HookResponse } from '../hooks/index.types'

export async function checkBranch(): Promise<HookResponse> {
  const { stdout, errors } = useHookResponse()

  // Protected branch setting
  const protectedBranchesSetting = await getConfigSettingByName(
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
    Array.isArray(protectedBranchesSetting.value) &&
    protectedBranchesSetting.value.includes(branch)
  ) {
    errors.push(`Branch "${branch}" is protected.`)
  }

  return { stdout, errors }
}
