import { describe, expect, it } from '@jest/globals';
import type { Linter } from 'eslint';

import { disableAllRules } from './disable-all-rules.js';

describe('disableAllRules', () => {
  it('should return empty object for empty configs array', () => {
    const result = disableAllRules([]);

    expect(result).toEqual({});
  });

  it('should disable all rules from single config', () => {
    const config: Linter.Config = {
      rules: {
        'no-console': 'error',
        'no-debugger': 'warn',
        semi: ['error', 'always'],
      },
    };

    const result = disableAllRules([config]);

    expect(result).toEqual({
      'no-console': 'off',
      'no-debugger': 'off',
      semi: 'off',
    });
  });

  it('should disable all rules from multiple configs', () => {
    const config1: Linter.Config = {
      rules: {
        'no-console': 'error',
        semi: 'error',
      },
    };
    const config2: Linter.Config = {
      rules: {
        indent: ['error', 2],
        quotes: 'warn',
      },
    };

    const result = disableAllRules([config1, config2]);

    expect(result).toEqual({
      indent: 'off',
      'no-console': 'off',
      quotes: 'off',
      semi: 'off',
    });
  });

  it('should handle config with no rules property', () => {
    const config: Linter.Config = {
      files: ['**/*.ts'],
    };

    const result = disableAllRules([config]);

    expect(result).toEqual({});
  });

  it('should handle config with undefined rules', () => {
    const config: Linter.Config = {
      files: ['**/*.ts'],
      rules: undefined,
    };

    const result = disableAllRules([config]);

    expect(result).toEqual({});
  });

  it('should handle config with empty rules object', () => {
    const config: Linter.Config = {
      rules: {},
    };

    const result = disableAllRules([config]);

    expect(result).toEqual({});
  });

  it('should handle mix of configs with and without rules', () => {
    const config1: Linter.Config = {
      files: ['**/*.ts'],
    };
    const config2: Linter.Config = {
      rules: {
        'no-console': 'error',
      },
    };
    const config3: Linter.Config = {
      rules: undefined,
    };
    const config4: Linter.Config = {
      rules: {
        semi: 'warn',
      },
    };

    const result = disableAllRules([config1, config2, config3, config4]);

    expect(result).toEqual({
      'no-console': 'off',
      semi: 'off',
    });
  });

  it('should handle multiple configs with many overlapping rules', () => {
    const config1: Linter.Config = {
      rules: {
        'rule-1': 'error',
        'rule-2': 'warn',
        'rule-3': 'off',
      },
    };
    const config2: Linter.Config = {
      rules: {
        'rule-1': 'warn',
        'rule-2': 'error',
        'rule-4': 'error',
      },
    };
    const config3: Linter.Config = {
      rules: {
        'rule-1': 'off',
        'rule-5': 'warn',
      },
    };

    const result = disableAllRules([config1, config2, config3]);

    expect(result).toEqual({
      'rule-1': 'off',
      'rule-2': 'off',
      'rule-3': 'off',
      'rule-4': 'off',
      'rule-5': 'off',
    });
  });
});
