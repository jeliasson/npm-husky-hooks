import fs from 'fs'

import { ThrowError, useHookResponse } from '../cli/response'
import { getConfigSettingByName } from '../config'
import { HookResponse } from '../hooks/index.types'

export async function checkLockFiles(): Promise<HookResponse> {
  const { stdout, errors } = useHookResponse()

  const allowLockFileSetting = await getConfigSettingByName(
    'check-lock-files',
    'allowLockFile'
  )

  const denyLockFilesSetting = await getConfigSettingByName(
    'check-lock-files',
    'denyLockFiles'
  )

  // Checks
  // @todo: Refactor to check package
  if (!allowLockFileSetting.value)
    ThrowError([`Missing ${allowLockFileSetting.path} in config.`])

  if (typeof allowLockFileSetting.value !== 'string')
    ThrowError([`Setting ${allowLockFileSetting.path} is not a string.`])

  if (!denyLockFilesSetting.value)
    ThrowError([`Missing ${denyLockFilesSetting.path} in config.`])

  if (typeof denyLockFilesSetting.value !== 'object')
    ThrowError([`Setting ${denyLockFilesSetting.path} is not a array.`])

  const allowLockFile = 'yarn.lock'
  const denyLockFiles = ['package-lock.json', 'pnpm-lock.yaml']

  // Check files
  for (const file of denyLockFiles) {
    if (fs.existsSync(file)) {
      errors.push(
        `Invalid occurence of "${file}" file. Please remove it and only use "${allowLockFile}"`
      )
    }
  }

  try {
    const content = fs.readFileSync(allowLockFile, 'utf-8')
    if (content.match(/localhost:487/)) {
      errors.push(
        `The "${allowLockFile}" has reference to local yarn repository ("localhost:4873"). Please use "registry.yarnpkg.com" in "${allowLockFile}"`
      )
    }
  } catch {
    errors.push(`The "${allowLockFile}" does not exist or cannot be read`)
  }

  return { stdout, errors }
}
