import { createConfigCommand } from './createConfig'
import { Commands } from './index.types'

export const events = ['pre-commit', 'pre-push']

export const commands = <Commands>{
  'create-config': createConfigCommand,
}
