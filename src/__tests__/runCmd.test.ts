import { spawnSync } from 'node:child_process'

import { runCmd } from '../hooks/runCmd'
import { CLIError } from '../response'

jest.mock('node:child_process', () => ({
  spawnSync: jest.fn(),
}))

const mockedSpawnSync = spawnSync as jest.MockedFunction<typeof spawnSync>

describe('runCmd hook', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should run a command and capture stdout', async () => {
    mockedSpawnSync.mockReturnValue({
      status: 0,
      stdout: Buffer.from('hello world\n'),
      stderr: Buffer.from(''),
      pid: 0,
      output: [],
      signal: null,
    })

    const result = await runCmd('echo hello world')

    expect(mockedSpawnSync).toHaveBeenCalledWith('echo hello world', expect.objectContaining({ shell: true }))
    expect(result.stdout).toContain('hello world')
    expect(result.errors).toHaveLength(0)
  })

  it('should throw CLIError when command is empty', async () => {
    await expect(runCmd('')).rejects.toThrow(CLIError)
    try {
      await runCmd('')
    } catch (error) {
      expect((error as CLIError).message).toContain('empty')
    }
  })

  it('should return errors when command fails', async () => {
    mockedSpawnSync.mockReturnValue({
      status: 1,
      stdout: Buffer.from(''),
      stderr: Buffer.from('command not found\n'),
      pid: 0,
      output: [],
      signal: null,
    })

    const result = await runCmd('bad-command')

    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]).toContain('command not found')
    expect(result.stdout).toHaveLength(0)
  })
})
