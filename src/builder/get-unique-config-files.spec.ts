/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from '@jest/globals';

import {
  ConfigBlock,
  JSONS,
  SOURCES,
  TEMPLATES,
  TESTS,
} from '../interfaces.js';
import { getUniqueConfigFiles } from './get-unique-config-files.js';

describe('getUniqueConfigFiles', () => {
  it('should return files from a single config key', () => {
    const configBlock = {
      [SOURCES]: [{ files: ['src/**/*.ts'] }],
    };

    const result = getUniqueConfigFiles(configBlock, [SOURCES]);

    expect(result).toEqual(['src/**/*.ts']);
  });

  it('should return files from multiple config keys', () => {
    const configBlock = {
      [SOURCES]: [{ files: ['src/**/*.ts'] }],
      [TEMPLATES]: [{ files: ['src/**/*.html'] }],
    };

    const result = getUniqueConfigFiles(configBlock, [SOURCES, TEMPLATES]);

    expect(result).toEqual(['src/**/*.ts', 'src/**/*.html']);
  });

  it('should deduplicate files across config keys', () => {
    const configBlock = {
      [SOURCES]: [{ files: ['src/**/*.ts'] }],
      [TESTS]: [{ files: ['src/**/*.ts', 'src/**/*.spec.ts'] }],
    };

    const result = getUniqueConfigFiles(configBlock, [SOURCES, TESTS]);

    expect(result).toEqual(['src/**/*.ts', 'src/**/*.spec.ts']);
  });

  it('should deduplicate files within a single config key', () => {
    const configBlock = {
      [SOURCES]: [
        { files: ['src/**/*.ts'] },
        { files: ['src/**/*.ts', 'lib/**/*.ts'] },
      ],
    };

    const result = getUniqueConfigFiles(configBlock, [SOURCES]);

    expect(result).toEqual(['src/**/*.ts', 'lib/**/*.ts']);
  });

  it('should skip non-ConfigKey symbols', () => {
    const unrelated = Symbol('unrelated');
    const configBlock = {
      [SOURCES]: [{ files: ['src/**/*.ts'] }],
    };

    const result = getUniqueConfigFiles(configBlock, [unrelated]);

    expect(result).toEqual([]);
  });

  it('should return empty array when keys is empty', () => {
    const configBlock = {
      [SOURCES]: [{ files: ['src/**/*.ts'] }],
    };

    const result = getUniqueConfigFiles(configBlock, []);

    expect(result).toEqual([]);
  });

  it('should return empty array when keys is null', () => {
    const configBlock = {
      [SOURCES]: [{ files: ['src/**/*.ts'] }],
    };

    const result = getUniqueConfigFiles(configBlock, null as any);

    expect(result).toEqual([]);
  });

  it('should return empty array when the config key is absent from the configBlock', () => {
    const result = getUniqueConfigFiles({}, [SOURCES, JSONS]);

    expect(result).toEqual([]);
  });

  it('should skip configs that have no files property', () => {
    const configBlock = {
      [SOURCES]: [
        { rules: { 'no-console': 'error' } },
        { files: ['src/**/*.ts'] },
      ],
    } as ConfigBlock;

    const result = getUniqueConfigFiles(configBlock, [SOURCES]);

    expect(result).toEqual(['src/**/*.ts']);
  });
});
