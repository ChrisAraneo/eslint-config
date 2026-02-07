import { describe, expect, it } from '@jest/globals';

import { isEmpty } from './is-empty.js';

describe('isEmpty', () => {
  it('should return true for null', () => {
    expect(isEmpty(null)).toBe(true);
  });

  it('should return true for undefined', () => {
    expect(isEmpty(undefined)).toBe(true);
  });

  it('should return true for empty array', () => {
    expect(isEmpty([])).toBe(true);
  });

  it('should return true for empty string', () => {
    expect(isEmpty('')).toBe(true);
  });

  it('should return true for empty object', () => {
    expect(isEmpty({})).toBe(true);
  });

  it('should return false for non-empty array', () => {
    expect(isEmpty([1, 2, 3])).toBe(false);
  });

  it('should return false for array with single element', () => {
    expect(isEmpty([1])).toBe(false);
  });

  it('should return false for non-empty string', () => {
    expect(isEmpty('hello')).toBe(false);
  });

  it('should return false for string with single character', () => {
    expect(isEmpty('a')).toBe(false);
  });

  it('should return false for non-empty object', () => {
    expect(isEmpty({ key: 'value' })).toBe(false);
  });

  it('should return false for object with single property', () => {
    expect(isEmpty({ a: 1 })).toBe(false);
  });

  it('should return false for number zero', () => {
    expect(isEmpty(0)).toBe(false);
  });

  it('should return false for positive number', () => {
    expect(isEmpty(42)).toBe(false);
  });

  it('should return false for negative number', () => {
    expect(isEmpty(-1)).toBe(false);
  });

  it('should return false for boolean true', () => {
    expect(isEmpty(true)).toBe(false);
  });

  it('should return false for boolean false', () => {
    expect(isEmpty(false)).toBe(false);
  });

  it('should return false for function', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    expect(isEmpty(() => {})).toBe(false);
  });

  it('should return true for Date object (no enumerable keys)', () => {
    expect(isEmpty(new Date())).toBe(true);
  });

  it('should return true for RegExp (no enumerable keys)', () => {
    expect(isEmpty(/test/)).toBe(true);
  });
});
