import { checkBranch } from './checkBranch'
import { checkLockFiles } from './checkLockFiles'
import { Hooks } from './index.types'
import { runCmd } from './runCmd'
import { testCheckIp } from './testCheckIp'
import { testSleep } from './testSleep'

export const events = ['pre-commit', 'pre-push']

export const hooks = <Hooks>{
  'check-branch': checkBranch,
  'check-lock-files': checkLockFiles,
  'run-cmd': runCmd,
  'test-sleep': testSleep,
  'test-check-ip': testCheckIp,
}

export function getHooksAsArray(): string[] {
  return Object.keys(hooks).map((key) => key)
}
