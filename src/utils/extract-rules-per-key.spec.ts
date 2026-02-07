import { describe, expect, it } from '@jest/globals';
import type { Linter } from 'eslint';

import { extractRulesPerKey } from './extract-rules-per-key.js';

describe('extractRulesPerKey', () => {
  it('should extract rules from single config type', () => {
    const configs: Record<string, Linter.Config[]> = {
      typescript: [
        {
          files: ['**/*.ts'],
          rules: {
            'no-console': 'error',
            'no-debugger': 'warn',
          },
        },
      ],
    };

    const result = extractRulesPerKey(configs);

    expect(result).toEqual({
      typescript: ['no-console', 'no-debugger'],
    });
  });

  it('should extract and deduplicate rules from multiple configs', () => {
    const configs: Record<string, Linter.Config[]> = {
      typescript: [
        {
          files: ['**/*.ts'],
          rules: {
            'no-console': 'error',
            'no-debugger': 'warn',
          },
        },
        {
          files: ['src/**/*.ts'],
          rules: {
            'no-console': 'off',
            'prefer-const': 'error',
          },
        },
      ],
    };

    const result = extractRulesPerKey(configs);

    expect(result.typescript).toHaveLength(3);
    expect(result.typescript).toContain('no-console');
    expect(result.typescript).toContain('no-debugger');
    expect(result.typescript).toContain('prefer-const');
  });

  it('should handle multiple config types', () => {
    const configs: Record<string, Linter.Config[]> = {
      tests: [
        {
          files: ['**/*.spec.ts'],
          rules: {
            'test-rule': 'error',
          },
        },
      ],
      typescript: [
        {
          files: ['**/*.ts'],
          rules: {
            'ts-rule': 'error',
          },
        },
      ],
    };

    const result = extractRulesPerKey(configs);

    expect(result).toEqual({
      tests: ['test-rule'],
      typescript: ['ts-rule'],
    });
  });

  it('should handle configs without rules', () => {
    const configs: Record<string, Linter.Config[]> = {
      typescript: [
        {
          files: ['**/*.ts'],
        },
      ],
    };

    const result = extractRulesPerKey(configs);

    expect(result).toEqual({
      typescript: [],
    });
  });

  it('should handle empty config arrays', () => {
    const configs: Record<string, Linter.Config[]> = {
      typescript: [],
    };

    const result = extractRulesPerKey(configs);

    expect(result).toEqual({
      typescript: [],
    });
  });

  it('should handle empty configs object', () => {
    const configs: Record<string, Linter.Config[]> = {};

    const result = extractRulesPerKey(configs);

    expect(result).toEqual({});
  });

  it('should handle configs with undefined rules', () => {
    const configs: Record<string, Linter.Config[]> = {
      typescript: [
        {
          files: ['**/*.ts'],
          rules: undefined,
        },
      ],
    };

    const result = extractRulesPerKey(configs);

    expect(result).toEqual({
      typescript: [],
    });
  });

  it('should extract rules from complex multi-config scenario', () => {
    const configs: Record<string, Linter.Config[]> = {
      tests: [
        {
          files: ['**/*.spec.ts'],
          rules: {
            'test-rule': 'error',
          },
        },
      ],
      typescript: [
        {
          files: ['src/**/*.ts'],
          rules: {
            'ts-rule-1': 'error',
            'ts-rule-2': 'warn',
          },
        },
      ],
    };

    const result = extractRulesPerKey(configs);

    expect(result.typescript).toEqual(['ts-rule-1', 'ts-rule-2']);
    expect(result.tests).toEqual(['test-rule']);
  });
});
