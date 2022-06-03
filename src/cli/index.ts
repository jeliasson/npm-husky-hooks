import { hideBin } from 'yargs/helpers'
import yargs from 'yargs/yargs'

import { CLIParserResponse } from './index.types'

/**
 * CLI parser
 *
 * @returns {CLIParserResponse}
 */
export async function CLIParser(): Promise<CLIParserResponse> {
  const _argv = await yargs(hideBin(process.argv)).argv

  // Construct arguments
  const args = _argv._

  // Construct options
  const opts: any = {}
  Object.keys(_argv).map(function (something) {
    if (something !== '_' && something.substring(0, 1) !== '$') {
      opts[something] = _argv[something]
    }
  })

  return {
    _argv,
    args,
    opts,
  }
}
