import { describe, expect, it } from '@jest/globals';

import { getOptionalObjectOrThrow } from './get-optional-object-or-throw.js';

describe('getOptionalObjectOrThrow', () => {
  describe('valid inputs', () => {
    it('should return the object when the key holds a plain object', () => {
      const result = getOptionalObjectOrThrow({
        key: 'config',
        obj: { config: { nested: 'value' } },
      });

      expect(result).toEqual({ nested: 'value' });
    });

    it('should return an empty object when the key holds an empty object', () => {
      const result = getOptionalObjectOrThrow({
        key: 'config',
        obj: { config: {} },
      });

      expect(result).toEqual({});
    });

    it('should return undefined when the key is not present', () => {
      const result = getOptionalObjectOrThrow({
        key: 'missing' as keyof { other: string },
        obj: { other: 'value' } as Record<string, unknown>,
      });

      expect(result).toBeUndefined();
    });

    it('should return undefined when the value is explicitly undefined', () => {
      const result = getOptionalObjectOrThrow({
        key: 'config',
        obj: { config: undefined },
      });

      expect(result).toBeUndefined();
    });

    it('should return a deeply nested object', () => {
      const nested = { a: { b: { c: 1 } } };
      const result = getOptionalObjectOrThrow({
        key: 'config',
        obj: { config: nested },
      });

      expect(result).toEqual(nested);
    });
  });

  describe('invalid obj parameter', () => {
    it('should throw for null obj', () => {
      expect(() => {
        getOptionalObjectOrThrow({ key: 'k', obj: null as any });
      }).toThrow(new Error('Expected an object'));
    });

    it('should throw for undefined obj', () => {
      expect(() => {
        getOptionalObjectOrThrow({ key: 'k', obj: undefined as any });
      }).toThrow(new Error('Expected an object'));
    });

    it('should throw for false obj', () => {
      expect(() => {
        getOptionalObjectOrThrow({ key: 'k', obj: false as any });
      }).toThrow(new Error('Expected an object'));
    });
  });

  describe('invalid value types', () => {
    it.each([
      ['a string', 'not-an-object'],
      ['a number', 42],
      ['a boolean', true],
      ['null', null],
    ])('should throw when value is %s', (_, value) => {
      expect(() => {
        getOptionalObjectOrThrow({
          key: 'config',
          obj: { config: value },
        });
      }).toThrow(new Error('config must be an object or undefined'));
    });
  });

  describe('edge cases', () => {
    it('should include the key name in the error message', () => {
      expect(() => {
        getOptionalObjectOrThrow({
          key: 'rulesConfig',
          obj: { rulesConfig: 'invalid' },
        });
      }).toThrow(new Error('rulesConfig must be an object or undefined'));
    });

    it('should return an array value', () => {
      const result = getOptionalObjectOrThrow({
        key: 'config',
        obj: { config: ['a', 'b'] },
      });

      expect(result).toEqual(['a', 'b']);
    });

    it('should return an empty array value', () => {
      const result = getOptionalObjectOrThrow({
        key: 'config',
        obj: { config: [] },
      });

      expect(result).toEqual([]);
    });
  });
});
