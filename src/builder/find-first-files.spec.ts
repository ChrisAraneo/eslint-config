import { describe, expect, it } from '@jest/globals';
import type { Linter } from 'eslint';

import { findFirstFiles } from './find-first-files.js';

describe('findFirstFiles', () => {
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
