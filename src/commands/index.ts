import { Commands } from '../types'
import { createConfigCommand } from './createConfig'
export const events = ['pre-commit', 'pre-push']

export const commands = <Commands>{
  'create-config': createConfigCommand,
}
