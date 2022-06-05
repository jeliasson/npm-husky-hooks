import fs from 'fs'
import path from 'path'

import { ThrowError, ThrowException } from './cli/response'
import { Config, ConfigSchema, SettingByName, SettingsByName } from './types'

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

export async function getConfig(): Promise<Config> {
  if (!(await configExists()))
    ThrowError([
      `Config ${CONFIG_FILE} not found.`,
      `Run 'npx ${PACKAGE_NAME} create-config' to create one.`,
    ])

  const configPath = getConfigPath()
  // @todo: Fix below. Not sure what to do here.

  return require(configPath)
}

/**
 * Create a default config file
 *
 * @param   <boolean> force
 * @returns <Promise<boolean>>
 */
export async function createConfig(force = false): Promise<Config | false> {
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
    ThrowException([`An error occured while creating ${CONFIG_FILE}`])
  }

  return false
}

export async function validateConfig(config: Config): Promise<Config> {
  try {
    const validation = await ConfigSchema.safeParse(config)

    if (validation.success) return config

    // @todo: Figure out which type to use, because ZodError
    //        does not contain error.expected and error.recieved
    // console.log(`ISSUES START`)
    // console.log(validation.error.issues)
    // console.log(`ISSUES END`)

    const errors = validation.error.issues
    const count = errors.length
    const pluralize = count > 1 ? 's' : ''
    const formatted = errors.map((error: any) => {
      // A ugly way of getting setting path
      let path = 'config.'
      if (error.path[0]) path += `${error.path[0]}`
      if (error.path[1]) path += `["${error.path[1]}"]`
      if (error.path[2]) path += `.${error.path[2]}`

      return `- ${path} expected to be '${error.expected}' but got but '${error.recieved}'`
    })

    ThrowError([
      `${count} error${pluralize} occured while validating ${CONFIG_FILE}.`,
      `Please fix below issue${pluralize} and try again.`,
      ``,
      formatted.map((error: string) => `${error}`).join('\n'),
      '',
      'If you are still experiencing issues, please open a issue on GitHub.',
      'https://github.com/jeliasson/npm-husky-hooks/issues',
    ])

    return config
  } catch (error) {
    ThrowException([
      `An error occured while validating ${CONFIG_FILE}`,
      'Unknown exception',
      String(error).toString(),
    ])
  }

  // @todo: Type so this won't be needed
  throw Error(`Unknown error occured while validating ${CONFIG_FILE}`)
}

export async function getSettingsByName(name: string): Promise<SettingsByName> {
  const config = await getConfig()
  const settings = config.settings[name as keyof Config['settings']]
  const path = `config.settings['${name}']`

  return {
    settings,
    path,
  }
}

export async function getConfigSettingByName(
  name: string,
  setting: string
): Promise<SettingByName> {
  const config = await getConfig()

  // @ todo: Make below prettier
  // const orginalRow = config.settings[name][setting]
  const settings = config.settings[name as keyof Config['settings']]
  const value = settings[setting as keyof typeof settings]

  // Define config path
  const path = `config.settings['${name}']['${setting}']`

  return {
    value,
    path,
  }
}
