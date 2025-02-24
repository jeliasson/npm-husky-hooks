import fs from 'fs'

import { getConfigSettingByName } from '../config'
import { HookResponse } from '../types/hooks'

import { useHookResponse } from '../cli/response'

export async function checkLockFiles(): Promise<HookResponse> {
  const { stdout, errors } = useHookResponse()

  // Allowed lock file
  const allowLockFile = await getConfigSettingByName(
    'check-lock-files',
    'allowLockFile'
  )

  // Deny lock files
  const denyLockFiles = await getConfigSettingByName(
    'check-lock-files',
    'denyLockFiles'
  )

  // Check files
  for (const file of <string[]>denyLockFiles.value) {
    if (fs.existsSync(file)) {
      errors.push(
        `Invalid occurence of "${file}" file. Please remove it and only use "${<
          string
        >allowLockFile.value}"`
      )
    }
  }

  try {
    const content = fs.readFileSync(<string>allowLockFile.value, 'utf-8')
    if (content.match(/localhost:487/)) {
      errors.push(
        `The "${<string>(
          allowLockFile.value
        )}" has reference to local yarn repository ("localhost:4873"). Please use "registry.yarnpkg.com" in "${allowLockFile}"`
      )
    }
  } catch {
    errors.push(
      `The "${<string>allowLockFile.value}" does not exist or cannot be read`
    )
  }

  return { stdout, errors }
}
