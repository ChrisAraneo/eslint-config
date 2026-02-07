import { describe, expect, it } from '@jest/globals';

import { createOffRulesPerFilePattern } from './create-off-rules-per-file-pattern.js';

describe('createOffRulesPerFilePattern', () => {
  it('should create off rules for single config type', () => {
    const keys = ['typescript'];
    const rulesPerKey = {
      typescript: ['ts-rule-1', 'ts-rule-2'],
    };
    const filesPerKey = {
      typescript: ['**/*.ts'],
    };

    const result = createOffRulesPerFilePattern(keys, rulesPerKey, filesPerKey);

    expect(result.size).toBe(0); // No off rules needed for single config type
  });

  it('should create off rules for multiple config types', () => {
    const keys = ['typescript', 'tests'];
    const rulesPerKey = {
      typescript: ['ts-rule'],
      tests: ['test-rule'],
    };
    const filesPerKey = {
      typescript: ['**/*.ts'],
      tests: ['**/*.spec.ts'],
    };

    const result = createOffRulesPerFilePattern(keys, rulesPerKey, filesPerKey);

    expect(result.size).toBe(2);

    const tsFilesKey = JSON.stringify(['**/*.ts']);
    const testFilesKey = JSON.stringify(['**/*.spec.ts']);

    expect(result.get(tsFilesKey)).toEqual({
      'test-rule': 'off',
    });

    expect(result.get(testFilesKey)).toEqual({
      'ts-rule': 'off',
    });
  });

  it('should handle configs with no files', () => {
    const keys = ['typescript', 'tests'];
    const rulesPerKey = {
      typescript: ['ts-rule'],
      tests: ['test-rule'],
    };
    const filesPerKey = {
      typescript: [],
      tests: ['**/*.spec.ts'],
    };

    const result = createOffRulesPerFilePattern(keys, rulesPerKey, filesPerKey);

    const testFilesKey = JSON.stringify(['**/*.spec.ts']);
    expect(result.get(testFilesKey)).toEqual({
      'ts-rule': 'off',
    });
  });

  it('should handle configs with no rules', () => {
    const keys = ['typescript', 'tests'];
    const rulesPerKey = {
      typescript: [],
      tests: ['test-rule'],
    };
    const filesPerKey = {
      typescript: ['**/*.ts'],
      tests: ['**/*.spec.ts'],
    };

    const result = createOffRulesPerFilePattern(keys, rulesPerKey, filesPerKey);

    const tsFilesKey = JSON.stringify(['**/*.ts']);
    expect(result.get(tsFilesKey)).toEqual({
      'test-rule': 'off',
    });
  });

  it('should handle multiple rules from different config types', () => {
    const keys = ['typescript', 'tests', 'json'];
    const rulesPerKey = {
      typescript: ['ts-rule-1', 'ts-rule-2'],
      tests: ['test-rule'],
      json: ['json-rule'],
    };
    const filesPerKey = {
      typescript: ['**/*.ts'],
      tests: ['**/*.spec.ts'],
      json: ['**/*.json'],
    };

    const result = createOffRulesPerFilePattern(keys, rulesPerKey, filesPerKey);

    const tsFilesKey = JSON.stringify(['**/*.ts']);
    const testFilesKey = JSON.stringify(['**/*.spec.ts']);
    const jsonFilesKey = JSON.stringify(['**/*.json']);

    expect(result.get(tsFilesKey)).toEqual({
      'test-rule': 'off',
      'json-rule': 'off',
    });

    expect(result.get(testFilesKey)).toEqual({
      'ts-rule-1': 'off',
      'ts-rule-2': 'off',
      'json-rule': 'off',
    });

    expect(result.get(jsonFilesKey)).toEqual({
      'ts-rule-1': 'off',
      'ts-rule-2': 'off',
      'test-rule': 'off',
    });
  });

  it('should handle empty keys array', () => {
    const keys: string[] = [];
    const rulesPerKey = {};
    const filesPerKey = {};

    const result = createOffRulesPerFilePattern(keys, rulesPerKey, filesPerKey);

    expect(result.size).toBe(0);
  });

  it('should normalize file patterns by sorting', () => {
    const keys = ['typescript', 'tests'];
    const rulesPerKey = {
      typescript: ['ts-rule'],
      tests: ['test-rule'],
    };
    const filesPerKey = {
      typescript: ['**/*.tsx', '**/*.ts'], // Unsorted
      tests: ['**/*.spec.ts'],
    };

    const result = createOffRulesPerFilePattern(keys, rulesPerKey, filesPerKey);

    // Should use sorted key
    const tsFilesKey = JSON.stringify(['**/*.ts', '**/*.tsx']);
    expect(result.has(tsFilesKey)).toBe(true);
  });
});
