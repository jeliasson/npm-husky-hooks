import { runCommand, commands } from '../commands'
import { CLIError } from '../response'

describe('commands', () => {
  describe('commands object', () => {
    it('should have create-config registered', () => {
      expect(commands).toHaveProperty('create-config')
      expect(typeof commands['create-config']).toBe('function')
    })
  })

  describe('runCommand', () => {
    it('should throw CLIError when command name is empty', async () => {
      await expect(runCommand('')).rejects.toThrow(CLIError)
      try {
        await runCommand('')
      } catch (error) {
        expect((error as CLIError).exitCode).toBe(1)
      }
    })

    it('should return false when command name is not registered', async () => {
      const result = await runCommand('unknown-cmd')
      expect(result).toBe(false)
    })
  })
})
