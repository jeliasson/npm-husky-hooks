import fetch from 'node-fetch'

import { THookResponse } from '../types'

export async function testCheckIp(): Promise<THookResponse> {
  const stdout: string[] = []
  const errors: string[] = []

  const response = await fetch('https://api64.ipify.org?format=json')

  const res = await response.text()

  stdout.push(JSON.parse(res).ip)

  return { stdout, errors }
}
