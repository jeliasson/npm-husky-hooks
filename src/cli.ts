import { program } from 'commander'

import { PACKAGE_NAME } from './config'
import { CLIParserResponse } from './types'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { version } = require('../package.json')

let parsed = false

function ensureParsed(): void {
  if (parsed) return
  program
    .name(PACKAGE_NAME)
    .description('Configurable git hooks for husky')
    .version(version, '-v, --version')
    .argument('[command]', 'Hook event or command to run')
    .option('--force', 'Force overwrite existing config')
    .option('--stdout', 'Print stdout from hooks', false)
  program.parse()
  parsed = true
}

export async function CLIParser(): Promise<CLIParserResponse> {
  ensureParsed()

  return {
    args: program.args,
    opts: program.opts(),
  }
}
