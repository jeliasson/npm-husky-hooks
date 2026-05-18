import fs from 'node:fs'
import path from 'node:path'

import { Config, ConfigSchema, SettingsName } from './types'

import { CLIError, ThrowError, ThrowException } from './response'

const fsp = fs.promises

export const PACKAGE_NAME = '@jeliasson/husky-hooks'
export const CONFIG_FILE = 'husky-hooks.config.js'
export const ORIGINAL_CONFIG_FILE = 'husky-hooks.config.default.js'

function getConfigPath(): string {
  return path.join(process.cwd(), CONFIG_FILE)
}

function getDefaultConfigPath(): string {
  return path.join(__dirname, `../${ORIGINAL_CONFIG_FILE}`)
}

export function configExists(): boolean {
  return fs.existsSync(getConfigPath())
}

export function originalConfigExists(): boolean {
  return fs.existsSync(getDefaultConfigPath())
}

export async function getConfig(): Promise<Config> {
  if (!configExists())
    ThrowError([
      `Config ${CONFIG_FILE} not found.`,
      `Run 'npx ${PACKAGE_NAME} create-config' to create one.`,
    ])

  const configPath = getConfigPath()

  return require(configPath)
}

export async function createConfig(force = false): Promise<Config | false> {
  const originalConfig = getDefaultConfigPath()
  const configPath = getConfigPath()

  if (configExists() && !force)
    ThrowError([
      `Config ${CONFIG_FILE} already exists`,
      `To override, run 'npx ${PACKAGE_NAME} create-config --force'`,
    ])

  if (!originalConfigExists())
    ThrowException([
      `Could not find original ${ORIGINAL_CONFIG_FILE}. Something is broken.`,
      `Please see the original repository to grab the default config file.`,
    ])

  try {
    await fsp.copyFile(originalConfig, configPath)

    return require(configPath)
  } catch {
    ThrowException([`An error occurred while creating ${CONFIG_FILE}`])
  }

  return false
}

export async function validateConfig(config: Config): Promise<Config> {
  try {
    const validation = ConfigSchema.safeParse(config)

    if (validation.success) return config

    const errors = validation.error.issues
    const count = errors.length
    const pluralize = count > 1 ? 's' : ''
    const formatted = errors.map((error) => {
      let configPath = 'config.'
      if (error.path[0]) configPath += String(error.path[0])
      if (error.path[1]) configPath += `["${String(error.path[1])}"]`
      if (error.path[2]) configPath += `.${String(error.path[2])}`

      return `- ${configPath}: ${error.message}`
    })

    ThrowError([
      `${count} error${pluralize} occurred while validating ${CONFIG_FILE}.`,
      `Please fix below issue${pluralize} and try again.`,
      ``,
      formatted.join('\n'),
      '',
      'If you are still experiencing issues, please open an issue on GitHub.',
      'https://github.com/jeliasson/npm-husky-hooks/issues',
    ])
  } catch (error) {
    if (error instanceof CLIError) throw error
    ThrowException([
      `An error occurred while validating ${CONFIG_FILE}`,
      'Unknown exception',
      String(error),
    ])
  }
}

export async function getSettings<T extends SettingsName>(
  name: T
): Promise<Config['settings'][T]> {
  const config = await getConfig()
  return config.settings[name]
}

export async function getSetting<
  T extends SettingsName,
  K extends keyof Config['settings'][T],
>(name: T, key: K): Promise<Config['settings'][T][K]> {
  const config = await getConfig()
  return config.settings[name][key]
}
