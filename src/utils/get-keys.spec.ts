import { describe, expect, it } from '@jest/globals';

import { getKeys } from './get-keys.js';

describe('getKeys', () => {
  it('should return keys of an object', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const keys = getKeys(obj);

    expect(keys).toContain('a');
    expect(keys).toContain('b');
    expect(keys).toContain('c');
  });

  it('should return empty array for empty object', () => {
    const obj = {};
    const keys = getKeys(obj);

    expect(keys).toEqual([]);
  });

  it('should return keys for object with single property', () => {
    const obj = { x: 'value' };
    const keys = getKeys(obj);

    expect(keys).toContain('x');
    expect(keys.length).toBeGreaterThanOrEqual(1);
  });

  it('should return keys for object with different value types', () => {
    const obj = {
      arr: [1, 2, 3],
      bool: true,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      fn: () => {},
      num: 42,
      obj: { nested: 'value' },
      str: 'string',
    };
    const keys = getKeys(obj);

    expect(keys).toContain('str');
    expect(keys).toContain('num');
    expect(keys).toContain('bool');
    expect(keys).toContain('arr');
    expect(keys).toContain('obj');
    expect(keys).toContain('fn');
  });

  it('should return keys including symbol keys', () => {
    const sym = Symbol('test');
    const obj = { a: 1, [sym]: 'symbol value' };
    const keys = getKeys(obj);

    expect(keys).toContain('a');
    expect(keys).toContain(sym);
  });

  it('should handle object with numeric keys', () => {
    const obj = { 1: 'one', 2: 'two', 3: 'three' };
    const keys = getKeys(obj);

    expect(keys).toContain('1');
    expect(keys).toContain('2');
    expect(keys).toContain('3');
  });

  it('should not include inherited properties', () => {
    const parent = { inherited: 'value' };
    const child = Object.create(parent);
    child.own = 'own value';
    const keys = getKeys(child);

    expect(keys).toContain('own');
    expect(keys).not.toContain('inherited');
  });

  it('should handle object with null prototype', () => {
    const obj = Object.create(null);
    obj.a = 1;
    obj.b = 2;
    const keys = getKeys(obj);

    expect(keys).toContain('a');
    expect(keys).toContain('b');
  });
});
