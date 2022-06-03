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

  // Run each hook
  for (const hook of hooks) {
    // Hooks to run and with possible options
    let run = null
    let arg = null

    // Hook is a string
    if (typeof hook === 'string') {
      run = hook
      process.stdout.write(`Running hook ${run}... `)
    }

    // Hook is an array
    if (typeof hook === 'object') {
      run = hook[0]
      arg = hook[1]
      process.stdout.write(`Running hook ${run} with argument '${arg}'... `)
    }

    try {
      const response = await runHook(run, arg)
      const icon = response?.errors && response.errors.length > 0 ? '❌' : '✅'

      console.log(icon)

      if (response?.errors && response.errors.length > 0) {
        console.log()
        response.errors.map((error: string) => console.error(`${error}`))
        console.log()

        process.exit(1)
      } else {
        const stdout = response?.stdout ? response.stdout : null
        // if option --stdout is set, print stdout
        if (stdout && _argv.stdout) {
          if (stdout.length > 0) console.log()
          stdout.map((line: string) => console.log(`${line}`))
          if (stdout.length > 0) console.log()
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
