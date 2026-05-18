import { getSetting } from '../config'
import { HookResponse } from '../types'

import { createResponse } from '../response'

export async function testSleep(): Promise<HookResponse> {
  const { stdout, errors } = createResponse()

  const delay = await getSetting('test-sleep', 'delay')

  await new Promise((resolve) => setTimeout(resolve, delay))

  return { stdout, errors }
}
