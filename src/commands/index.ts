import { TCommands } from '../types'
import { createConfigCommand } from './createConfig'
export const events = ['pre-commit', 'pre-push']

export const commands = <TCommands>{
  'create-config': createConfigCommand,
}
