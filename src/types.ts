export type CommandReturn = {
  errors: string[]
}

export type THooks = {
  [key: string]: () => Promise<THookResponse>
}

export type TSettingByHook = {
  config: any
  path: string
}

export type THookResponse = {
  stdout: string[]
  errors: string[]
}

export type TCommands = {
  [key: string]: () => Promise<TCommandResponse>
}

export type TCommandResponse = {
  stdout: string[]
  errors: string[]
}
