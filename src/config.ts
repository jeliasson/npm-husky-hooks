import fs from 'fs'
import path from 'path'

function getConfigPath() {
  return path.join(process.cwd(), 'husky-hooks.config.js')
}

function getDefaultConfigPath() {
  return path.join(__dirname, '../husky-hooks.config.default.js')
}

export async function getConfig() {
  // read file husky-hooks.json from project root\

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

  //console.log(`Creating config...`)

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
