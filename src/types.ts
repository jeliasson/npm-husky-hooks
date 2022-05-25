export type CommandReturn = {
  errors: string[]
}

export type THooks = {
  [key: string]: () => Promise<ThookResponse>
}

export type ThookResponse = {
  stdout: string[]
  errors: string[]
}
