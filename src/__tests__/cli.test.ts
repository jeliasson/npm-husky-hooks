import { CLIParser } from '../cli'

 
const { version } = require('../../package.json')

describe('CLIParser', () => {
  const originalArgv = process.argv

  afterEach(() => {
    process.argv = originalArgv
  })

  function setArgv(...args: string[]): void {
    process.argv = ['node', 'husky-hooks', ...args]
  }

  describe('positional arguments', () => {
    it('returns empty args when no arguments are provided', async () => {
      setArgv()
      const result = await CLIParser()
      expect(result.args).toEqual([])
    })

    it('parses a single command argument', async () => {
      setArgv('pre-commit')
      const result = await CLIParser()
      expect(result.args).toEqual(['pre-commit'])
    })

    it('parses a command with an additional argument', async () => {
      setArgv('commit-msg', '.git/COMMIT_EDITMSG')
      const result = await CLIParser()
      expect(result.args).toEqual(['commit-msg', '.git/COMMIT_EDITMSG'])
    })
  })

  describe('boolean flags', () => {
    it('defaults force and stdout to false when absent', async () => {
      setArgv('pre-commit')
      const result = await CLIParser()
      expect(result.opts.force).toBe(false)
      expect(result.opts.stdout).toBe(false)
    })

    it('sets force to true when --force is present', async () => {
      setArgv('create-config', '--force')
      const result = await CLIParser()
      expect(result.opts.force).toBe(true)
      expect(result.args).toEqual(['create-config'])
    })

    it('sets stdout to true when --stdout is present', async () => {
      setArgv('pre-commit', '--stdout')
      const result = await CLIParser()
      expect(result.opts.stdout).toBe(true)
    })

    it('parses flags mixed with positional args', async () => {
      setArgv('--stdout', 'pre-commit', '--force')
      const result = await CLIParser()
      expect(result.args).toEqual(['pre-commit'])
      expect(result.opts.force).toBe(true)
      expect(result.opts.stdout).toBe(true)
    })
  })

  describe('version flag', () => {
    let logSpy: jest.SpyInstance
    let exitSpy: jest.SpyInstance

    beforeEach(() => {
      logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
      exitSpy = jest
        .spyOn(process, 'exit')
        .mockImplementation((() => {
          throw new Error('process.exit called')
        }) as never)
    })

    afterEach(() => {
      logSpy.mockRestore()
      exitSpy.mockRestore()
    })

    it('prints version and exits on --version', async () => {
      setArgv('--version')
      await expect(CLIParser()).rejects.toThrow('process.exit called')
      expect(logSpy).toHaveBeenCalledWith(version)
      expect(exitSpy).toHaveBeenCalledWith(0)
    })

    it('prints version and exits on -v', async () => {
      setArgv('-v')
      await expect(CLIParser()).rejects.toThrow('process.exit called')
      expect(logSpy).toHaveBeenCalledWith(version)
      expect(exitSpy).toHaveBeenCalledWith(0)
    })
  })

  describe('help flag', () => {
    let logSpy: jest.SpyInstance
    let exitSpy: jest.SpyInstance

    beforeEach(() => {
      logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
      exitSpy = jest
        .spyOn(process, 'exit')
        .mockImplementation((() => {
          throw new Error('process.exit called')
        }) as never)
    })

    afterEach(() => {
      logSpy.mockRestore()
      exitSpy.mockRestore()
    })

    it('prints help and exits on --help', async () => {
      setArgv('--help')
      await expect(CLIParser()).rejects.toThrow('process.exit called')
      expect(logSpy).toHaveBeenCalledTimes(1)
      expect(logSpy.mock.calls[0][0]).toContain('husky-hooks')
      expect(exitSpy).toHaveBeenCalledWith(0)
    })

    it('prints help and exits on -h', async () => {
      setArgv('-h')
      await expect(CLIParser()).rejects.toThrow('process.exit called')
      expect(logSpy).toHaveBeenCalledTimes(1)
      expect(logSpy.mock.calls[0][0]).toContain('husky-hooks')
      expect(exitSpy).toHaveBeenCalledWith(0)
    })
  })
})
