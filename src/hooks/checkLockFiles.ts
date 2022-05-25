import fs from 'fs'
import { getConfig } from '../config'

import { ThookResponse } from '../types'

export async function checkLockFiles(): Promise<ThookResponse> {
  const stdout: string[] = []
  const errors: string[] = []

  const config = await getConfig()
  const settings = config?.settings['check-lock-files']

  // Checks
  // @todo: Refactor to check package
  if (!settings?.allowLockFile)
    throw new Error(
      'Missing settings["check-lock-files"].allowLockFile in config.'
    )

  if (typeof settings.allowLockFile !== 'string')
    throw new Error(
      'Rule settings["check-lock-files"].allowLockFile is not a string.'
    )

  if (!settings?.denyLockFiles)
    throw new Error(
      'Missing settings["check-lock-files"].denyLockFiles in config.'
    )

  if (typeof settings.denyLockFiles !== 'object')
    throw new Error(
      'Rule settings["check-lock-files"].denyLockFiles is not a array.'
    )

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
