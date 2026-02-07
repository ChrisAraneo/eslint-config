import { describe, expect, it } from '@jest/globals';
import type { Linter } from 'eslint';

import { JSONS, NX, SOURCES, TEMPLATES, TESTS } from '../interfaces.js';
import { addCrossConfigOffRules } from './add-cross-config-off-rules.js';

describe('addCrossConfigOffRules', () => {
  describe('basic functionality', () => {
    it('should return empty config block when input is empty', () => {
      const result = addCrossConfigOffRules({});
      expect(result).toEqual({
        [JSONS]: [],
        [SOURCES]: [],
        [TEMPLATES]: [],
        [TESTS]: [],
      });
    });

    it('should preserve original configs', () => {
      const configBlock = {
        [SOURCES]: [
          {
            files: ['src/**/*.ts'],
            rules: { 'no-console': 'error' },
          } as Linter.Config,
        ],
      };

      const result = addCrossConfigOffRules(configBlock);
      expect(result[SOURCES]?.[0]?.rules).toEqual({ 'no-console': 'error' });
    });

    it('should not mutate the original config block', () => {
      const configBlock = {
        [SOURCES]: [
          {
            files: ['src/**/*.ts'],
            rules: { 'no-console': 'error' },
          } as Linter.Config,
        ],
      };

      const originalLength = configBlock[SOURCES]?.length ?? 0;
      addCrossConfigOffRules(configBlock);
      expect(configBlock[SOURCES]?.length).toBe(originalLength);
    });
  });

  describe('off rules generation', () => {
    it('should add off rules to SOURCES for TEMPLATES and JSONS rules', () => {
      const configBlock = {
        [JSONS]: [
          {
            files: ['**/*.json'],
            rules: { 'json-rule': 'error' },
          } as Linter.Config,
        ],
        [SOURCES]: [
          {
            files: ['src/**/*.ts'],
            rules: { 'source-rule': 'error' },
          } as Linter.Config,
        ],
        [TEMPLATES]: [
          {
            files: ['**/*.html'],
            rules: { 'template-rule': 'error' },
          } as Linter.Config,
        ],
      };

      const result = addCrossConfigOffRules(configBlock);
      const offRulesConfig = result[SOURCES]?.find(
        (c) => c.name === 'off-rules',
      );

      expect(offRulesConfig).toBeDefined();
      expect(offRulesConfig?.rules).toEqual({
        'json-rule': 'off',
        'template-rule': 'off',
      });
    });

    it('should add off rules to TESTS for TEMPLATES and JSONS rules', () => {
      const configBlock = {
        [TEMPLATES]: [
          {
            files: ['**/*.html'],
            rules: { 'template-rule': 'error' },
          } as Linter.Config,
        ],
        [TESTS]: [
          {
            files: ['**/*.spec.ts'],
            rules: { 'test-rule': 'error' },
          } as Linter.Config,
        ],
      };

      const result = addCrossConfigOffRules(configBlock);
      const offRulesConfig = result[TESTS]?.find((c) => c.name === 'off-rules');

      expect(offRulesConfig).toBeDefined();
      expect(offRulesConfig?.rules).toEqual({
        'template-rule': 'off',
      });
    });

    it('should add off rules to TEMPLATES for SOURCES, TESTS, JSONS, and NX rules', () => {
      const configBlock = {
        [JSONS]: [
          {
            files: ['**/*.json'],
            rules: { 'json-rule': 'error' },
          } as Linter.Config,
        ],
        [NX]: [
          {
            files: ['**/project.json'],
            rules: { 'nx-rule': 'error' },
          } as Linter.Config,
        ],
        [SOURCES]: [
          {
            files: ['src/**/*.ts'],
            rules: { 'source-rule': 'error' },
          } as Linter.Config,
        ],
        [TEMPLATES]: [
          {
            files: ['**/*.html'],
            rules: { 'template-rule': 'error' },
          } as Linter.Config,
        ],
        [TESTS]: [
          {
            files: ['**/*.spec.ts'],
            rules: { 'test-rule': 'error' },
          } as Linter.Config,
        ],
      };

      const result = addCrossConfigOffRules(configBlock);
      const offRulesConfig = result[TEMPLATES]?.find(
        (c) => c.name === 'off-rules',
      );

      expect(offRulesConfig).toBeDefined();
      expect(offRulesConfig?.rules).toEqual({
        'json-rule': 'off',
        'nx-rule': 'off',
        'source-rule': 'off',
        'test-rule': 'off',
      });
    });

    it('should add off rules to JSONS for SOURCES, TESTS, TEMPLATES, and NX rules', () => {
      const configBlock = {
        [JSONS]: [
          {
            files: ['**/*.json'],
            rules: { 'json-rule': 'error' },
          } as Linter.Config,
        ],
        [SOURCES]: [
          {
            files: ['src/**/*.ts'],
            rules: { 'source-rule': 'error' },
          } as Linter.Config,
        ],
      };

      const result = addCrossConfigOffRules(configBlock);
      const offRulesConfig = result[JSONS]?.find((c) => c.name === 'off-rules');

      expect(offRulesConfig).toBeDefined();
      expect(offRulesConfig?.rules).toEqual({
        'source-rule': 'off',
      });
    });
  });

  describe('edge cases', () => {
    it('should handle configs without files property', () => {
      const configBlock = {
        [SOURCES]: [
          {
            rules: { 'source-rule': 'error' },
          } as Linter.Config,
        ],
      };

      const result = addCrossConfigOffRules(configBlock);
      expect(result[SOURCES]).toBeDefined();
    });

    it('should handle configs without rules property', () => {
      const configBlock = {
        [SOURCES]: [
          {
            files: ['src/**/*.ts'],
          } as Linter.Config,
        ],
        [TEMPLATES]: [
          {
            files: ['**/*.html'],
          } as Linter.Config,
        ],
      };

      const result = addCrossConfigOffRules(configBlock);
      const offRulesConfig = result[SOURCES]?.find(
        (c) => c.name === 'off-rules',
      );
      expect(offRulesConfig?.rules).toEqual({});
    });

    it('should handle empty arrays for config types', () => {
      const configBlock = {
        [JSONS]: [],
        [SOURCES]: [],
        [TEMPLATES]: [],
        [TESTS]: [],
      };

      const result = addCrossConfigOffRules(configBlock);
      expect(result[SOURCES]).toEqual([]);
      expect(result[TESTS]).toEqual([]);
      expect(result[TEMPLATES]).toEqual([]);
      expect(result[JSONS]).toEqual([]);
    });

    it('should handle multiple configs of the same type', () => {
      const configBlock = {
        [SOURCES]: [
          {
            files: ['src/**/*.ts'],
            rules: { 'rule-1': 'error' },
          } as Linter.Config,
          {
            files: ['lib/**/*.ts'],
            rules: { 'rule-2': 'error' },
          } as Linter.Config,
        ],
        [TEMPLATES]: [
          {
            files: ['**/*.html'],
            rules: { 'template-rule': 'error' },
          } as Linter.Config,
        ],
      };

      const result = addCrossConfigOffRules(configBlock);
      expect(result[SOURCES]?.length).toBe(3); // 2 original + 1 off-rules
    });

    it('should merge duplicate rule names', () => {
      const configBlock = {
        [JSONS]: [
          {
            files: ['**/*.json'],
            rules: { 'shared-rule': 'warn' },
          } as Linter.Config,
        ],
        [SOURCES]: [
          {
            files: ['src/**/*.ts'],
            rules: { 'source-rule': 'error' },
          } as Linter.Config,
        ],
        [TEMPLATES]: [
          {
            files: ['**/*.html'],
            rules: { 'shared-rule': 'error' },
          } as Linter.Config,
        ],
      };

      const result = addCrossConfigOffRules(configBlock);
      const offRulesConfig = result[SOURCES]?.find(
        (c) => c.name === 'off-rules',
      );

      expect(offRulesConfig?.rules).toEqual({
        'shared-rule': 'off',
      });
    });
  });

  describe('files property handling', () => {
    it('should use files from the first config with files', () => {
      const configBlock = {
        [SOURCES]: [
          {
            files: ['src/**/*.ts'],
            rules: { 'source-rule': 'error' },
          } as Linter.Config,
        ],
        [TEMPLATES]: [
          {
            files: ['**/*.html'],
            rules: { 'template-rule': 'error' },
          } as Linter.Config,
        ],
      };

      const result = addCrossConfigOffRules(configBlock);
      const offRulesConfig = result[SOURCES]?.find(
        (c) => c.name === 'off-rules',
      );

      expect(offRulesConfig?.files).toEqual(['**/*.html']);
    });

    it('should not add off-rules config when no files are available', () => {
      const configBlock = {
        [SOURCES]: [
          {
            rules: { 'source-rule': 'error' },
          } as Linter.Config,
        ],
        [TEMPLATES]: [
          {
            rules: { 'template-rule': 'error' },
          } as Linter.Config,
        ],
      };

      const result = addCrossConfigOffRules(configBlock);
      const offRulesConfig = result[SOURCES]?.find(
        (c) => c.name === 'off-rules',
      );

      expect(offRulesConfig).toBeUndefined();
    });
  });

  describe('immutability', () => {
    it('should not modify the input config block', () => {
      const configBlock = {
        [SOURCES]: [
          {
            files: ['src/**/*.ts'],
            rules: { 'source-rule': 'error' },
          } as Linter.Config,
        ],
      };

      const originalSourcesLength = configBlock[SOURCES]?.length;
      const result = addCrossConfigOffRules(configBlock);

      expect(configBlock[SOURCES]?.length).toBe(originalSourcesLength);
      expect(result[SOURCES]?.length).toBeGreaterThanOrEqual(
        originalSourcesLength ?? 0,
      );
    });

    it('should create new config objects', () => {
      const configBlock = {
        [SOURCES]: [
          {
            files: ['src/**/*.ts'],
            rules: { 'source-rule': 'error' },
          } as Linter.Config,
        ],
      };

      const result = addCrossConfigOffRules(configBlock);
      expect(result).not.toBe(configBlock);
      expect(result[SOURCES]).not.toBe(configBlock[SOURCES]);
    });
  });
});
