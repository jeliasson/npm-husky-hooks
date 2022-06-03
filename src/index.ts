import { hooks } from './hooks'
import { HookResponse } from './hooks/index.types'

/**
 *
 * @param   {string} name               Name of hook to run
 * @returns {Promise<HookResponse>}
 */
export async function runHook(name: string, arg = ''): Promise<HookResponse> {
  const hook = hooks[name]

  if (hook) return await hook(arg)
  throw new Error(`Hook with ${name} not found`)
}
