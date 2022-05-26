import fs from 'fs'
import path from 'path'

import { ThrowError } from './error'
}

function getDefaultConfigPath() {
  return path.join(__dirname, '../husky-hooks.config.default.js')
}

    ThrowError([
      `Config ${CONFIG_FILE} not found.`,
      `Run 'npx @jeliasson/husky-hooks generate-settings' to create one.`,
    ])

  //console.log(`Getting config...`)
  try {
    const configPath = getConfigPath()
    return require(configPath)
  } catch (error) {
    // throw new Error('An error occurred while reading husky-hooks.json.')
    return await createConfig()
  }
}

type TRuleByHook = {
  config: any
  path: string
}
export async function getSettingsByHook(hook: string) {
  const config = await getConfig()
  const specific = config.settings[hook]
  const path = `config.settings[${hook}]`

  return {
    config: specific,
    path,
  }
}

async function createConfig() {
  const orginalConfig = getDefaultConfigPath()
  const configPath = getConfigPath()

  //console.log(`orginalConfig`, orginalConfig)
  //console.log(`configPath`, configPath)

    ThrowError([
      `Could not find orginal ${ORGINAL_CONFIG_FILE}. That is a bit annoying 😕`,
      `Please see orginal repository to grab the default config file.`,
    ])

  try {
    await fs.copyFile(orginalConfig, configPath, () => {
      console.log()
      return require(configPath)
    })

    return require(configPath)
  } catch (error) {
    return error
  }
}
