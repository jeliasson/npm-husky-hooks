import { CLIParserResponse } from './types'

 
const { version } = require('../package.json')

const BOOLEAN_FLAGS = new Set(['--force', '--stdout'])
const VERSION_FLAGS = new Set(['-v', '--version'])
const HELP_FLAGS = new Set(['-h', '--help'])

const HELP_TEXT = `Usage: husky-hooks <command> [options]

Configurable git hooks for husky.

Commands:
  <hook-event>      Run hooks configured for the given event (e.g. pre-commit)
  create-config     Create a husky-hooks.config.cjs in the current directory

Options:
  --force           Overwrite existing config (with create-config)
  --stdout          Print stdout from hooks
  -v, --version     Print version
  -h, --help        Show this help`

export async function CLIParser(): Promise<CLIParserResponse> {
  const argv = process.argv.slice(2)
  const args: string[] = []
  const opts: { [key: string]: boolean | number | string } = {
    force: false,
    stdout: false,
  }

  for (const token of argv) {
    if (VERSION_FLAGS.has(token)) {
      console.log(version)
      process.exit(0)
    }

    if (HELP_FLAGS.has(token)) {
      console.log(HELP_TEXT)
      process.exit(0)
    }

    if (BOOLEAN_FLAGS.has(token)) {
      opts[token.slice(2)] = true
      continue
    }

    if (token.startsWith('-')) continue

    args.push(token)
  }

  return { args, opts }
}
