import { describe, expect, it } from '@jest/globals';

import { getOptionalArrayOrThrow } from './get-optional-array-or-throw.js';

describe('getOptionalArrayOrThrow', () => {
  describe('valid inputs', () => {
    it('should return the array when the key holds an array', () => {
      const result = getOptionalArrayOrThrow({
        key: 'items',
        obj: { items: ['a', 'b'] },
      });

      expect(result).toEqual(['a', 'b']);
    });

    it('should return an empty array when the key holds an empty array', () => {
      const result = getOptionalArrayOrThrow({
        key: 'items',
        obj: { items: [] },
      });

      expect(result).toEqual([]);
    });

    it('should return undefined when the key is not present', () => {
      const result = getOptionalArrayOrThrow({
        key: 'missing' as keyof { other: string },
        obj: { other: 'value' } as Record<string, unknown>,
      });

      expect(result).toBeUndefined();
    });

    it('should return undefined when the value is explicitly undefined', () => {
      const result = getOptionalArrayOrThrow({
        key: 'items',
        obj: { items: undefined },
      });

      expect(result).toBeUndefined();
    });
  });

  describe('invalid obj parameter', () => {
    it('should throw for null obj', () => {
      expect(() => {
        getOptionalArrayOrThrow({ key: 'k', obj: null as any });
      }).toThrow(new Error('Expected an object'));
    });

    it('should throw for undefined obj', () => {
      expect(() => {
        getOptionalArrayOrThrow({ key: 'k', obj: undefined as any });
      }).toThrow(new Error('Expected an object'));
    });

    it('should throw for false obj', () => {
      expect(() => {
        getOptionalArrayOrThrow({ key: 'k', obj: false as never });
      }).toThrow(new Error('Expected an object'));
    });
  });

  describe('invalid value types', () => {
    it.each([
      ['a string', 'not-an-array'],
      ['a number', 42],
      ['a boolean', true],
      ['an object', { nested: true }],
      ['null', null],
    ])('should throw when value is %s', (_, value) => {
      expect(() => {
        getOptionalArrayOrThrow({
          key: 'items',
          obj: { items: value },
        });
      }).toThrow(new Error('items must be an array or undefined'));
    });
  });

  describe('edge cases', () => {
    it('should include the key name in the error message', () => {
      expect(() => {
        getOptionalArrayOrThrow({
          key: 'mySpecialKey',
          obj: { mySpecialKey: 123 },
        });
      }).toThrow(new Error('mySpecialKey must be an array or undefined'));
    });

    it('should work with numeric-like string keys', () => {
      const result = getOptionalArrayOrThrow({
        key: 'list',
        obj: { list: ['a', 'b'] },
      });

      expect(result).toEqual(['a', 'b']);
    });
  });
});
