import fs from 'node:fs'

import { getSetting } from '../config'
import { HookResponse } from '../types'

import { createResponse } from '../response'

export async function checkLockFiles(): Promise<HookResponse> {
  const { stdout, errors } = createResponse()

  const allowLockFile = await getSetting('check-lock-files', 'allowLockFile')
  const denyLockFiles = await getSetting('check-lock-files', 'denyLockFiles')

  for (const file of denyLockFiles) {
    if (fs.existsSync(file)) {
      errors.push(
        `Invalid occurrence of "${file}" file. Please remove it and only use "${allowLockFile}"`
      )
    }
  }

  return { stdout, errors }
}
