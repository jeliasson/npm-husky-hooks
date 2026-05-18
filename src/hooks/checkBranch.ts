import { execFileSync } from 'node:child_process'

import { getSetting } from '../config'
import { HookResponse } from '../types'

import { createResponse } from '../response'

export async function checkBranch(): Promise<HookResponse> {
  const { stdout, errors } = createResponse()

  const protectedBranches = await getSetting('check-branch', 'protectedBranches')

  const output = execFileSync('git', ['branch', '--show-current'], {
    stdio: ['pipe', 'pipe', 'ignore'],
  })

  const branch = output.toString('utf8').replace(/[\n\r\s]+$/, '')

  if (protectedBranches.includes(branch)) {
    errors.push(`Branch "${branch}" is protected.`)
  }

  return { stdout, errors }
}
