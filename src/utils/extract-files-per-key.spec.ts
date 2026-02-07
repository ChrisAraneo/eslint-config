import { describe, expect, it } from '@jest/globals';
import type { Linter } from 'eslint';

import { extractFilesPerKey } from './extract-files-per-key.js';

describe('extractFilesPerKey', () => {
  it('should extract files from single config type', () => {
    const configs: Record<string, Linter.Config[]> = {
      typescript: [
        {
          files: ['**/*.ts', '**/*.tsx'],
          rules: {
            'no-console': 'error',
          },
        },
      ],
    };

    const result = extractFilesPerKey(configs);

    expect(result).toEqual({
      typescript: ['**/*.ts', '**/*.tsx'],
    });
  });

  it('should extract and deduplicate files from multiple configs', () => {
    const configs: Record<string, Linter.Config[]> = {
      typescript: [
        {
          files: ['**/*.ts'],
          rules: {
            'no-console': 'error',
          },
        },
        {
          files: ['**/*.ts', '**/*.tsx'],
          rules: {
            'prefer-const': 'error',
          },
        },
      ],
    };

    const result = extractFilesPerKey(configs);

    expect(result.typescript).toHaveLength(2);
    expect(result.typescript).toContain('**/*.ts');
    expect(result.typescript).toContain('**/*.tsx');
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

    const result = extractFilesPerKey(configs);

    expect(result).toEqual({
      tests: ['**/*.spec.ts'],
      typescript: ['**/*.ts'],
    });
  });

  it('should handle configs without files', () => {
    const configs: Record<string, Linter.Config[]> = {
      typescript: [
        {
          rules: {
            'no-console': 'error',
          },
        },
      ],
    };

    const result = extractFilesPerKey(configs);

    expect(result).toEqual({
      typescript: [],
    });
  });

  it('should handle empty config arrays', () => {
    const configs: Record<string, Linter.Config[]> = {
      typescript: [],
    };

    const result = extractFilesPerKey(configs);

    expect(result).toEqual({
      typescript: [],
    });
  });

  it('should handle empty configs object', () => {
    const configs: Record<string, Linter.Config[]> = {};

    const result = extractFilesPerKey(configs);

    expect(result).toEqual({});
  });

  it('should handle configs with undefined files', () => {
    const configs: Record<string, Linter.Config[]> = {
      typescript: [
        {
          files: undefined,
          rules: {
            'no-console': 'error',
          },
        },
      ],
    };

    const result = extractFilesPerKey(configs);

    expect(result).toEqual({
      typescript: [],
    });
  });

  it('should flatten nested file arrays', () => {
    const configs: Record<string, Linter.Config[]> = {
      typescript: [
        {
          files: [['**/*.ts', '**/*.tsx']],
          rules: {
            'no-console': 'error',
          },
        },
      ],
    };

    const result = extractFilesPerKey(configs);

    expect(result.typescript).toEqual(['**/*.ts', '**/*.tsx']);
  });

  it('should filter out non-string file patterns', () => {
    const configs: Record<string, Linter.Config[]> = {
      typescript: [
        {
          files: [
            '**/*.ts',
            123 as unknown as string,
            null as unknown as string,
          ],
          rules: {
            'no-console': 'error',
          },
        },
      ],
    };

    const result = extractFilesPerKey(configs);

    expect(result.typescript).toEqual(['**/*.ts']);
  });
});
