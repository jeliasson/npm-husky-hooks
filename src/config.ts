import fs from 'fs'
import path from 'path'

import { ThrowError } from './error'
import { TSettingByHook } from './types'

const fsp = fs.promises

const CONFIG_FILE = 'husky-hooks.config.js'
const ORGINAL_CONFIG_FILE = 'husky-hooks.config.default.js'

function getConfigPath(): string {
  return path.join(process.cwd(), `${CONFIG_FILE}`)
}

function getDefaultConfigPath(): string {
  return path.join(__dirname, `../${ORGINAL_CONFIG_FILE}`)
}

export async function configExists(): Promise<boolean> {
  return await fs.existsSync(getConfigPath())
}

export async function orginalConfigExists(): Promise<boolean> {
  return await fs.existsSync(getDefaultConfigPath())
}

export async function getConfig(): Promise<any> {
  if (!(await configExists()))
    ThrowError([
      `Config ${CONFIG_FILE} not found.`,
      `Run 'npx @jeliasson/husky-hooks generate-settings' to create one.`,
    ])

  try {
    const configPath = getConfigPath()
    return require(configPath)
  } catch (error) {
    return createConfig()
  }
}

export async function getSettingsByHook(hook: string): Promise<TSettingByHook> {
  const config = await getConfig()
  const specific = config.settings[hook]
  const path = `config.settings[${hook}]`

  return {
    config: specific,
    path,
  }
}

export async function createConfig(): Promise<any> {
  const orginalConfig = getDefaultConfigPath()
  const configPath = getConfigPath()

  // Check if the config file already exists
  if (await configExists()) ThrowError([`Config ${CONFIG_FILE} already exists`])

  // Check if the orginal config file exists
  if (!(await orginalConfigExists()))
    ThrowError([
      `Could not find orginal ${ORGINAL_CONFIG_FILE}. That is a bit annoying 😕`,
      `Please see orginal repository to grab the default config file.`,
    ])

  try {
    await fsp.copyFile(orginalConfig, configPath)

    return require(configPath)
  } catch (error) {
    return error
  }
}
