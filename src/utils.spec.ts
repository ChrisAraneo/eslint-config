import { describe, expect, it } from '@jest/globals';
import type { Linter } from 'eslint';

import { addCrossConfigOffRules } from './utils.js';

describe('utils', () => {
  describe('addCrossConfigOffRules', () => {
    it('should return empty array for empty configs', () => {
      const result = addCrossConfigOffRules({});
      expect(result).toEqual([]);
    });

    it('should return configs as-is when there is only one config type', () => {
      const configs: Record<string, Linter.Config[]> = {
        typescript: [
          {
            files: ['**/*.ts'],
            rules: {
              'no-console': 'error',
            },
          },
        ],
      };
      const result = addCrossConfigOffRules(configs);
      expect(result).toHaveLength(1);
      expect(result[0]?.files).toEqual(['**/*.ts']);
    });

    it('should add off rules for other config types', () => {
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
      const result = addCrossConfigOffRules(configs);
      expect(result).toHaveLength(2);

      // Find the config with test files
      const testConfig = result.find((c) => c.files?.includes('**/*.spec.ts'));
      expect(testConfig?.rules).toHaveProperty('test-rule', 'error');
      expect(testConfig?.rules).toHaveProperty('ts-rule', 'off');

      // Find the config with ts files
      const tsConfig = result.find((c) => c.files?.includes('**/*.ts'));
      expect(tsConfig?.rules).toHaveProperty('ts-rule', 'error');
      expect(tsConfig?.rules).toHaveProperty('test-rule', 'off');
    });

    it('should respect order option', () => {
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
      const result = addCrossConfigOffRules(configs, {
        order: ['tests', 'typescript'],
      });
      expect(result).toHaveLength(2);
      expect(result[0]?.files).toEqual(['**/*.spec.ts']);
      expect(result[1]?.files).toEqual(['**/*.ts']);
    });

    it('should handle configs without files', () => {
      const configs: Record<string, Linter.Config[]> = {
        typescript: [
          {
            rules: {
              'ts-rule': 'error',
            },
          },
        ],
      };
      const result = addCrossConfigOffRules(configs);
      expect(result).toHaveLength(1);
    });

    it('should handle configs without rules', () => {
      const configs: Record<string, Linter.Config[]> = {
        typescript: [
          {
            files: ['**/*.ts'],
          },
        ],
      };
      const result = addCrossConfigOffRules(configs);
      expect(result).toHaveLength(1);
    });

    it('should handle multiple configs with same files', () => {
      const configs: Record<string, Linter.Config[]> = {
        typescript: [
          {
            files: ['**/*.ts'],
            rules: {
              'ts-rule-1': 'error',
            },
          },
          {
            files: ['**/*.ts'],
            rules: {
              'ts-rule-2': 'error',
            },
          },
        ],
      };
      const result = addCrossConfigOffRules(configs);
      expect(result).toHaveLength(2);
    });

    it('should handle complex multi-config scenario', () => {
      const configs: Record<string, Linter.Config[]> = {
        json: [
          {
            files: ['**/*.json'],
            rules: {
              'json-rule': 'error',
            },
          },
        ],
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
              'ts-rule': 'error',
            },
          },
        ],
      };
      const result = addCrossConfigOffRules(configs);
      expect(result).toHaveLength(3);
    });
  });
});
