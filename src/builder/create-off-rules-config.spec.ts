import { describe, expect, it } from '@jest/globals';
import type { Linter } from 'eslint';

import { createOffRulesConfig } from './create-off-rules-config.js';

describe('createOffRulesConfig', () => {
  describe('null cases', () => {
    it('should return null when files is empty array', () => {
      const configsToDisable: Linter.Config[] = [
        {
          files: ['**/*.ts'],
          rules: { 'no-console': 'error' },
        },
      ];

      const result = createOffRulesConfig([], configsToDisable);

      expect(result).toBeNull();
    });

    it('should return null when files is undefined', () => {
      const configsToDisable: Linter.Config[] = [
        {
          files: ['**/*.ts'],
          rules: { 'no-console': 'error' },
        },
      ];

      const result = createOffRulesConfig(undefined, configsToDisable);

      expect(result).toBeNull();
    });

    it('should return null when configsToDisable is empty array', () => {
      const files = ['**/*.ts'];

      const result = createOffRulesConfig(files, []);

      expect(result).toBeNull();
    });

    it('should return null when both files and configsToDisable are empty', () => {
      const result = createOffRulesConfig([], []);

      expect(result).toBeNull();
    });

    it('should return null when both files and configsToDisable are undefined/empty', () => {
      const result = createOffRulesConfig(undefined, []);

      expect(result).toBeNull();
    });
  });

  describe('valid config creation', () => {
    it('should create config with correct structure', () => {
      const files = ['**/*.ts'];
      const configsToDisable: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          rules: { 'no-console': 'error' },
        },
      ];

      const result = createOffRulesConfig(files, configsToDisable);

      expect(result).not.toBeNull();
      expect(result).toHaveProperty('files');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('rules');
    });

    it('should set name to "off-rules"', () => {
      const files = ['**/*.ts'];
      const configsToDisable: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          rules: { 'no-console': 'error' },
        },
      ];

      const result = createOffRulesConfig(files, configsToDisable);

      expect(result?.name).toBe('off-rules');
    });

    it('should use findFirstFiles for files property', () => {
      const files = ['**/*.ts'];
      const configsToDisable: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          rules: { 'no-console': 'error' },
        },
        {
          files: ['lib/**/*.ts'],
          rules: { 'no-debugger': 'warn' },
        },
      ];

      const result = createOffRulesConfig(files, configsToDisable);

      // findFirstFiles returns the first config's files
      expect(result?.files).toEqual(['src/**/*.ts']);
    });

    it('should disable all rules from configsToDisable', () => {
      const files = ['**/*.ts'];
      const configsToDisable: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          rules: {
            'no-console': 'error',
            semi: 'warn',
          },
        },
      ];

      const result = createOffRulesConfig(files, configsToDisable);

      expect(result?.rules).toEqual({
        'no-console': 'off',
        semi: 'off',
      });
    });

    it('should disable rules from multiple configs', () => {
      const files = ['**/*.ts'];
      const configsToDisable: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          rules: {
            'no-console': 'error',
          },
        },
        {
          files: ['test/**/*.ts'],
          rules: {
            'no-debugger': 'warn',
            semi: 'error',
          },
        },
      ];

      const result = createOffRulesConfig(files, configsToDisable);

      expect(result?.rules).toEqual({
        'no-console': 'off',
        'no-debugger': 'off',
        semi: 'off',
      });
    });

    it('should handle configs without files property', () => {
      const files = ['**/*.ts'];
      const configsToDisable: Linter.Config[] = [
        {
          rules: { 'no-console': 'error' },
        },
        {
          files: ['src/**/*.ts'],
          rules: { semi: 'warn' },
        },
      ];

      const result = createOffRulesConfig(files, configsToDisable);

      expect(result?.files).toEqual(['src/**/*.ts']);
      expect(result?.rules).toEqual({
        'no-console': 'off',
        semi: 'off',
      });
    });

    it('should handle configs with empty files arrays', () => {
      const files = ['**/*.ts'];
      const configsToDisable: Linter.Config[] = [
        {
          files: [],
          rules: { 'no-console': 'error' },
        },
        {
          files: ['src/**/*.ts'],
          rules: { semi: 'warn' },
        },
      ];

      const result = createOffRulesConfig(files, configsToDisable);

      // Should find first non-empty files
      expect(result?.files).toEqual(['src/**/*.ts']);
      expect(result?.rules).toEqual({
        'no-console': 'off',
        semi: 'off',
      });
    });

    it('should handle TypeScript ESLint rules', () => {
      const files = ['**/*.ts'];
      const configsToDisable: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          rules: {
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/no-explicit-any': 'warn',
          },
        },
      ];

      const result = createOffRulesConfig(files, configsToDisable);

      expect(result?.rules).toEqual({
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      });
    });

    it('should handle complex rule configurations', () => {
      const files = ['**/*.ts'];
      const configsToDisable: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          rules: {
            '@typescript-eslint/naming-convention': [
              'error',
              {
                format: ['camelCase'],
                selector: 'default',
              },
            ],
            quotes: ['error', 'single'],
          },
        },
      ];

      const result = createOffRulesConfig(files, configsToDisable);

      expect(result?.rules).toEqual({
        '@typescript-eslint/naming-convention': 'off',
        quotes: 'off',
      });
    });

    it('should work with string files parameter', () => {
      const files = '**/*.ts' as unknown as string[];
      const configsToDisable: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          rules: { 'no-console': 'error' },
        },
      ];

      const result = createOffRulesConfig(files, configsToDisable);

      expect(result).not.toBeNull();
      expect(result?.name).toBe('off-rules');
    });

    it('should work with array of string patterns', () => {
      const files = ['**/*.ts', '**/*.tsx'];
      const configsToDisable: Linter.Config[] = [
        {
          files: ['src/**/*.ts', 'src/**/*.tsx'],
          rules: { 'no-console': 'error' },
        },
      ];

      const result = createOffRulesConfig(files, configsToDisable);

      expect(result).not.toBeNull();
      expect(result?.files).toEqual(['src/**/*.ts', 'src/**/*.tsx']);
    });

    it('should handle configs with no rules', () => {
      const files = ['**/*.ts'];
      const configsToDisable: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
        },
        {
          files: ['test/**/*.ts'],
          rules: { 'no-console': 'error' },
        },
      ];

      const result = createOffRulesConfig(files, configsToDisable);

      expect(result?.rules).toEqual({
        'no-console': 'off',
      });
    });

    it('should handle large number of rules', () => {
      const files = ['**/*.ts'];
      const rules: Record<string, string> = {};
      for (let i = 0; i < 50; i++) {
        rules[`rule-${i}`] = 'error';
      }
      const configsToDisable: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          rules,
        } as Linter.Config,
      ];

      const result = createOffRulesConfig(files, configsToDisable);

      expect(Object.keys(result?.rules ?? {})).toHaveLength(50);
      Object.values(result?.rules ?? {}).forEach((value) => {
        expect(value).toBe('off');
      });
    });
  });

  describe('edge cases with findFirstFiles', () => {
    it('should return undefined files when no config has files', () => {
      const files = ['**/*.ts'];
      const configsToDisable: Linter.Config[] = [
        {
          rules: { 'no-console': 'error' },
        },
        {
          rules: { semi: 'warn' },
        },
      ];

      const result = createOffRulesConfig(files, configsToDisable);

      expect(result?.files).toBeUndefined();
      expect(result?.rules).toEqual({
        'no-console': 'off',
        semi: 'off',
      });
    });

    it('should skip configs with only empty files arrays', () => {
      const files = ['**/*.ts'];
      const configsToDisable: Linter.Config[] = [
        {
          files: [],
          rules: { 'no-console': 'error' },
        },
        {
          files: [],
          rules: { semi: 'warn' },
        },
      ];

      const result = createOffRulesConfig(files, configsToDisable);

      expect(result?.files).toBeUndefined();
    });
  });
});
