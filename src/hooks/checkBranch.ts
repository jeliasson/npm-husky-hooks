import { execSync } from 'child_process'

import { ThrowError, useHookResponse } from '../cli/response'
import { getConfigSettingByName } from '../config'
import { HookResponse } from '../hooks/index.types'

export async function checkBranch(): Promise<HookResponse> {
  const { stdout, errors } = useHookResponse()

  // Protected branch setting
  const protectedBranchesSetting = await getConfigSettingByName(
    'check-branch',
    'protectedBranches'
  )

  // Checks
  if (!protectedBranchesSetting.value)
    ThrowError([`Missing ${protectedBranchesSetting.path} in config.`])

  if (typeof protectedBranchesSetting.value !== 'object')
    ThrowError([`Config ${protectedBranchesSetting.path} must be an array.`])

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
