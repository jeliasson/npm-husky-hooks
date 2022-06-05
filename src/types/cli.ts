export type CLIParserResponse = {
  args: string[]
  opts: {
    [key: string]: boolean | number | string
  }
}
