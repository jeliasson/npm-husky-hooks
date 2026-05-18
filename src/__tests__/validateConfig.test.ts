import { validateConfig } from '../config'
import { Config } from '../types'
import { CLIError } from '../response'

describe('validateConfig', () => {
  const validConfig: Config = {
    hooks: {
      'pre-commit': ['check-branch'],
      'pre-push': ['check-branch'],
    },
    settings: {
      'check-branch': { protectedBranches: ['main'] },
      'check-lock-files': { allowLockFile: 'package-lock.json', denyLockFiles: [] },
      'test-sleep': { delay: 100 },
    },
  }

  it('should return config when valid', async () => {
    const result = await validateConfig(validConfig)
    expect(result).toEqual(validConfig)
  })

  it('should throw CLIError for invalid config', async () => {
    const invalidConfig = {
      ...validConfig,
      hooks: { 'pre-commit': ['bad-hook'], 'pre-push': [] },
    } as unknown as Config

    await expect(validateConfig(invalidConfig)).rejects.toThrow(CLIError)
    try {
      await validateConfig(invalidConfig)
    } catch (error) {
      expect((error as CLIError).exitCode).toBe(1)
      expect((error as CLIError).message).toContain('occurred while validating')
    }
  })

  it('should pluralize error messages for multiple issues', async () => {
    const invalidConfig = {
      hooks: { 'pre-commit': ['bad'], 'pre-push': ['bad'] },
      settings: {},
    } as unknown as Config

    try {
      await validateConfig(invalidConfig)
      fail('should have thrown')
    } catch (error) {
      expect((error as CLIError).message).toContain('errors')
    }
  })
})
