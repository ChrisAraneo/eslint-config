import { describe, expect, it } from '@jest/globals';
import type { Linter } from 'eslint';

import { findFirstFiles } from './find-first-files.js';

describe('findFirstFiles', () => {
  describe('basic functionality', () => {
    it('should return files from the first config with files property', () => {
      const configs: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          rules: { 'no-console': 'error' },
        },
        {
          files: ['lib/**/*.ts'],
          rules: { 'no-unused-vars': 'error' },
        },
      ];

      const result = findFirstFiles(configs);
      expect(result).toEqual(['src/**/*.ts']);
    });

    it('should return undefined when no configs have files', () => {
      const configs: Linter.Config[] = [
        {
          rules: { 'no-console': 'error' },
        },
        {
          rules: { 'no-unused-vars': 'error' },
        },
      ];

      const result = findFirstFiles(configs);
      expect(result).toBeUndefined();
    });

    it('should return undefined for empty array', () => {
      const configs: Linter.Config[] = [];
      const result = findFirstFiles(configs);
      expect(result).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('should skip configs with empty files array', () => {
      const configs: Linter.Config[] = [
        {
          files: [],
          rules: { 'no-console': 'error' },
        },
        {
          files: ['src/**/*.ts'],
          rules: { 'no-unused-vars': 'error' },
        },
      ];

      const result = findFirstFiles(configs);
      expect(result).toEqual(['src/**/*.ts']);
    });

    it('should skip configs with undefined files', () => {
      const configs: Linter.Config[] = [
        {
          files: undefined,
          rules: { 'no-console': 'error' },
        },
        {
          files: ['src/**/*.ts'],
          rules: { 'no-unused-vars': 'error' },
        },
      ];

      const result = findFirstFiles(configs);
      expect(result).toEqual(['src/**/*.ts']);
    });

    it('should handle configs with null values', () => {
      const configs: (Linter.Config | null)[] = [
        null,
        {
          files: ['src/**/*.ts'],
          rules: { 'no-console': 'error' },
        },
      ];

      const result = findFirstFiles(configs as Linter.Config[]);
      expect(result).toEqual(['src/**/*.ts']);
    });

    it('should handle configs with undefined values', () => {
      const configs: (Linter.Config | undefined)[] = [
        undefined,
        {
          files: ['src/**/*.ts'],
          rules: { 'no-console': 'error' },
        },
      ];

      const result = findFirstFiles(configs as Linter.Config[]);
      expect(result).toEqual(['src/**/*.ts']);
    });

    it('should return undefined when all configs have empty files', () => {
      const configs: Linter.Config[] = [
        {
          files: [],
          rules: { 'no-console': 'error' },
        },
        {
          files: [],
          rules: { 'no-unused-vars': 'error' },
        },
      ];

      const result = findFirstFiles(configs);
      expect(result).toBeUndefined();
    });
  });

  describe('files property types', () => {
    it('should handle single file pattern', () => {
      const configs: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          rules: { 'no-console': 'error' },
        },
      ];

      const result = findFirstFiles(configs);
      expect(result).toEqual(['src/**/*.ts']);
    });

    it('should handle multiple file patterns', () => {
      const configs: Linter.Config[] = [
        {
          files: ['src/**/*.ts', 'lib/**/*.ts'],
          rules: { 'no-console': 'error' },
        },
      ];

      const result = findFirstFiles(configs);
      expect(result).toEqual(['src/**/*.ts', 'lib/**/*.ts']);
    });

    it('should handle nested arrays in files', () => {
      const configs: Linter.Config[] = [
        {
          files: [['src/**/*.ts'], ['lib/**/*.ts']],
          rules: { 'no-console': 'error' },
        },
      ];

      const result = findFirstFiles(configs);
      expect(result).toEqual([['src/**/*.ts'], ['lib/**/*.ts']]);
    });
  });

  describe('multiple configs scenarios', () => {
    it('should return first non-empty files even if later configs have files', () => {
      const configs: Linter.Config[] = [
        {
          rules: { 'no-console': 'error' },
        },
        {
          files: ['first/**/*.ts'],
          rules: { 'no-unused-vars': 'error' },
        },
        {
          files: ['second/**/*.ts'],
          rules: { 'no-debugger': 'error' },
        },
      ];

      const result = findFirstFiles(configs);
      expect(result).toEqual(['first/**/*.ts']);
    });

    it('should work with large arrays', () => {
      const configs: Linter.Config[] = Array.from({ length: 100 }, (_, i) => ({
        files: i === 50 ? ['target/**/*.ts'] : [],
        rules: { 'no-console': 'error' },
      }));

      const result = findFirstFiles(configs);
      expect(result).toEqual(['target/**/*.ts']);
    });

    it('should handle configs with only files property', () => {
      const configs: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
        },
      ];

      const result = findFirstFiles(configs);
      expect(result).toEqual(['src/**/*.ts']);
    });
  });
});
