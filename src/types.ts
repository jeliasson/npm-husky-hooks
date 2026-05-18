import { z } from 'zod'

// CLI
export type CLIParserResponse = {
  args: string[]
  opts: {
    [key: string]: boolean | number | string
  }
}

// Hooks
export type HookResponse = {
  stdout: string[]
  errors: string[]
}

export type Hooks = {
  [key: string]: (arg: string) => Promise<HookResponse>
}

// Commands
export type CommandResponse = HookResponse

export type Commands = {
  [key: string]: () => Promise<CommandResponse>
}

// Config
export type Config = z.infer<typeof ConfigSchema>

export type SettingsName = keyof Config['settings']

const HookNames = [
  'check-branch',
  'check-lock-files',
  'run-cmd',
  'test-sleep',
  'test-check-ip',
] as const
const HookName = z.enum(HookNames)

const HookWithArg = z.tuple([HookName, z.string()])

const HookEntry = z.union([HookName, HookWithArg])

const HookSchema = z.array(HookEntry)

export const ConfigSchema = z.object({
  hooks: z.record(z.string(), HookSchema),
  settings: z.object({
    'check-branch': z.object({
      protectedBranches: z.array(z.string()),
    }),
    'check-lock-files': z.object({
      allowLockFile: z.string(),
      denyLockFiles: z.array(z.string()),
    }),
    'test-sleep': z.object({
      delay: z.number().min(0),
    }),
  }),
})
