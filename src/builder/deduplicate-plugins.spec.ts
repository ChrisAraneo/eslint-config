import { describe, expect, it } from '@jest/globals';
import type { Linter } from 'eslint';

import { deduplicatePlugins } from './deduplicate-plugins.js';

const fakePluginA = { rules: {} };
const fakePluginB = { rules: {} };
const fakePluginC = { rules: {} };

describe('deduplicatePlugins', () => {
  describe('basic functionality', () => {
    it('should extract plugins into a single leading config', () => {
      const configs: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          plugins: { 'plugin-a': fakePluginA },
          rules: { 'rule-1': 'error' },
        },
        {
          files: ['lib/**/*.ts'],
          plugins: { 'plugin-b': fakePluginB },
          rules: { 'rule-2': 'warn' },
        },
      ];

      const result = deduplicatePlugins(configs);

      expect(result).toHaveLength(3);
      expect(result[0]?.plugins).toEqual({
        'plugin-a': fakePluginA,
        'plugin-b': fakePluginB,
      });
    });

    it('should remove plugins from individual configs', () => {
      const configs: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          plugins: { 'plugin-a': fakePluginA },
          rules: { 'rule-1': 'error' },
        },
      ];

      const result = deduplicatePlugins(configs);

      expect(result[1]?.plugins).toBeUndefined();
      expect(result[1]?.rules).toEqual({ 'rule-1': 'error' });
      expect(result[1]?.files).toEqual(['src/**/*.ts']);
    });

    it('should preserve all other config properties', () => {
      const configs: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          name: 'my-config',
          plugins: { 'plugin-a': fakePluginA },
          rules: { 'rule-1': 'error' },
        },
      ];

      const result = deduplicatePlugins(configs);

      expect(result[1]).toEqual({
        files: ['src/**/*.ts'],
        name: 'my-config',
        rules: { 'rule-1': 'error' },
      });
    });
  });

  describe('duplicate plugin handling', () => {
    it('should deduplicate the same plugin from multiple configs', () => {
      const configs: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          plugins: { '@typescript-eslint': fakePluginA },
          rules: { 'rule-1': 'error' },
        },
        {
          files: ['lib/**/*.ts'],
          plugins: { '@typescript-eslint': fakePluginA },
          rules: { 'rule-2': 'warn' },
        },
      ];

      const result = deduplicatePlugins(configs);

      expect(result).toHaveLength(3);
      expect(result[0]?.plugins).toEqual({
        '@typescript-eslint': fakePluginA,
      });
    });

    it('should merge different plugins from multiple configs', () => {
      const configs: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          plugins: { 'plugin-a': fakePluginA, 'plugin-b': fakePluginB },
        },
        {
          files: ['lib/**/*.ts'],
          plugins: { 'plugin-b': fakePluginB, 'plugin-c': fakePluginC },
        },
      ];

      const result = deduplicatePlugins(configs);

      expect(result[0]?.plugins).toEqual({
        'plugin-a': fakePluginA,
        'plugin-b': fakePluginB,
        'plugin-c': fakePluginC,
      });
    });
  });

  describe('configs without plugins', () => {
    it('should return configs as-is when none have plugins', () => {
      const configs: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          rules: { 'rule-1': 'error' },
        },
        {
          files: ['lib/**/*.ts'],
          rules: { 'rule-2': 'warn' },
        },
      ];

      const result = deduplicatePlugins(configs);

      expect(result).toHaveLength(2);
      expect(result).toEqual(configs);
    });

    it('should not prepend a plugins config when no plugins exist', () => {
      const configs: Linter.Config[] = [{ rules: { 'rule-1': 'error' } }];

      const result = deduplicatePlugins(configs);

      expect(result).toHaveLength(1);
      expect(result[0]?.plugins).toBeUndefined();
    });

    it('should pass through configs without plugins unchanged', () => {
      const configWithoutPlugins: Linter.Config = {
        files: ['**/*.json'],
        rules: { 'json-rule': 'error' },
      };
      const configs: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          plugins: { 'plugin-a': fakePluginA },
          rules: { 'rule-1': 'error' },
        },
        configWithoutPlugins,
      ];

      const result = deduplicatePlugins(configs);

      expect(result).toHaveLength(3);
      expect(result[2]).toEqual(configWithoutPlugins);
    });
  });

  describe('edge cases', () => {
    it('should handle empty configs array', () => {
      const result = deduplicatePlugins([]);
      expect(result).toEqual([]);
    });

    it('should handle config with empty plugins object', () => {
      const configs: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          plugins: {},
          rules: { 'rule-1': 'error' },
        },
      ];

      const result = deduplicatePlugins(configs);

      expect(result).toHaveLength(1);
      expect(result[0]?.plugins).toBeUndefined();
    });

    it('should handle single config with plugins', () => {
      const configs: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          plugins: { 'plugin-a': fakePluginA },
          rules: { 'rule-1': 'error' },
        },
      ];

      const result = deduplicatePlugins(configs);

      expect(result).toHaveLength(2);
      expect(result[0]?.plugins).toEqual({ 'plugin-a': fakePluginA });
      expect(result[1]?.plugins).toBeUndefined();
    });
  });

  describe('immutability', () => {
    it('should not mutate the original configs array', () => {
      const configs: Linter.Config[] = [
        {
          files: ['src/**/*.ts'],
          plugins: { 'plugin-a': fakePluginA },
          rules: { 'rule-1': 'error' },
        },
      ];

      const originalLength = configs.length;
      deduplicatePlugins(configs);

      expect(configs).toHaveLength(originalLength);
      expect(configs[0]?.plugins).toEqual({ 'plugin-a': fakePluginA });
    });
  });
});
