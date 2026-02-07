import { describe, expect, it } from '@jest/globals';

import { mapValues } from './map-values.js';

describe('mapValues', () => {
  it('should map values of an object', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = mapValues(obj, (value) => value * 2);

    expect(result).toEqual({ a: 2, b: 4, c: 6 });
  });

  it('should handle empty object', () => {
    const obj = {};
    const result = mapValues(obj, (value) => value);

    expect(result).toEqual({});
  });

  it('should pass value, key, and object to the function', () => {
    const obj = { a: 1, b: 2 };
    const result = mapValues(obj, (value, key, object) => {
      expect(object).toBe(obj);
      return `${String(key)}:${value}`;
    });

    expect(result).toEqual({ a: 'a:1', b: 'b:2' });
  });

  it('should transform values to different types', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = mapValues(obj, (value) => String(value));

    expect(result).toEqual({ a: '1', b: '2', c: '3' });
  });

  it('should work with string values', () => {
    const obj = { first: 'hello', second: 'world' };
    const result = mapValues(obj, (value) => value.toUpperCase());

    expect(result).toEqual({ first: 'HELLO', second: 'WORLD' });
  });

  it('should work with complex transformations', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = mapValues(obj, (value, key) => ({
      doubled: value * 2,
      key: String(key),
      value,
    }));

    expect(result).toEqual({
      a: { doubled: 2, key: 'a', value: 1 },
      b: { doubled: 4, key: 'b', value: 2 },
      c: { doubled: 6, key: 'c', value: 3 },
    });
  });

  it('should preserve key types', () => {
    const obj = { x: 10, y: 20, z: 30 };
    const result = mapValues(obj, (value) => value / 10);

    expect(result).toEqual({ x: 1, y: 2, z: 3 });
    expect(Object.keys(result)).toEqual(['x', 'y', 'z']);
  });

  it('should handle single property object', () => {
    const obj = { only: 'value' };
    const result = mapValues(obj, (value) => value.toUpperCase());

    expect(result).toEqual({ only: 'VALUE' });
  });

  it('should work with boolean values', () => {
    const obj = { a: true, b: false, c: true };
    const result = mapValues(obj, (value) => !value);

    expect(result).toEqual({ a: false, b: true, c: false });
  });

  it('should work with array values', () => {
    const obj = { a: [1, 2], b: [3, 4], c: [5, 6] };
    const result = mapValues(obj, (value) => value.length);

    expect(result).toEqual({ a: 2, b: 2, c: 2 });
  });

  it('should work with object values', () => {
    const obj = { a: { x: 1 }, b: { x: 2 }, c: { x: 3 } };
    const result = mapValues(obj, (value) => value.x * 10);

    expect(result).toEqual({ a: 10, b: 20, c: 30 });
  });

  it('should handle null and undefined values', () => {
    const obj = { a: null, b: undefined, c: 'value' };
    const result = mapValues(obj, (value) => value ?? 'default');

    expect(result).toEqual({ a: 'default', b: 'default', c: 'value' });
  });
});
