import { describe, expect, it } from '@jest/globals';

import { getOptionalBooleanOrThrow } from './get-optional-boolean-or-throw.js';

describe('getOptionalBooleanOrThrow', () => {
  describe('valid inputs', () => {
    it('should return true when the key holds true', () => {
      const result = getOptionalBooleanOrThrow({
        key: 'flag',
        obj: { flag: true },
      });

      expect(result).toBe(true);
    });

    it('should return false when the key holds false', () => {
      const result = getOptionalBooleanOrThrow({
        key: 'flag',
        obj: { flag: false },
      });

      expect(result).toBe(false);
    });

    it('should return undefined when the key is not present', () => {
      const result = getOptionalBooleanOrThrow({
        key: 'missing' as keyof { other: string },
        obj: { other: 'value' } as Record<string, unknown>,
      });

      expect(result).toBeUndefined();
    });

    it('should return undefined when the value is explicitly undefined', () => {
      const result = getOptionalBooleanOrThrow({
        key: 'flag',
        obj: { flag: undefined },
      });

      expect(result).toBeUndefined();
    });
  });

  describe('invalid obj parameter', () => {
    it('should throw for null obj', () => {
      expect(() => {
        getOptionalBooleanOrThrow({ key: 'k', obj: null as any });
      }).toThrow(new Error('Expected an object'));
    });

    it('should throw for undefined obj', () => {
      expect(() => {
        getOptionalBooleanOrThrow({ key: 'k', obj: undefined as any });
      }).toThrow(new Error('Expected an object'));
    });

    it('should throw for false obj', () => {
      expect(() => {
        getOptionalBooleanOrThrow({ key: 'k', obj: false as any });
      }).toThrow(new Error('Expected an object'));
    });
  });

  describe('invalid value types', () => {
    it.each([
      ['a string', 'not-a-boolean'],
      ['a number', 42],
      ['an array', [true]],
      ['an object', { nested: true }],
      ['null', null],
    ])('should throw when value is %s', (_, value) => {
      expect(() => {
        getOptionalBooleanOrThrow({
          key: 'flag',
          obj: { flag: value },
        });
      }).toThrow(new Error('flag must be a boolean or undefined'));
    });
  });

  describe('edge cases', () => {
    it('should include the key name in the error message', () => {
      expect(() => {
        getOptionalBooleanOrThrow({
          key: 'shouldEnable',
          obj: { shouldEnable: 'yes' },
        });
      }).toThrow(new Error('shouldEnable must be a boolean or undefined'));
    });
  });
});
