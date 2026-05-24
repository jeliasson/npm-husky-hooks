import { createConfigCommand } from '../commands'
import * as config from '../config'
import * as cli from '../cli'

jest.mock('../config', () => ({
  ...jest.requireActual('../config'),
  createConfig: jest.fn(),
  CONFIG_FILE: 'husky-hooks.config.cjs',
}))

jest.mock('../cli', () => ({
  CLIParser: jest.fn(),
}))

const mockedCreateConfig = config.createConfig as jest.MockedFunction<
  typeof config.createConfig
>
const mockedCLIParser = cli.CLIParser as jest.MockedFunction<
  typeof cli.CLIParser
>

describe('createConfigCommand', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should call createConfig with force=false by default', async () => {
    mockedCLIParser.mockResolvedValue({ args: ['create-config'], opts: {} })
    mockedCreateConfig.mockResolvedValue(false)

    const result = await createConfigCommand()

    expect(mockedCreateConfig).toHaveBeenCalledWith(false)
    expect(result).toEqual({ stdout: [], errors: [] })
  })

  it('should call createConfig with force=true when --force is passed', async () => {
    mockedCLIParser.mockResolvedValue({
      args: ['create-config'],
      opts: { force: true },
    })
    mockedCreateConfig.mockResolvedValue(true)

    await createConfigCommand()

    expect(mockedCreateConfig).toHaveBeenCalledWith(true)
  })

  it('should return success message when config is created', async () => {
    mockedCLIParser.mockResolvedValue({ args: ['create-config'], opts: {} })
    mockedCreateConfig.mockResolvedValue(true)

    const result = await createConfigCommand()

    expect(result.stdout).toEqual(
      expect.arrayContaining([expect.stringContaining('was created')])
    )
    expect(result.errors).toEqual([])
  })
})
