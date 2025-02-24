import { HookResponse, Hooks } from './types/hooks.ts'

import { checkBranch } from './hooks/checkBranch.ts'
import { checkLockFiles } from './hooks/checkLockFiles.ts'
import { runCmd } from './hooks/runCmd.ts'
import { testCheckIp } from './hooks/testCheckIp.ts'
import { testSleep } from './hooks/testSleep.ts'

export const events = ['pre-commit', 'pre-push']

// Registered hooks
export const hooks = <Hooks>{
  'check-branch': checkBranch,
  'check-lock-files': checkLockFiles,
  'run-cmd': runCmd,
  'test-sleep': testSleep,
  'test-check-ip': testCheckIp,
}

/**
 * Run hook
 *
 * @param   {string} name               Name of hook to run
 * @returns {Promise<HookResponse>}
 */
export async function runHook(name: string, arg = ''): Promise<HookResponse> {
  const hook = hooks[name]

  if (hook) return await hook(arg)
  throw new Error(`Hook with ${name} not found`)
}

export function getHooksAsArray(): string[] {
  return Object.keys(hooks).map((key) => key)
}
