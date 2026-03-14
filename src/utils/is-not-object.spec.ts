import { describe, expect, it } from '@jest/globals';

import { isNotObject } from './is-not-object.js';

describe('isNotObject', () => {
  describe('returns true for non-object values', () => {
    it('should return true for null', () => {
      expect(isNotObject(null)).toBe(true);
    });

    it('should return true for undefined', () => {
      expect(isNotObject(undefined)).toBe(true);
    });

    it('should return true for a string', () => {
      expect(isNotObject('hello')).toBe(true);
    });

    it('should return true for an empty string', () => {
      expect(isNotObject('')).toBe(true);
    });

    it('should return true for a number', () => {
      expect(isNotObject(42)).toBe(true);
    });

    it('should return true for zero', () => {
      expect(isNotObject(0)).toBe(true);
    });

    it('should return true for NaN', () => {
      expect(isNotObject(Number.NaN)).toBe(true);
    });

    it('should return true for Infinity', () => {
      expect(isNotObject(Infinity)).toBe(true);
    });

    it('should return true for true', () => {
      expect(isNotObject(true)).toBe(true);
    });

    it('should return true for false', () => {
      expect(isNotObject(false)).toBe(true);
    });

    it('should return true for a symbol', () => {
      expect(isNotObject(Symbol('sym'))).toBe(true);
    });

    it('should return true for a bigint', () => {
      expect(isNotObject(BigInt(9007199254740991))).toBe(true);
    });
  });

  describe('returns false for object values', () => {
    it('should return false for a plain object', () => {
      expect(isNotObject({})).toBe(false);
    });

    it('should return false for a non-empty plain object', () => {
      expect(isNotObject({ key: 'value' })).toBe(false);
    });

    it('should return false for an array', () => {
      expect(isNotObject([])).toBe(false);
    });

    it('should return false for a non-empty array', () => {
      expect(isNotObject([1, 2, 3])).toBe(false);
    });

    it('should return false for a function', () => {
      expect(isNotObject(() => undefined)).toBe(false);
    });

    it('should return false for a named function', () => {
      function namedFn(): void {
        return undefined;
      }
      expect(isNotObject(namedFn)).toBe(false);
    });

    it('should return false for a Date instance', () => {
      expect(isNotObject(new Date())).toBe(false);
    });

    it('should return false for a RegExp instance', () => {
      expect(isNotObject(/regex/)).toBe(false);
    });

    it('should return false for a Map instance', () => {
      expect(isNotObject(new Map())).toBe(false);
    });

    it('should return false for a Set instance', () => {
      expect(isNotObject(new Set())).toBe(false);
    });

    it('should return false for a class instance', () => {
      class Foo {
        bar = true;
      }
      expect(isNotObject(new Foo())).toBe(false);
    });

    it('should return false for a boxed String', () => {
      expect(isNotObject(new String('wrapped'))).toBe(false);
    });

    it('should return false for a boxed Number', () => {
      expect(isNotObject(new Number(42))).toBe(false);
    });

    it('should return false for a boxed Boolean', () => {
      expect(isNotObject(new Boolean(true))).toBe(false);
    });
  });
});
