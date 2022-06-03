export type Config = {
  test: string
}

export type SettingsByName = {
  settings: any
  path: string
}

export type SettingByName = {
  value: boolean | number | string | object
  path: string
}
