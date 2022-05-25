import { THooks } from '../types'
import { checkBranch } from './checkBranch'
import { checkLockFiles } from './checkLockFiles'
import { testCheckIp } from './testCheckIp'
import { testSleep } from './testSleep'

export const events = ['pre-commit', 'pre-push']

export const hooks = <THooks>{
  'check-branch': checkBranch,
  'check-lock-files': checkLockFiles,
  'test-sleep': testSleep,
  'test-check-ip': testCheckIp,
}
