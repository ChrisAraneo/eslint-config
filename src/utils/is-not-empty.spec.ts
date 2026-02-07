import { describe, expect, it } from '@jest/globals';

import { isNotEmpty } from './is-not-empty.js';

describe('isNotEmpty', () => {
  it('should return false for null', () => {
    expect(isNotEmpty(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isNotEmpty(undefined)).toBe(false);
  });

  it('should return false for empty array', () => {
    expect(isNotEmpty([])).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isNotEmpty('')).toBe(false);
  });

  it('should return false for empty object', () => {
    expect(isNotEmpty({})).toBe(false);
  });

  it('should return true for non-empty array', () => {
    expect(isNotEmpty([1, 2, 3])).toBe(true);
  });

  it('should return true for array with single element', () => {
    expect(isNotEmpty([1])).toBe(true);
  });

  it('should return true for non-empty string', () => {
    expect(isNotEmpty('hello')).toBe(true);
  });

  it('should return true for string with single character', () => {
    expect(isNotEmpty('a')).toBe(true);
  });

  it('should return true for non-empty object', () => {
    expect(isNotEmpty({ key: 'value' })).toBe(true);
  });

  it('should return true for object with single property', () => {
    expect(isNotEmpty({ a: 1 })).toBe(true);
  });

  it('should return true for number zero', () => {
    expect(isNotEmpty(0)).toBe(true);
  });

  it('should return true for positive number', () => {
    expect(isNotEmpty(42)).toBe(true);
  });

  it('should return true for negative number', () => {
    expect(isNotEmpty(-1)).toBe(true);
  });

  it('should return true for boolean true', () => {
    expect(isNotEmpty(true)).toBe(true);
  });

  it('should return true for boolean false', () => {
    expect(isNotEmpty(false)).toBe(true);
  });
});
