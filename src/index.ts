import { CONFIG_FILE, getConfig, PACKAGE_NAME, validateConfig } from './config.ts'
import { Config } from './types/index.ts'

import { CLIParser } from './cli.ts'
import { ThrowError } from './cli/response.ts'

import { runCommand } from './commands.ts'
import { runHook } from './hooks.ts'

export async function init(): Promise<void> {
  const { args, opts } = await CLIParser()

  // Command
  const [command] = args
  await runCommand(command)

  // Config
  const config = await getConfig()
  await validateConfig(config)

  // Get all hooks related to the command
  const allHooks = config.hooks[command as keyof Config['hooks']]

  // Hooks
  if (!allHooks) {
    console.log(`\n❌ Unknown command ${command}.\n`)
    Object.keys(config.hooks).map(function (command) {
      console.log(`> npx ${PACKAGE_NAME} ${command}`)
    })

    process.exit(1)
  }

  // Loop thru all hooks
  for (const hook of allHooks) {
    // Hooks to run and with possible options
    // @todo: Make this prettier. Kill it with fire.
    let run = null
    let arg = undefined

    switch (typeof hook) {
      case 'string':
        run = hook
        process.stdout.write(`Running hook ${run}... `)
        break

      case 'object':
        ;[run, arg] = hook
        process.stdout.write(`Running hook ${run} with argument '${arg}'... `)
        break

      default: // Just adds run below to make TS happy
        run = '__nothing__'
        ThrowError([
          `Unknown type '${typeof hook}' for hook '${hook}'.`,
          `It's probabaly a typo in the hooks section of the ${CONFIG_FILE} config file.`,
        ])
        break
    }

    try {
      // Run the hook
      const response = await runHook(run, arg)

      // Print a response icon
      console.log(response?.errors && response.errors.length > 0 ? '❌' : '✅')

      if (response?.errors && response.errors.length > 0) {
        // Print errors

        console.log()
        response.errors.map((error: string) => console.log(`${error}`))

        // Exit
        process.exit(1)
      } else {
        const stdout = response?.stdout ? response.stdout : null
        if (stdout && opts.stdout) {
          // Print stdout if --stdout was passed
          // @todo: Fix this ugliness
          if (stdout.length > 0) console.log()
          stdout.map((line: string) => console.log(`${line}`))
          if (stdout.length > 0) console.log()
        }
      }
    } catch (error) {
      console.log(`❌\n\n`, error)

      process.exit(1)
    }
  }
}

init()
