import { program } from 'commander'

import { CLIParserResponse } from './index.types'

/**
 * CLI parser
 *
 * @returns {CLIParserResponse}
 */
export async function CLIParser(): Promise<CLIParserResponse> {
  // Construct program
  program
    .option('--force')
    .option('--stdout', 'Print stdout', false)
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
