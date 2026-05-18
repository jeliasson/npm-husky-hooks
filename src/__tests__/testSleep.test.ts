import { testSleep } from '../hooks/testSleep'
import * as config from '../config'

jest.mock('../config', () => ({
  ...jest.requireActual('../config'),
  getSetting: jest.fn(),
}))

const mockedGetSetting = config.getSetting as jest.MockedFunction<typeof config.getSetting>

describe('testSleep hook', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should resolve after the configured delay', async () => {
    mockedGetSetting.mockResolvedValue(10 as never)

    const start = Date.now()
    const result = await testSleep()
    const elapsed = Date.now() - start

    expect(elapsed).toBeGreaterThanOrEqual(5)
    expect(result.stdout).toHaveLength(0)
    expect(result.errors).toHaveLength(0)
  })
})
