import { hooks } from './hooks'
import { THookResponse } from './types'

/**
 *
 * @param   {string} name               Name of hook to run
 * @returns {Promise<THookResponse>}
 */
export async function runHook(name: string): Promise<THookResponse> {
  const hook = hooks[name]

  if (hook) return await hook()
  throw new Error(`Hook with ${name} not found`)
}
