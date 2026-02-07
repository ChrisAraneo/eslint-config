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

    const result = getConfigValue(configBlock, SOURCES);

    expect(result).toEqual([config]);
  });

  it('should return empty array for non-existing key', () => {
    const configBlock = {
      [SOURCES]: [{ files: ['**/*.ts'] }],
    };

    const result = getConfigValue(configBlock, TESTS);

    expect(result).toEqual([]);
  });

  it('should return empty array for undefined config value', () => {
    const configBlock = {
      [SOURCES]: undefined,
    };

    const result = getConfigValue(configBlock, SOURCES);

    expect(result).toEqual([]);
  });

  it('should return deep clone of config array', () => {
    const originalConfig: Linter.Config = {
      files: ['**/*.ts'],
      rules: { 'no-console': 'error' },
    };
    const configBlock = {
      [SOURCES]: [originalConfig],
    };

    const result = getConfigValue(configBlock, SOURCES);

    if (result[0]!.rules) {
      result[0]!.rules['new-rule'] = 'warn';
    }

    expect(originalConfig.rules).toEqual({ 'no-console': 'error' });
    expect(originalConfig.rules).not.toHaveProperty('new-rule');
  });

  it('should return deep clone with nested objects', () => {
    const nestedConfig: Linter.Config = {
      files: ['**/*.ts'],
      languageOptions: {
        parserOptions: {
          project: ['./tsconfig.json'],
        },
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'error',
      },
    };
    const configBlock = {
      [SOURCES]: [nestedConfig],
    };

    const result = getConfigValue(configBlock, SOURCES);

    if (result[0]!.languageOptions?.parserOptions) {
      (
        result[0]!.languageOptions.parserOptions as { project: string[] }
      ).project.push('./tsconfig.spec.json');
    }

    expect(
      (nestedConfig.languageOptions?.parserOptions as { project: string[] })
        ?.project,
    ).toEqual(['./tsconfig.json']);
  });

  it('should handle multiple configs in array', () => {
    const config1: Linter.Config = { files: ['**/*.ts'] };
    const config2: Linter.Config = { files: ['**/*.tsx'] };
    const configBlock = {
      [SOURCES]: [config1, config2],
    };

    const result = getConfigValue(configBlock, SOURCES);

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

    expect(getConfigValue(configBlock, SOURCES)).toEqual([sourceConfig]);
    expect(getConfigValue(configBlock, TESTS)).toEqual([testConfig]);
    expect(getConfigValue(configBlock, TEMPLATES)).toEqual([templateConfig]);
    expect(getConfigValue(configBlock, JSONS)).toEqual([jsonConfig]);
    expect(getConfigValue(configBlock, NX)).toEqual([nxConfig]);
  });

  it('should handle empty config array', () => {
    const configBlock = {
      [SOURCES]: [],
    };

    const result = getConfigValue(configBlock, SOURCES);

    expect(result).toEqual([]);
  });

  it('should handle empty configBlock', () => {
    const configBlock = {};

    const result = getConfigValue(configBlock, SOURCES);

    expect(result).toEqual([]);
  });

  it('should return independent copies on multiple calls', () => {
    const originalConfig: Linter.Config = {
      files: ['**/*.ts'],
      rules: { 'no-console': 'error' },
    };
    const configBlock = {
      [SOURCES]: [originalConfig],
    };

    const result1 = getConfigValue(configBlock, SOURCES);
    const result2 = getConfigValue(configBlock, SOURCES);

    if (result1[0]!.rules) {
      result1[0]!.rules['rule-1'] = 'warn';
    }

    expect(result2[0]!.rules).not.toHaveProperty('rule-1');
    expect(result2[0]!.rules).toEqual({ 'no-console': 'error' });
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

    const result = getConfigValue(configBlock, SOURCES);

    expect(result[0]!.rules).toEqual(complexConfig.rules);
  });
});
