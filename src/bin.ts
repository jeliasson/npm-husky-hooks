#!/usr/bin/env node

import { CLIParser } from './cli'
import { commands } from './commands'
import { getConfig, PACKAGE_NAME } from './config'
import { runHook } from './index'

async function init() {
  // CLI
  const { _argv, args } = await CLIParser()

  // @todo Make this prettier and refactor to a help section
  // that generates a list of commands, including running hooks
  const command = args[0]
  if (!command) {
    console.log(``)
    console.log(`❌ Missing command argument, e.g. pre-commit.`)
    console.log(``)
    console.log(`> npx ${PACKAGE_NAME} pre-commit`)

    process.exit(1)
  }

  //
  // Commands
  //
  const commandFn = commands[command]
  if (typeof commandFn === 'function') {
    await commandFn()

    // Exit out from here
    process.exit(0)
  }

  //
  // Config
  //
  try {
    // Check if we have a valid config before running any hooks
    await getConfig()
  } catch (error) {
    console.log(error)

    // Exit out from here
    process.exit(1)
  }

  //
  // Hooks
  //
  const config = await getConfig()
  if (!config?.hooks[command]) {
    console.log(``)
    console.log(`❌ Unknown command ${command}.`)
    console.log(``)
    Object.keys(config.hooks).map(function (command) {
      console.log(`> npx ${PACKAGE_NAME} ${command}`)
    })

    process.exit(1)
  }

  // Make a list of hooks to run
  const hooks = config.hooks[command]

  for (const hook of hooks) {
    try {
      process.stdout.write(`Running hook ${hook}... `)
      const response = await runHook(hook)
      const icon = response?.errors && response.errors.length > 0 ? '❌' : '✅'

      console.log(icon)

      if (response?.errors && response.errors.length > 0) {
        response.errors.map((error) => console.error(`- ${error}`))
        console.log()

        process.exit(1)
      } else {
        // if option --stdout is set, print stdout
        if (response?.stdout && _argv.stdout) {
          response.stdout.map((line) => console.log(`- ${line}`))
        }
        //console.log(response)
      }
    } catch (error) {
      console.log(`❌\n\n`, error)

      process.exit(1)
    }
  }
}

init()
