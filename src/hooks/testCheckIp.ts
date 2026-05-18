import { HookResponse } from '../types'

import { createResponse } from '../response'

export async function testCheckIp(): Promise<HookResponse> {
  const { stdout, errors } = createResponse()

  const response = await fetch('https://api64.ipify.org?format=json')
  const data = await response.json()

  stdout.push((data as { ip: string }).ip)

  return { stdout, errors }
}
