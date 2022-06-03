export type Hooks = {
  [key: string]: (arg: string) => Promise<HookResponse>
}

export type HookResponse = {
  stdout: string[]
  errors: string[]
}
