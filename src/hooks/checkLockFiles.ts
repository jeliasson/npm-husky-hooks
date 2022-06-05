import fs from 'fs'

import { useHookResponse } from '../cli/response'
import { HookResponse } from '../hooks/index.types'

export async function checkLockFiles(): Promise<HookResponse> {
  const { stdout, errors } = useHookResponse()

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
