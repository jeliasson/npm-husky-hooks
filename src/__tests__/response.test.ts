import { CLIError, ThrowError, ThrowException, createResponse } from '../response'

describe('response', () => {
  describe('CLIError', () => {
    it('should store messages and exit code', () => {
      const error = new CLIError(['msg1', 'msg2'], 1)
      expect(error.messages).toEqual(['msg1', 'msg2'])
      expect(error.exitCode).toBe(1)
      expect(error.message).toBe('msg1\nmsg2')
      expect(error.name).toBe('CLIError')
    })

    it('should default exit code to 1', () => {
      const error = new CLIError(['oops'])
      expect(error.exitCode).toBe(1)
    })
  })

  describe('ThrowError', () => {
    it('should throw CLIError with exit code 1', () => {
      try {
        ThrowError(['Something failed'])
        fail('should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(CLIError)
        expect((error as CLIError).exitCode).toBe(1)
        expect((error as CLIError).messages).toEqual(['Something failed'])
      }
    })
  })

  describe('ThrowException', () => {
    it('should throw an Error with formatted message', () => {
      expect(() => ThrowException(['Oops'])).toThrow('Exception')
      expect(() => ThrowException(['Oops'])).toThrow('Oops')
    })
  })

  describe('createResponse', () => {
    it('should return empty stdout and errors arrays', () => {
      const res = createResponse()
      expect(res).toEqual({ stdout: [], errors: [] })
    })

    it('should allow pushing to stdout and errors', () => {
      const res = createResponse()
      res.stdout.push('output')
      res.errors.push('err')
      expect(res.stdout).toEqual(['output'])
      expect(res.errors).toEqual(['err'])
    })
  })
})
