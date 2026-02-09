import { describe, expect, it } from '@jest/globals';

import { getKeys } from './get-keys.js';

describe('getKeys', () => {
  it('should return keys of an object', () => {
    const object = {
      array: [1, 2, 3],
      boolean: true,
      function: () => {
        return null;
      },
      null: null,
      number: 42,
      object: { nested: 'value' },
      string: 'string',
      symbol: Symbol('symbol value'),
    };
    const keys = getKeys(object);

    expect(keys).toContain('array');
    expect(keys).toContain('boolean');
    expect(keys).toContain('function');
    expect(keys).toContain('number');
    expect(keys).toContain('object');
    expect(keys).toContain('string');
    expect(keys).toContain('symbol');
    expect(keys).toContain('null');
    expect(keys.length).toBe(8);
  });

  it('should return empty array for empty object', () => {
    const object = {};
    const keys = getKeys(object);

    expect(keys).toEqual([]);
  });

  it('should return keys including symbol keys', () => {
    const symbol = Symbol('test');
    const object = { [symbol]: 'symbol value' };
    const keys = getKeys(object);

    expect(keys).toContain(symbol);
  });

  it('should return keys including numeric keys as strings', () => {
    const object = { [10101]: 'value' };
    const keys = getKeys(object);

    expect(keys).toEqual(['10101']);
  });

  it('should return keys including numeric keys as strings', () => {
    const object = { [10101]: 'value' };
    const keys = getKeys(object);

    expect(keys).toEqual(['10101']);
  });

  it('should return keys including undefined-valued properties', () => {
    const object = { undefined: undefined };
    const keys = getKeys(object);

    expect(keys).toEqual(['undefined']);
  });

  it('should not include inherited properties', () => {
    const parent = { inherited: 'value' };
    const child = Object.create(parent);
    child.own = 'own value';
    const keys = getKeys(child);

    expect(keys).toContain('own');
    expect(keys).not.toContain('inherited');
  });
});
