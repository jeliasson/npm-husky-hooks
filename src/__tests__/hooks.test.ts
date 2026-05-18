import { runHook, getHookNames, hooks } from '../hooks'

describe('hooks registry', () => {
  describe('hooks object', () => {
    it('should have all expected hooks registered', () => {
      expect(hooks).toHaveProperty('check-branch')
      expect(hooks).toHaveProperty('check-lock-files')
      expect(hooks).toHaveProperty('run-cmd')
      expect(hooks).toHaveProperty('test-sleep')
      expect(hooks).toHaveProperty('test-check-ip')
    })

    it('should have functions as values', () => {
      for (const key of Object.keys(hooks)) {
        expect(typeof hooks[key]).toBe('function')
      }
    })
  })

  describe('getHookNames', () => {
    it('should return all hook names', () => {
      const names = getHookNames()
      expect(names).toContain('check-branch')
      expect(names).toContain('check-lock-files')
      expect(names).toContain('run-cmd')
      expect(names).toContain('test-sleep')
      expect(names).toContain('test-check-ip')
    })
  })

  describe('runHook', () => {
    it('should throw for unknown hook', async () => {
      await expect(runHook('nonexistent')).rejects.toThrow('not found')
    })
  })
})
