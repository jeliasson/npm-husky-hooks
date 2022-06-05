import { getConfigSettingByName } from '../config'
import { HookResponse } from '../types/hooks'

import { useHookResponse } from '../cli/response'

export async function testSleep(): Promise<HookResponse> {
  const { stdout, errors } = useHookResponse()

  // Get delay setting
  const delay = await getConfigSettingByName('test-sleep', 'delay')

  // Sleep
  await new Promise((resolve) =>
    setTimeout(resolve, Number.parseInt(delay.value as string, 10))
  )

  return { stdout, errors }
}
