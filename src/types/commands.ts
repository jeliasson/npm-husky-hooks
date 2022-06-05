export type Commands = {
  [key: string]: () => Promise<CommandResponse>
}

export type CommandResponse = {
  stdout: string[]
  errors: string[]
}
