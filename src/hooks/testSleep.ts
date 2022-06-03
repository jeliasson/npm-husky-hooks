import { ThrowError, useHookResponse } from '../cli/response'
import { getConfigSettingByName } from '../config'
import { HookResponse } from '../hooks/index.types'

export async function testSleep(): Promise<HookResponse> {
  const { stdout, errors } = useHookResponse()

  // Get delay setting
  const delaySetting = await getConfigSettingByName('test-sleep', 'delay')

  // Checks
  // @todo: Refactor to check package
  if (!delaySetting.value)
    ThrowError([`Missing ${delaySetting.path} as integer value in config.`])

  if (!Number.isInteger(delaySetting.value))
    ThrowError([`Setting ${delaySetting.path} is not a integer.`])

  // Sleep
  await new Promise((resolve) =>
    setTimeout(resolve, Number.parseInt(delaySetting.value as string, 10))
  )

  return { stdout, errors }
}
