import { describe, expect, it } from '@jest/globals';

import {
  IGNORED,
  JSONS,
  NX,
  SOURCES,
  TEMPLATES,
  TESTS,
} from '../interfaces.js';
import { isConfigKey } from './is-config-key.js';

describe('isConfigKey', () => {
  it.each([
    [SOURCES, SOURCES],
    [TESTS, TESTS],
    [TEMPLATES, TEMPLATES],
    [JSONS, JSONS],
    [NX, NX],
    [IGNORED, IGNORED],
  ])('should return true for %s', (_, value) => {
    expect(isConfigKey(value)).toBe(true);
  });

  it.each([
    ['an unrelated symbol', Symbol('other')],
    ['a string', 'sources'],
    ['a number', 42],
    ['null', null],
    ['undefined', undefined],
    ['an object', {}],
    ['an array', []],
    ['a boolean', true],
  ])('should return false for %s', (_, value) => {
    expect(isConfigKey(value)).toBe(false);
  });
});
