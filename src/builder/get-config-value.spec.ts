import { describe, expect, it } from '@jest/globals';
import type { Linter } from 'eslint';

import { JSONS, NX, SOURCES, TEMPLATES, TESTS } from '../interfaces.js';
import { getConfigValue } from './get-config-value.js';

describe('getConfigValue', () => {
  it('should return config array for existing key', () => {
    const config: Linter.Config = { files: ['**/*.ts'], rules: {} };
    const configBlock = {
      [SOURCES]: [config],
    };

    const result = getConfigValue({ configBlock, key: SOURCES });

    expect(result).toEqual([config]);
  });

  it('should return empty array for non-existing key', () => {
    const configBlock = {
      [SOURCES]: [{ files: ['**/*.ts'] }],
    };

    const result = getConfigValue({ configBlock, key: TESTS });

    expect(result).toEqual([]);
  });

  it('should return empty array for undefined config value', () => {
    const configBlock = {
      [SOURCES]: undefined,
    };

    const result = getConfigValue({ configBlock, key: SOURCES });

    expect(result).toEqual([]);
  });

  it('should handle multiple configs in array', () => {
    const config1: Linter.Config = { files: ['**/*.ts'] };
    const config2: Linter.Config = { files: ['**/*.tsx'] };
    const configBlock = {
      [SOURCES]: [config1, config2],
    };

    const result = getConfigValue({ configBlock, key: SOURCES });

    expect(result).toEqual([config1, config2]);
    expect(result).toHaveLength(2);
  });

  it('should handle all config keys', () => {
    const sourceConfig: Linter.Config = { files: ['**/*.ts'] };
    const testConfig: Linter.Config = { files: ['**/*.spec.ts'] };
    const templateConfig: Linter.Config = { files: ['**/*.html'] };
    const jsonConfig: Linter.Config = { files: ['**/*.json'] };
    const nxConfig: Linter.Config = { files: ['**/project.json'] };

    const configBlock = {
      [JSONS]: [jsonConfig],
      [NX]: [nxConfig],
      [SOURCES]: [sourceConfig],
      [TEMPLATES]: [templateConfig],
      [TESTS]: [testConfig],
    };

    expect(getConfigValue({ configBlock, key: SOURCES })).toEqual([
      sourceConfig,
    ]);
    expect(getConfigValue({ configBlock, key: TESTS })).toEqual([testConfig]);
    expect(getConfigValue({ configBlock, key: TEMPLATES })).toEqual([
      templateConfig,
    ]);
    expect(getConfigValue({ configBlock, key: JSONS })).toEqual([jsonConfig]);
    expect(getConfigValue({ configBlock, key: NX })).toEqual([nxConfig]);
  });

  it('should handle empty config array', () => {
    const configBlock = {
      [SOURCES]: [],
    };

    const result = getConfigValue({ configBlock, key: SOURCES });

    expect(result).toEqual([]);
  });

  it('should handle empty configBlock', () => {
    const configBlock = {};

    const result = getConfigValue({ configBlock, key: SOURCES });

    expect(result).toEqual([]);
  });

  it('should return same reference on multiple calls', () => {
    const originalConfig: Linter.Config = {
      files: ['**/*.ts'],
      rules: { 'no-console': 'error' },
    };
    const configBlock = {
      [SOURCES]: [originalConfig],
    };

    const result1 = getConfigValue({ configBlock, key: SOURCES });
    const result2 = getConfigValue({ configBlock, key: SOURCES });

    expect(result1).toBe(result2);
  });

  it('should return empty array for a non-ConfigKey symbol', () => {
    const unrelated = Symbol('unrelated');
    const configBlock = {
      [SOURCES]: [{ files: ['**/*.ts'] }],
    };

    const result = getConfigValue({ configBlock, key: unrelated });

    expect(result).toEqual([]);
  });

  it('should handle config with complex rule values', () => {
    const complexConfig: Linter.Config = {
      files: ['**/*.ts'],
      rules: {
        '@typescript-eslint/naming-convention': [
          'error',
          {
            format: ['camelCase', 'PascalCase'],
            selector: 'default',
          },
        ],
        'no-console': 'off',
      },
    };
    const configBlock = {
      [SOURCES]: [complexConfig],
    };

    const result = getConfigValue({ configBlock, key: SOURCES });

    expect(result[0]!.rules).toEqual(complexConfig.rules);
  });
});
