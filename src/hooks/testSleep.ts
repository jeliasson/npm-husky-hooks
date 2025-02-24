import { getConfigSettingByName } from '../config.ts'
import { HookResponse } from '../types/hooks.ts'

import { useHookResponse } from '../cli/response.ts'

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
