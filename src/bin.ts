#!/usr/bin/env node

import { hideBin } from 'yargs/helpers'
import yargs from 'yargs/yargs'

import { getConfig } from './config'
import { runHook } from './index'

async function init() {
  // Event
  const argv = await yargs(hideBin(process.argv)).argv
  const args = argv._

  // Check if we have a valid config before running any hooks
  try {
    await getConfig()
  } catch (error) {
    console.log(`\n❌❌❌\n`)
    console.log(error)

    process.exit(1)
  }

  // @todo Make this prettier
  const event = args[0]
  if (!event) {
    console.log(``)
    console.log(`❌ Missing event argument, e.g. pre-commit.`)
    console.log(``)
    console.log(`> npx @jeliasson/husky-hooks pre-commit`)

    process.exit(1)
  }

  // @todo: Check config.hooks
  const config = await getConfig()
  if (!config?.hooks[event]) {
    //const events: string[] = []
    const events = Object.keys(config.hooks).map(function (key) {
      return key
    })
    console.log(``)
    console.log(`❌ Unknown event ${event}.`)
    console.log(``)
    Object.keys(config.hooks).map(function (event) {
      console.log(`> npx @jeliasson/husky-hooks ${event}`)
    })

    process.exit(1)
  }

  // Make a list of hooks to run
  const hooks = config.hooks[event]

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
        if (response?.stdout && argv.stdout) {
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
