import { getConfigSettingByName } from '../config'

import { useHookResponse } from '../cli/response'

import { HookResponse } from '../hooks/index.types'

export async function testSleep(): Promise<HookResponse> {
  const { stdout, errors } = useHookResponse()

  // Get delay setting
  const delaySetting = await getConfigSettingByName('test-sleep', 'delay')

  // Sleep
  await new Promise((resolve) =>
    setTimeout(resolve, Number.parseInt(delaySetting.value as string, 10))
  )

  return { stdout, errors }
}
