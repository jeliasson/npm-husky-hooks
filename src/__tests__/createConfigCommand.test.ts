import { createConfigCommand } from '../commands'
import { CLIError } from '../response'
import * as config from '../config'
import * as cli from '../cli'

jest.mock('../config', () => ({
  ...jest.requireActual('../config'),
  createConfig: jest.fn(),
  CONFIG_FILE: 'husky-hooks.config.js',
}))

jest.mock('../cli', () => ({
  CLIParser: jest.fn(),
}))

const mockedCreateConfig = config.createConfig as jest.MockedFunction<typeof config.createConfig>
const mockedCLIParser = cli.CLIParser as jest.MockedFunction<typeof cli.CLIParser>

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
    mockedCLIParser.mockResolvedValue({ args: ['create-config'], opts: { force: true } })
    mockedCreateConfig.mockResolvedValue(false)

    await createConfigCommand()

    expect(mockedCreateConfig).toHaveBeenCalledWith(true)
  })

  it('should throw CLIError with exit code 0 when config is created', async () => {
    mockedCLIParser.mockResolvedValue({ args: ['create-config'], opts: {} })
    mockedCreateConfig.mockResolvedValue({ hooks: {}, settings: {} } as never)

    try {
      await createConfigCommand()
      fail('should have thrown')
    } catch (error) {
      expect(error).toBeInstanceOf(CLIError)
      expect((error as CLIError).exitCode).toBe(0)
      expect((error as CLIError).message).toContain('was created')
    }
  })
})
