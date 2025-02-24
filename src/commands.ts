import { PACKAGE_NAME } from './config.ts'
import { Commands } from './types/commands.ts'

import { createConfigCommand } from './commands/createConfig.ts'

// Registered commands
export const commands = <Commands>{
  'create-config': createConfigCommand,
}

/**
 * Run command
 *
 * @param   {string} name               Name of command to run
 * @returns {Promise<void>}
 */
export async function runCommand(name: string): Promise<void> {
  // @todo: Refactor into runCommand maybe? Probabaly.
  if (!name) {
    console.log(`\n❌ Missing command, e.g. create-config.\n`)
    console.log(`> npx ${PACKAGE_NAME} create-config`)

    process.exit(1)
  }

  const command = commands[name]
  if (typeof command === 'function') {
    await command()

    // Exit out from here
    process.exit(0)
  }
}
