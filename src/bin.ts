#!/usr/bin/env node

import { init } from './index.js'
import { CLIError } from './response.js'

init().catch((error: unknown) => {
  if (error instanceof CLIError) {
    if (error.messages.length > 0) {
      console.log(`\nError\n\n${error.messages.join('\n')}`)
    }
    process.exit(error.exitCode)
  }
  console.error(error)
  process.exit(1)
})
