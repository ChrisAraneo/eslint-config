import { describe, expect, it } from '@jest/globals';

import { chain } from './chain.js';

describe('chain', () => {
  it('should create a chain wrapper from array', () => {
    const result = chain([1, 2, 3]).value();

    expect(result).toEqual([1, 2, 3]);
  });

  it('should create a chain wrapper from object', () => {
    const obj = { a: 1, b: 2 };
    const result = chain(obj).value();

    expect(result).toEqual(obj);
  });

  it('should create a chain wrapper from empty array', () => {
    const result = chain([]).value();

    expect(result).toEqual([]);
  });

  it('should create a chain wrapper from empty object', () => {
    const result = chain({}).value();

    expect(result).toEqual({});
  });

  it('should allow chaining operations', () => {
    const result = chain([1, 2, 3])
      .map((x) => x * 2)
      .filter((x) => (x as number) > 2)
      .value();

    expect(result).toEqual([4, 6]);
  });

  it('should work with complex chaining', () => {
    const result = chain([1, 2, 3, 4, 5])
      .filter((x) => (x as number) % 2 === 0)
      .map((x) => x * 10)
      .value();

    expect(result).toEqual([20, 40]);
  });

  it('should work with groupBy and values', () => {
    const data = [
      { type: 'a', value: 1 },
      { type: 'b', value: 2 },
      { type: 'a', value: 3 },
    ];
    const result = chain(data).groupBy('type').values().value();

    expect(result).toHaveLength(2);
  });

  it('should work with flatMap', () => {
    const result = chain([1, 2, 3])
      .flatMap((x) => [x, x * 2])
      .value();

    expect(result).toEqual([1, 2, 2, 4, 3, 6]);
  });

  it('should work with uniq', () => {
    const result = chain([1, 2, 2, 3, 3, 3]).uniq().value();

    expect(result).toEqual([1, 2, 3]);
  });

  it('should work with concat', () => {
    const result = chain([1, 2, 3]).concat([4, 5, 6]).value();

    expect(result).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('should work with keyBy', () => {
    const result = chain(['a', 'b', 'c']).keyBy().value();

    expect(result).toEqual({ a: 'a', b: 'b', c: 'c' });
  });

  it('should work with mapValues', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = chain(obj)
      .mapValues((v) => (v as number) * 2)
      .value();

    expect(result).toEqual({ a: 2, b: 4, c: 6 });
  });
});
