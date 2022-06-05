import { checkBranch } from './checkBranch'
import { checkLockFiles } from './checkLockFiles'
import { HookResponse, Hooks } from './index.types'
import { runCmd } from './runCmd'
import { testCheckIp } from './testCheckIp'
import { testSleep } from './testSleep'

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
