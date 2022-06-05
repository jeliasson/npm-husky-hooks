import { z } from 'zod'

export type SettingsByName = {
  settings: any
  path: string
}

export type SettingByName = {
  value: boolean | number | string | object
  path: string
}

export type Config = z.infer<typeof ConfigSchema>

// @todo: Use getHooksAsArray below
//const hooksFromArray = getHooksAsArray()
const hooksAsConst = [
  'check-branch',
  'check-lock-files',
  'run-cmd',
  'test-sleep',
  'test-check-ip',
] as const
const Hooks = z.enum(hooksAsConst)

// @todo: Make sure that the array has two elements
const HookSchema = z.array(z.union([Hooks, z.array(z.string(), z.string())]))

// @todo: Add validation messages. Not sure how to reach the message 'Required'
export const ConfigSchema = z.object({
  hooks: z.object({
    'pre-commit': HookSchema,
    'pre-push': HookSchema,
  }),
  settings: z.object({
    'check-branch': z.object({
      protectedBranches: z.array(z.string()),
    }),
    'check-lock-files': z.object({
      allowLockFile: z.string(),
      denyLockFiles: z.array(z.string()),
    }),
    'test-sleep': z.object({
      // @todo: Figure out why below is resulting in 'undefined' on the expected value
      delay: z.number().min(0),
    }),
  }),
})
