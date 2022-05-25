import { hooks } from './hooks'
import { ThookResponse } from './types'
export async function runHook(name: string): Promise<ThookResponse> {
  const hook = hooks[name]

  if (hook) return await hook()
  throw new Error(`Hook with ${name} not found`)
}
