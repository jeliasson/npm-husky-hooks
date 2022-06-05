import { program } from 'commander'

import { CLIParserResponse } from './types/cli'

/**
 * CLIParser parser
 *
 * @returns {CLIParserResponse}
 */
export async function CLIParser(): Promise<CLIParserResponse> {
  // Construct program
  program
    .option('--force')
    .option('--stdout', 'Print stdout', false)
    .option('-v, --version', 'Print version', false)
    .option('-s, --separator <char>')

  // Parse options
  program.parse()

  const args = program.args
  const opts = program.opts()

  return {
    args,
    opts,
  }
}
