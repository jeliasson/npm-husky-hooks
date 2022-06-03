export type CommandReturn = {
  errors: string[]
}

export type Hooks = {
  [key: string]: (arg: string) => Promise<HookResponse>
}

export type SettingByHook = {
  config: any
  path: string
}

export type HookResponse = {
  stdout: string[]
  errors: string[]
}

export type Commands = {
  [key: string]: () => Promise<CommandResponse>
}

export type CommandResponse = {
  stdout: string[]
  errors: string[]
}

export type Config = {
  hooks: Hooks
}
