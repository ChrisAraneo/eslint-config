import { describe, expect, it } from '@jest/globals';
import type { Linter } from 'eslint';

import { appendConfigWhenDefined } from './append-config-when-defined.js';

describe('appendConfigWhenDefined', () => {
  describe('basic functionality', () => {
    it('should append config when it is a valid object', () => {
      const configs: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          rules: { 'no-console': 'error' },
        },
      ];
      const newConfig: Linter.Config = {
        files: ['lib/**/*.ts'],
        rules: { 'no-unused-vars': 'error' },
      };

      const result = appendConfigWhenDefined(configs, newConfig);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(configs[0]);
      expect(result[1]).toEqual(newConfig);
    });

    it('should not append config when it is null', () => {
      const configs: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          rules: { 'no-console': 'error' },
        },
      ];

      const result = appendConfigWhenDefined(configs, null);

      expect(result).toHaveLength(1);
      expect(result).toEqual(configs);
    });

    it('should not append config when it is undefined', () => {
      const configs: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          rules: { 'no-console': 'error' },
        },
      ];

      const result = appendConfigWhenDefined(configs, undefined);

      expect(result).toHaveLength(1);
      expect(result).toEqual(configs);
    });

    it('should return new array instance', () => {
      const configs: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          rules: { 'no-console': 'error' },
        },
      ];
      const newConfig: Linter.Config = {
        files: ['lib/**/*.ts'],
        rules: { 'no-unused-vars': 'error' },
      };

      const result = appendConfigWhenDefined(configs, newConfig);

      expect(result).not.toBe(configs);
    });
  });

  describe('edge cases', () => {
    it('should handle empty configs array', () => {
      const configs: Linter.Config[] = [];
      const newConfig: Linter.Config = {
        files: ['src/**/*.ts'],
        rules: { 'no-console': 'error' },
      };

      const result = appendConfigWhenDefined(configs, newConfig);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(newConfig);
    });

    it('should not append when config is a primitive string', () => {
      const configs: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          rules: { 'no-console': 'error' },
        },
      ];

      const result = appendConfigWhenDefined(configs, 'not-a-config');

      expect(result).toHaveLength(1);
      expect(result).toEqual(configs);
    });

    it('should not append when config is a primitive number', () => {
      const configs: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          rules: { 'no-console': 'error' },
        },
      ];

      const result = appendConfigWhenDefined(configs, 42);

      expect(result).toHaveLength(1);
      expect(result).toEqual(configs);
    });

    it('should not append when config is a primitive boolean', () => {
      const configs: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          rules: { 'no-console': 'error' },
        },
      ];

      const result = appendConfigWhenDefined(configs, false);

      expect(result).toHaveLength(1);
      expect(result).toEqual(configs);
    });

    it('should append when config is an empty object', () => {
      const configs: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          rules: { 'no-console': 'error' },
        },
      ];

      const result = appendConfigWhenDefined(configs, {});

      expect(result).toHaveLength(2);
      expect(result[1]).toEqual({});
    });

    it('should append when config is an array (arrays are objects)', () => {
      const configs: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          rules: { 'no-console': 'error' },
        },
      ];

      const result = appendConfigWhenDefined(configs, []);

      expect(result).toHaveLength(2);
      expect(result[1]).toEqual([]);
    });
  });

  describe('immutability', () => {
    it('should not mutate the original configs array', () => {
      const configs: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          rules: { 'no-console': 'error' },
        },
      ];
      const originalLength = configs.length;
      const newConfig: Linter.Config = {
        files: ['lib/**/*.ts'],
        rules: { 'no-unused-vars': 'error' },
      };

      appendConfigWhenDefined(configs, newConfig);

      expect(configs).toHaveLength(originalLength);
    });

    it('should not mutate the original configs when config is not appended', () => {
      const configs: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          rules: { 'no-console': 'error' },
        },
      ];
      const originalLength = configs.length;

      appendConfigWhenDefined(configs, null);

      expect(configs).toHaveLength(originalLength);
    });
  });

  describe('config object variations', () => {
    it('should append config with only files property', () => {
      const configs: Linter.Config[] = [];
      const newConfig: Linter.Config = {
        files: ['src/**/*.ts'],
      };

      const result = appendConfigWhenDefined(configs, newConfig);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(newConfig);
    });

    it('should append config with only rules property', () => {
      const configs: Linter.Config[] = [];
      const newConfig: Linter.Config = {
        rules: { 'no-console': 'error' },
      };

      const result = appendConfigWhenDefined(configs, newConfig);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(newConfig);
    });

    it('should append config with name property', () => {
      const configs: Linter.Config[] = [];
      const newConfig: Linter.Config = {
        files: ['src/**/*.ts'],
        name: 'off-rules',
        rules: { 'no-console': 'off' },
      };

      const result = appendConfigWhenDefined(configs, newConfig);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(newConfig);
    });

    it('should append config with ignores property', () => {
      const configs: Linter.Config[] = [];
      const newConfig: Linter.Config = {
        ignores: ['dist/**', 'node_modules/**'],
      };

      const result = appendConfigWhenDefined(configs, newConfig);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(newConfig);
    });
  });
});
