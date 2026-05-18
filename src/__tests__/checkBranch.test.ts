import { execFileSync } from 'node:child_process'

import { checkBranch } from '../hooks/checkBranch'
import * as config from '../config'

jest.mock('node:child_process', () => ({
  execFileSync: jest.fn(),
}))

jest.mock('../config', () => ({
  ...jest.requireActual('../config'),
  getSetting: jest.fn(),
}))

const mockedExecFileSync = execFileSync as jest.MockedFunction<typeof execFileSync>
const mockedGetSetting = config.getSetting as jest.MockedFunction<typeof config.getSetting>

describe('checkBranch hook', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return error when on a protected branch', async () => {
    mockedGetSetting.mockResolvedValue(['main', 'dev'] as never)
    mockedExecFileSync.mockReturnValue(Buffer.from('main\n'))

    const result = await checkBranch()

    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]).toContain('main')
    expect(result.errors[0]).toContain('protected')
  })

  it('should return no errors when on an unprotected branch', async () => {
    mockedGetSetting.mockResolvedValue(['main', 'dev'] as never)
    mockedExecFileSync.mockReturnValue(Buffer.from('feature/my-branch\n'))

    const result = await checkBranch()

    expect(result.errors).toHaveLength(0)
    expect(result.stdout).toHaveLength(0)
  })
})
