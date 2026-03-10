import { describe, expect, it } from '@jest/globals';

import { getOptionalStringOrThrow } from './get-optional-string-or-throw.js';

describe('getOptionalStringOrThrow', () => {
  describe('valid inputs', () => {
    it('should return the string when the key holds a string', () => {
      const result = getOptionalStringOrThrow({
        key: 'name',
        obj: { name: 'hello' },
      });

      expect(result).toBe('hello');
    });

    it('should return an empty string when the key holds an empty string', () => {
      const result = getOptionalStringOrThrow({
        key: 'name',
        obj: { name: '' },
      });

      expect(result).toBe('');
    });

    it('should return undefined when the key is not present', () => {
      const result = getOptionalStringOrThrow({
        key: 'missing' as keyof { other: number },
        obj: { other: 42 } as Record<string, unknown>,
      });

      expect(result).toBeUndefined();
    });

    it('should return undefined when the value is explicitly undefined', () => {
      const result = getOptionalStringOrThrow({
        key: 'name',
        obj: { name: undefined },
      });

      expect(result).toBeUndefined();
    });
  });

  describe('invalid obj parameter', () => {
    it('should throw for null obj', () => {
      expect(() => {
        getOptionalStringOrThrow({ key: 'k', obj: null as any });
      }).toThrow(new Error('Expected an object'));
    });

    it('should throw for undefined obj', () => {
      expect(() => {
        getOptionalStringOrThrow({ key: 'k', obj: undefined as any });
      }).toThrow(new Error('Expected an object'));
    });

    it('should throw for false obj', () => {
      expect(() => {
        getOptionalStringOrThrow({ key: 'k', obj: false as any });
      }).toThrow(new Error('Expected an object'));
    });
  });

  describe('invalid value types', () => {
    it.each([
      ['a number', 42],
      ['a boolean', true],
      ['an array', ['a']],
      ['an object', { nested: true }],
      ['null', null],
    ])('should throw when value is %s', (_, value) => {
      expect(() => {
        getOptionalStringOrThrow({
          key: 'name',
          obj: { name: value },
        });
      }).toThrow(new Error('name must be a string or undefined'));
    });
  });

  describe('edge cases', () => {
    it('should include the key name in the error message', () => {
      expect(() => {
        getOptionalStringOrThrow({
          key: 'tsconfigRootDir',
          obj: { tsconfigRootDir: 123 },
        });
      }).toThrow(new Error('tsconfigRootDir must be a string or undefined'));
    });
  });
});
