import { HookResponse, Hooks } from './types'

import { checkBranch } from './hooks/checkBranch'
import { checkLockFiles } from './hooks/checkLockFiles'
import { runCmd } from './hooks/runCmd'
import { testCheckIp } from './hooks/testCheckIp'
import { testSleep } from './hooks/testSleep'

export const hooks: Hooks = {
  'check-branch': checkBranch,
  'check-lock-files': checkLockFiles,
  'run-cmd': runCmd,
  'test-sleep': testSleep,
  'test-check-ip': testCheckIp,
}

export async function runHook(name: string, arg = ''): Promise<HookResponse> {
  const hook = hooks[name]
  if (hook) return await hook(arg)
  throw new Error(`Hook "${name}" not found`)
}

export function getHookNames(): string[] {
  return Object.keys(hooks)
}
