import { ConfigSchema } from '../types'

describe('ConfigSchema validation', () => {
  const validConfig = {
    hooks: {
      'pre-commit': ['check-branch', 'check-lock-files'],
      'pre-push': ['check-branch'],
    },
    settings: {
      'check-branch': {
        protectedBranches: ['main'],
      },
      'check-lock-files': {
        allowLockFile: 'package-lock.json',
        denyLockFiles: ['yarn.lock'],
      },
      'test-sleep': {
        delay: 1000,
      },
    },
  }

  it('should validate a correct config', () => {
    const result = ConfigSchema.safeParse(validConfig)
    expect(result.success).toBe(true)
  })

  it('should accept empty hooks object', () => {
    const result = ConfigSchema.safeParse({
      ...validConfig,
      hooks: {},
    })
    expect(result.success).toBe(true)
  })

  it('should accept any git hook name', () => {
    const result = ConfigSchema.safeParse({
      ...validConfig,
      hooks: {
        'commit-msg': ['check-branch'],
        'post-merge': [['run-cmd', 'npm install']],
        'prepare-commit-msg': [],
      },
    })
    expect(result.success).toBe(true)
  })

  it('should accept config with empty settings', () => {
    const result = ConfigSchema.safeParse({
      ...validConfig,
      settings: {},
    })
    expect(result.success).toBe(true)
  })

  it('should accept config with only some settings', () => {
    const result = ConfigSchema.safeParse({
      ...validConfig,
      settings: {
        'check-branch': { protectedBranches: ['main'] },
      },
    })
    expect(result.success).toBe(true)
  })

  it('should reject invalid hook names in hook arrays', () => {
    const result = ConfigSchema.safeParse({
      ...validConfig,
      hooks: {
        'pre-commit': ['invalid-hook-name'],
      },
    })
    expect(result.success).toBe(false)
  })

  it('should accept hooks with arguments (tuple format)', () => {
    const result = ConfigSchema.safeParse({
      ...validConfig,
      hooks: {
        ...validConfig.hooks,
        'pre-commit': [['run-cmd', 'npm run lint']],
      },
    })
    expect(result.success).toBe(true)
  })

  it('should reject hook tuples with more than 2 elements', () => {
    const result = ConfigSchema.safeParse({
      ...validConfig,
      hooks: {
        ...validConfig.hooks,
        'pre-commit': [['run-cmd', 'arg1', 'arg2']],
      },
    })
    expect(result.success).toBe(false)
  })

  it('should reject negative delay in test-sleep settings', () => {
    const result = ConfigSchema.safeParse({
      ...validConfig,
      settings: {
        ...validConfig.settings,
        'test-sleep': { delay: -1 },
      },
    })
    expect(result.success).toBe(false)
  })
})
