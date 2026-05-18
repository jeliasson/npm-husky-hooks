import fs from 'node:fs'

import { checkLockFiles } from '../hooks/checkLockFiles'
import * as config from '../config'

jest.mock('node:fs')
jest.mock('../config', () => ({
  ...jest.requireActual('../config'),
  getSetting: jest.fn(),
}))

const mockedFs = fs as jest.Mocked<typeof fs>
const mockedGetSetting = config.getSetting as jest.MockedFunction<typeof config.getSetting>

describe('checkLockFiles hook', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return error when a denied lock file exists', async () => {
    mockedGetSetting
      .mockResolvedValueOnce('package-lock.json' as never)
      .mockResolvedValueOnce(['yarn.lock', 'pnpm-lock.yaml'] as never)

    mockedFs.existsSync.mockImplementation((file) => file === 'yarn.lock')

    const result = await checkLockFiles()

    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]).toContain('yarn.lock')
  })

  it('should return errors for multiple denied lock files', async () => {
    mockedGetSetting
      .mockResolvedValueOnce('package-lock.json' as never)
      .mockResolvedValueOnce(['yarn.lock', 'pnpm-lock.yaml'] as never)

    mockedFs.existsSync.mockReturnValue(true)

    const result = await checkLockFiles()

    expect(result.errors).toHaveLength(2)
    expect(result.errors[0]).toContain('yarn.lock')
    expect(result.errors[1]).toContain('pnpm-lock.yaml')
  })

  it('should return no errors when no denied lock files exist', async () => {
    mockedGetSetting
      .mockResolvedValueOnce('package-lock.json' as never)
      .mockResolvedValueOnce(['yarn.lock', 'pnpm-lock.yaml'] as never)

    mockedFs.existsSync.mockReturnValue(false)

    const result = await checkLockFiles()

    expect(result.errors).toHaveLength(0)
  })
})
