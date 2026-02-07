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

    expect(result.size).toBe(0);
  });

  it('should create off rules for multiple config types', () => {
    const keys = ['typescript', 'tests'];
    const rulesPerKey = {
      tests: ['test-rule'],
      typescript: ['ts-rule'],
    };
    const filesPerKey = {
      tests: ['**/*.spec.ts'],
      typescript: ['**/*.ts'],
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
      tests: ['test-rule'],
      typescript: ['ts-rule'],
    };
    const filesPerKey = {
      tests: ['**/*.spec.ts'],
      typescript: [],
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
      tests: ['test-rule'],
      typescript: [],
    };
    const filesPerKey = {
      tests: ['**/*.spec.ts'],
      typescript: ['**/*.ts'],
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
      json: ['json-rule'],
      tests: ['test-rule'],
      typescript: ['ts-rule-1', 'ts-rule-2'],
    };
    const filesPerKey = {
      json: ['**/*.json'],
      tests: ['**/*.spec.ts'],
      typescript: ['**/*.ts'],
    };

    const result = createOffRulesPerFilePattern(keys, rulesPerKey, filesPerKey);

    const tsFilesKey = JSON.stringify(['**/*.ts']);
    const testFilesKey = JSON.stringify(['**/*.spec.ts']);
    const jsonFilesKey = JSON.stringify(['**/*.json']);

    expect(result.get(tsFilesKey)).toEqual({
      'json-rule': 'off',
      'test-rule': 'off',
    });

    expect(result.get(testFilesKey)).toEqual({
      'json-rule': 'off',
      'ts-rule-1': 'off',
      'ts-rule-2': 'off',
    });

    expect(result.get(jsonFilesKey)).toEqual({
      'test-rule': 'off',
      'ts-rule-1': 'off',
      'ts-rule-2': 'off',
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
      tests: ['test-rule'],
      typescript: ['ts-rule'],
    };
    const filesPerKey = {
      tests: ['**/*.spec.ts'],
      typescript: ['**/*.tsx', '**/*.ts'],
    };

    const result = createOffRulesPerFilePattern(keys, rulesPerKey, filesPerKey);

    const tsFilesKey = JSON.stringify(['**/*.ts', '**/*.tsx']);
    expect(result.has(tsFilesKey)).toBe(true);
  });
});
