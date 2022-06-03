import fs from 'fs'
import path from 'path'

import { ThrowError, ThrowException } from './cli/response'
import { SettingByHook } from './types'

const fsp = fs.promises

export const PACKAGE_NAME = '@jeliasson/husky-hooks'
export const CONFIG_FILE = 'husky-hooks.config.js'
export const ORGINAL_CONFIG_FILE = 'husky-hooks.config.default.js'

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
      `Run 'npx ${PACKAGE_NAME} create-config' to create one.`,
    ])

  try {
    const configPath = getConfigPath()
    return require(configPath)
  } catch (error) {
    return createConfig()
  }
}

export async function getSettingsByHook(hook: string): Promise<SettingByHook> {
  const config = await getConfig()
  const specific = config.settings[hook]
  const path = `config.settings[${hook}]`

  return {
    config: specific,
    path,
  }
}

/**
 * Create a default config file
 *
 * @param   <boolean> force
 * @returns <Promise<boolean>>
 */
export async function createConfig(force = false): Promise<any> {
  const orginalConfig = getDefaultConfigPath()
  const configPath = getConfigPath()

  // Check if the config file already exists
  if ((await configExists()) && !force)
    ThrowError([
      `Config ${CONFIG_FILE} already exists`,
      `To override, run 'npx ${PACKAGE_NAME} create-config --force'`,
    ])

  // Check if the orginal config file exists
  if (!(await orginalConfigExists()))
    ThrowException([
      `Could not find orginal ${ORGINAL_CONFIG_FILE}. Something is broken 😕`,
      `Please see orginal repository to grab the default config file.`,
    ])

  try {
    await fsp.copyFile(orginalConfig, configPath)

    return require(configPath)
  } catch (error) {
    return error
  }
}
