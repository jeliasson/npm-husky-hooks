export type CommandReturn = {
  errors: string[]
}

export type THooks = {
  [key: string]: () => Promise<ThookResponse>
}

export type TSettingByHook = {
  config: any
  path: string
}

export type ThookResponse = {
  stdout: string[]
  errors: string[]
}
