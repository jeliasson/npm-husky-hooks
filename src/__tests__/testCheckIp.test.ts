import { testCheckIp } from '../hooks/testCheckIp'

const mockFetch = jest.fn()
global.fetch = mockFetch

describe('testCheckIp hook', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should return the IP address from the API', async () => {
    mockFetch.mockResolvedValue({
      json: async () => ({ ip: '1.2.3.4' }),
    })

    const result = await testCheckIp()

    expect(mockFetch).toHaveBeenCalledWith('https://api64.ipify.org?format=json')
    expect(result.stdout).toEqual(['1.2.3.4'])
    expect(result.errors).toHaveLength(0)
  })

  it('should propagate fetch errors', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))

    await expect(testCheckIp()).rejects.toThrow('Network error')
  })
})
