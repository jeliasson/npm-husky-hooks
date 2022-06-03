import { ThrowError } from '../cli'
import { getConfig } from '../config'
import { HookResponse } from '../types'

export async function testSleep(): Promise<HookResponse> {
  const stdout: string[] = []
  const errors: string[] = []

  const config = await getConfig()
  const settings = config?.settings['test-sleep']

  // Checks
  // @todo: Refactor to check package
  if (!settings?.delay)
    ThrowError([
      'Missing settings["test-sleep"].delay as integer value in config.',
    ])

  if (!Number.isInteger(settings.delay))
    ThrowError(['Setting settings["test-sleep"].delay is not a integer.'])

  await new Promise((resolve) => setTimeout(resolve, settings.delay))

  return { stdout, errors }
}
