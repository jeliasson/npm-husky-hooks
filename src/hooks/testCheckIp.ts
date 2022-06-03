import fetch from 'node-fetch'

import { useHookResponse } from '../cli/response'
import { HookResponse } from '../types'

export async function testCheckIp(): Promise<HookResponse> {
  const { stdout, errors } = useHookResponse()

  const response = await fetch('https://api64.ipify.org?format=json')

  const res = await response.text()

  stdout.push(JSON.parse(res).ip)

  return { stdout, errors }
}
