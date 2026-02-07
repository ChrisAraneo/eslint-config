import { describe, expect, it } from '@jest/globals';

import { ChainWrapper } from './chain-wrapper.js';

describe('ChainWrapper', () => {
  describe('constructor', () => {
    it('should create a wrapper with a value', () => {
      const wrapper = new ChainWrapper([1, 2, 3]);
      expect(wrapper.value()).toEqual([1, 2, 3]);
    });

    it('should create a wrapper with empty array', () => {
      const wrapper = new ChainWrapper([]);
      expect(wrapper.value()).toEqual([]);
    });

    it('should create a wrapper with object', () => {
      const obj = { a: 1, b: 2 };
      const wrapper = new ChainWrapper(obj);
      expect(wrapper.value()).toEqual(obj);
    });
  });

  describe('map', () => {
    it('should map over array elements', () => {
      const wrapper = new ChainWrapper([1, 2, 3]);
      const result = wrapper.map((x) => x * 2).value();
      expect(result).toEqual([2, 4, 6]);
    });

    it('should map to different type', () => {
      const wrapper = new ChainWrapper([1, 2, 3]);
      const result = wrapper.map((x) => String(x)).value();
      expect(result).toEqual(['1', '2', '3']);
    });

    it('should handle empty array', () => {
      const wrapper = new ChainWrapper([]);
      const result = wrapper.map((x) => x).value();
      expect(result).toEqual([]);
    });

    it('should map complex objects', () => {
      const wrapper = new ChainWrapper([{ x: 1 }, { x: 2 }, { x: 3 }]);
      const result = wrapper.map((item) => item.x * 10).value();
      expect(result).toEqual([10, 20, 30]);
    });
  });

  describe('flatMap', () => {
    it('should flatMap array elements', () => {
      const wrapper = new ChainWrapper([1, 2, 3]);
      const result = wrapper.flatMap((x) => [x, x * 2]).value();
      expect(result).toEqual([1, 2, 2, 4, 3, 6]);
    });

    it('should flatten nested arrays', () => {
      const wrapper = new ChainWrapper([1, 2, 3]);
      const result = wrapper.flatMap((x) => [x, x + 10]).value();
      expect(result).toEqual([1, 11, 2, 12, 3, 13]);
    });

    it('should handle empty array', () => {
      const wrapper = new ChainWrapper([]);
      const result = wrapper.flatMap((x) => [x]).value();
      expect(result).toEqual([]);
    });

    it('should handle returning empty arrays', () => {
      const wrapper = new ChainWrapper([1, 2, 3]);
      const result = wrapper.flatMap((x) => (x % 2 === 0 ? [x] : [])).value();
      expect(result).toEqual([2]);
    });
  });

  describe('filter', () => {
    it('should filter array elements', () => {
      const wrapper = new ChainWrapper([1, 2, 3, 4, 5]);
      const result = wrapper.filter((x) => (x as number) > 2).value();
      expect(result).toEqual([3, 4, 5]);
    });

    it('should filter with type guard', () => {
      const wrapper = new ChainWrapper([1, 2, 3, 4, 5]);
      const result = wrapper
        .filter((x): x is number => (x as number) % 2 === 0)
        .value();
      expect(result).toEqual([2, 4]);
    });

    it('should handle empty array', () => {
      const wrapper = new ChainWrapper([]);
      const result = wrapper.filter(() => true).value();
      expect(result).toEqual([]);
    });

    it('should filter all elements', () => {
      const wrapper = new ChainWrapper([1, 2, 3]);
      const result = wrapper.filter(() => false).value();
      expect(result).toEqual([]);
    });
  });

  describe('uniq', () => {
    it('should remove duplicates from array', () => {
      const wrapper = new ChainWrapper([1, 2, 2, 3, 3, 3]);
      const result = wrapper.uniq().value();
      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle array with no duplicates', () => {
      const wrapper = new ChainWrapper([1, 2, 3]);
      const result = wrapper.uniq().value();
      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle empty array', () => {
      const wrapper = new ChainWrapper([]);
      const result = wrapper.uniq().value();
      expect(result).toEqual([]);
    });

    it('should handle string duplicates', () => {
      const wrapper = new ChainWrapper(['a', 'b', 'b', 'c', 'a']);
      const result = wrapper.uniq().value();
      expect(result).toEqual(['a', 'b', 'c']);
    });
  });

  describe('flatten', () => {
    it('should flatten nested arrays', () => {
      const wrapper = new ChainWrapper([
        [1, 2],
        [3, 4],
        [5, 6],
      ]);
      const result = wrapper.flatten().value();
      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should handle empty nested arrays', () => {
      const wrapper = new ChainWrapper([[], [], []]);
      const result = wrapper.flatten().value();
      expect(result).toEqual([]);
    });

    it('should handle single level array', () => {
      const wrapper = new ChainWrapper([[1], [2], [3]]);
      const result = wrapper.flatten().value();
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('concat', () => {
    it('should concatenate arrays', () => {
      const wrapper = new ChainWrapper([1, 2, 3]);
      const result = wrapper.concat([4, 5, 6]).value();
      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should concatenate with empty array', () => {
      const wrapper = new ChainWrapper([1, 2, 3]);
      const result = wrapper.concat([]).value();
      expect(result).toEqual([1, 2, 3]);
    });

    it('should concatenate empty array with values', () => {
      const wrapper = new ChainWrapper([]);
      const result = wrapper.concat([1, 2, 3]).value();
      expect(result).toEqual([1, 2, 3]);
    });

    it('should concatenate different types', () => {
      const wrapper = new ChainWrapper([1, 2, 3]);
      const result = wrapper.concat(['a', 'b', 'c']).value();
      expect(result).toEqual([1, 2, 3, 'a', 'b', 'c']);
    });
  });

  describe('groupBy', () => {
    it('should group by key', () => {
      const data = [
        { type: 'a', value: 1 },
        { type: 'b', value: 2 },
        { type: 'a', value: 3 },
      ];
      const wrapper = new ChainWrapper(data);
      const result = wrapper.groupBy('type').value();
      expect(result).toEqual({
        a: [
          { type: 'a', value: 1 },
          { type: 'a', value: 3 },
        ],
        b: [{ type: 'b', value: 2 }],
      });
    });

    it('should handle single group', () => {
      const data = [
        { type: 'a', value: 1 },
        { type: 'a', value: 2 },
      ];
      const wrapper = new ChainWrapper(data);
      const result = wrapper.groupBy('type').value();
      expect(result).toEqual({
        a: [
          { type: 'a', value: 1 },
          { type: 'a', value: 2 },
        ],
      });
    });

    it('should handle empty array', () => {
      const wrapper = new ChainWrapper([]);
      const result = wrapper.groupBy('type').value();
      expect(result).toEqual({});
    });

    it('should group by numeric values', () => {
      const data = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
        { id: 1, name: 'c' },
      ];
      const wrapper = new ChainWrapper(data);
      const result = wrapper.groupBy('id').value();
      expect(result).toEqual({
        '1': [
          { id: 1, name: 'a' },
          { id: 1, name: 'c' },
        ],
        '2': [{ id: 2, name: 'b' }],
      });
    });
  });

  describe('values', () => {
    it('should extract values from object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const wrapper = new ChainWrapper(obj);
      const result = wrapper.values().value();
      expect(result).toEqual([1, 2, 3]);
    });

    it('should handle empty object', () => {
      const wrapper = new ChainWrapper({});
      const result = wrapper.values().value();
      expect(result).toEqual([]);
    });

    it('should extract complex values', () => {
      const obj = { a: { x: 1 }, b: { x: 2 }, c: { x: 3 } };
      const wrapper = new ChainWrapper(obj);
      const result = wrapper.values().value();
      expect(result).toEqual([{ x: 1 }, { x: 2 }, { x: 3 }]);
    });
  });

  describe('keyBy', () => {
    it('should create object keyed by values', () => {
      const wrapper = new ChainWrapper(['a', 'b', 'c']);
      const result = wrapper.keyBy().value();
      expect(result).toEqual({ a: 'a', b: 'b', c: 'c' });
    });

    it('should handle numeric values', () => {
      const wrapper = new ChainWrapper([1, 2, 3]);
      const result = wrapper.keyBy().value();
      expect(result).toEqual({ '1': 1, '2': 2, '3': 3 });
    });

    it('should handle empty array', () => {
      const wrapper = new ChainWrapper([]);
      const result = wrapper.keyBy().value();
      expect(result).toEqual({});
    });

    it('should handle duplicate values (last wins)', () => {
      const wrapper = new ChainWrapper(['a', 'b', 'a']);
      const result = wrapper.keyBy().value();
      expect(result).toEqual({ a: 'a', b: 'b' });
    });
  });

  describe('mapValues', () => {
    it('should map values of object', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const wrapper = new ChainWrapper(obj);
      const result = wrapper.mapValues((v) => (v as number) * 2).value();
      expect(result).toEqual({ a: 2, b: 4, c: 6 });
    });

    it('should handle empty object', () => {
      const wrapper = new ChainWrapper({});
      const result = wrapper.mapValues((v) => v).value();
      expect(result).toEqual({});
    });

    it('should transform to different type', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const wrapper = new ChainWrapper(obj);
      const result = wrapper.mapValues((v) => String(v)).value();
      expect(result).toEqual({ a: '1', b: '2', c: '3' });
    });
  });

  describe('chaining multiple operations', () => {
    it('should chain map and filter', () => {
      const wrapper = new ChainWrapper([1, 2, 3, 4, 5]);
      const result = wrapper
        .map((x) => x * 2)
        .filter((x) => (x as number) > 5)
        .value();
      expect(result).toEqual([6, 8, 10]);
    });

    it('should chain map, filter, and uniq', () => {
      const wrapper = new ChainWrapper([1, 2, 2, 3, 3, 3]);
      const result = wrapper
        .uniq()
        .map((x) => x * 2)
        .filter((x) => (x as number) > 2)
        .value();
      expect(result).toEqual([4, 6]);
    });

    it('should chain flatMap and uniq', () => {
      const wrapper = new ChainWrapper([1, 2, 3]);
      const result = wrapper
        .flatMap((x) => [x, x])
        .uniq()
        .value();
      expect(result).toEqual([1, 2, 3]);
    });

    it('should chain groupBy and values', () => {
      const data = [
        { type: 'a', value: 1 },
        { type: 'b', value: 2 },
        { type: 'a', value: 3 },
      ];
      const wrapper = new ChainWrapper(data);
      const result = wrapper.groupBy('type').values().value();
      expect(result).toHaveLength(2);
    });
  });
});
