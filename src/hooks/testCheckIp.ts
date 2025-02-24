import fetch from 'node-fetch'

import { HookResponse } from '../types/hooks'

import { useHookResponse } from '../cli/response'

export async function testCheckIp(): Promise<HookResponse> {
  const { stdout, errors } = useHookResponse()

  // Make reqeust
  const request = await fetch('https://api64.ipify.org?format=json')

  // Get response
  const res = await request.text()

  // Push response
  stdout.push(JSON.parse(res).ip)

  return { stdout, errors }
}
