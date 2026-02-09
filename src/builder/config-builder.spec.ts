import { describe, expect, it } from '@jest/globals';

import { configBuilder } from './config-builder.js';

describe('configBuilder', () => {
  describe('factory function', () => {
    it('should create a new builder instance', () => {
      const builder = configBuilder();

      expect(builder).toBeDefined();
      expect(typeof builder.build).toBe('function');
    });

    it('should create independent instances', () => {
      const builder1 = configBuilder();
      const builder2 = configBuilder();

      expect(builder1).not.toBe(builder2);
    });
  });

  describe('addTypeScriptConfig', () => {
    it('should add TypeScript config with sources', () => {
      const builder = configBuilder();
      const result = builder.addTypeScriptConfig({
        sources: ['src/**/*.ts'],
      });

      expect(result).toBe(builder);

      const configs = builder.build();

      expect(Array.isArray(configs)).toBe(true);
      expect(configs.length).toBeGreaterThan(0);
    });

    it('should handle empty sources array', () => {
      const builder = configBuilder();
      builder.addTypeScriptConfig({ sources: [] });
      const configs = builder.build();

      expect(Array.isArray(configs)).toBe(true);
    });

    it('should handle tsconfigRootDir option', () => {
      const builder = configBuilder();
      builder.addTypeScriptConfig({
        sources: ['src/**/*.ts'],
        tsconfigRootDir: './tsconfig.json',
      });
      const configs = builder.build();

      expect(Array.isArray(configs)).toBe(true);
    });

    it('should handle shouldResolveAppRootDir option', () => {
      const builder = configBuilder();
      builder.addTypeScriptConfig({
        shouldResolveAppRootDir: true,
        sources: ['src/**/*.ts'],
      });
      const configs = builder.build();

      expect(Array.isArray(configs)).toBe(true);
    });
  });

  describe('addTypeScriptTestsConfig', () => {
    it('should add TypeScript tests config', () => {
      const builder = configBuilder();
      const result = builder.addTypeScriptTestsConfig({
        sources: ['**/*.spec.ts'],
      });

      expect(result).toBe(builder);

      const configs = builder.build();

      expect(Array.isArray(configs)).toBe(true);
    });

    it('should handle empty sources array', () => {
      const builder = configBuilder();
      builder.addTypeScriptTestsConfig({ sources: [] });
      const configs = builder.build();

      expect(Array.isArray(configs)).toBe(true);
    });

    it('should handle tsconfigRootDir option', () => {
      const builder = configBuilder();
      builder.addTypeScriptTestsConfig({
        sources: ['**/*.spec.ts'],
        tsconfigRootDir: './tsconfig.spec.json',
      });
      const configs = builder.build();

      expect(Array.isArray(configs)).toBe(true);
    });
  });

  describe('addAngularConfig', () => {
    it('should add Angular config with all options', () => {
      const builder = configBuilder();
      const result = builder.addAngularConfig({
        jsons: ['**/*.json'],
        prefix: 'app',
        sources: ['src/**/*.ts'],
        templates: ['**/*.html'],
        tests: ['**/*.spec.ts'],
      });

      expect(result).toBe(builder);

      const configs = builder.build();

      expect(Array.isArray(configs)).toBe(true);
    });

    it('should handle empty arrays', () => {
      const builder = configBuilder();
      builder.addAngularConfig({
        jsons: [],
        sources: [],
        templates: [],
        tests: [],
      });
      const configs = builder.build();

      expect(Array.isArray(configs)).toBe(true);
    });

    it('should use default prefix when not provided', () => {
      const builder = configBuilder();
      builder.addAngularConfig({
        sources: ['src/**/*.ts'],
      });
      const configs = builder.build();

      expect(Array.isArray(configs)).toBe(true);
    });

    it('should handle custom prefix', () => {
      const builder = configBuilder();
      builder.addAngularConfig({
        prefix: 'custom',
        sources: ['src/**/*.ts'],
      });
      const configs = builder.build();

      expect(Array.isArray(configs)).toBe(true);
    });

    it('should handle ignored option', () => {
      const builder = configBuilder();
      builder.addAngularConfig({
        ignored: ['dist/**'],
        sources: ['src/**/*.ts'],
      });
      const configs = builder.build();

      expect(Array.isArray(configs)).toBe(true);
    });
  });

  describe('addJsonConfig', () => {
    it('should add JSON config', () => {
      const builder = configBuilder();
      const result = builder.addJsonConfig({
        jsons: ['**/*.json'],
      });

      expect(result).toBe(builder);

      const configs = builder.build();

      expect(Array.isArray(configs)).toBe(true);
    });

    it('should handle empty jsons array', () => {
      const builder = configBuilder();
      builder.addJsonConfig({ jsons: [] });
      const configs = builder.build();

      expect(Array.isArray(configs)).toBe(true);
    });
  });

  describe('addNxConfig', () => {
    it('should add NX config', () => {
      const builder = configBuilder();
      const result = builder.addNxConfig({
        sources: ['**/project.json'],
      });

      expect(result).toBe(builder);

      const configs = builder.build();

      expect(Array.isArray(configs)).toBe(true);
    });

    it('should handle empty sources array', () => {
      const builder = configBuilder();
      builder.addNxConfig({ sources: [] });
      const configs = builder.build();

      expect(Array.isArray(configs)).toBe(true);
    });
  });

  describe('addIgnored', () => {
    it('should add ignored config', () => {
      const builder = configBuilder();
      const result = builder.addIgnored({
        ignored: ['dist/**', 'node_modules/**'],
      });

      expect(result).toBe(builder);

      const configs = builder.build();
      const ignoredConfig = configs.find((c) => c.ignores);

      expect(ignoredConfig).toBeDefined();
      expect(ignoredConfig?.ignores).toEqual(['dist/**', 'node_modules/**']);
    });

    it('should handle empty ignored array', () => {
      const builder = configBuilder();
      builder.addIgnored({ ignored: [] });
      const configs = builder.build();

      expect(Array.isArray(configs)).toBe(true);
    });
  });

  describe('build', () => {
    it('should return an array of configs', () => {
      const builder = configBuilder();
      const configs = builder.build();

      expect(Array.isArray(configs)).toBe(true);
    });

    it('should combine multiple config types', () => {
      const builder = configBuilder();
      builder
        .addTypeScriptConfig({ sources: ['src/**/*.ts'] })
        .addTypeScriptTestsConfig({ sources: ['**/*.spec.ts'] })
        .addJsonConfig({ jsons: ['**/*.json'] });

      const configs = builder.build();

      expect(configs.length).toBeGreaterThan(0);
    });
  });

  describe('reset', () => {
    it('should clear all config blocks', () => {
      const builder = configBuilder();
      builder
        .addTypeScriptConfig({ sources: ['src/**/*.ts'] })
        .addJsonConfig({ jsons: ['**/*.json'] });

      const configsBeforeReset = builder.build();

      expect(configsBeforeReset.length).toBeGreaterThan(0);

      builder.reset();
      const configsAfterReset = builder.build();

      expect(configsAfterReset.length).toBe(0);
    });

    it('should return the builder instance for chaining', () => {
      const builder = configBuilder();
      const result = builder.reset();

      expect(result).toBe(builder);
    });

    it('should allow adding configs after reset', () => {
      const builder = configBuilder();
      builder.addTypeScriptConfig({ sources: ['src/**/*.ts'] });
      builder.reset();
      builder.addJsonConfig({ jsons: ['**/*.json'] });

      const configs = builder.build();

      expect(Array.isArray(configs)).toBe(true);
    });
  });

  describe('method chaining', () => {
    it('should support chaining all methods', () => {
      const builder = configBuilder();
      const result = builder
        .addTypeScriptConfig({ sources: ['src/**/*.ts'] })
        .addTypeScriptTestsConfig({ sources: ['**/*.spec.ts'] })
        .addAngularConfig({ sources: ['src/**/*.ts'] })
        .addJsonConfig({ jsons: ['**/*.json'] })
        .addNxConfig({ sources: ['**/project.json'] })
        .addIgnored({ ignored: ['dist/**'] });

      expect(result).toBe(builder);
    });

    it('should allow reset in the middle of chaining', () => {
      const builder = configBuilder();
      const result = builder
        .addTypeScriptConfig({ sources: ['src/**/*.ts'] })
        .reset()
        .addJsonConfig({ jsons: ['**/*.json'] });

      expect(result).toBe(builder);
    });
  });

  describe('edge cases', () => {
    it('should handle building without adding any configs', () => {
      const builder = configBuilder();
      const configs = builder.build();

      expect(configs).toEqual([]);
    });

    it('should handle multiple builds without reset', () => {
      const builder = configBuilder();
      builder.addTypeScriptConfig({ sources: ['src/**/*.ts'] });

      const configs1 = builder.build();
      const configs2 = builder.build();

      expect(configs1.length).toBeGreaterThan(0);
      expect(configs2.length).toBeGreaterThan(0);
    });

    it('should handle undefined options gracefully', () => {
      const builder = configBuilder();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      builder.addTypeScriptConfig({} as any);
      const configs = builder.build();

      expect(Array.isArray(configs)).toBe(true);
    });
  });

  describe('plugin deduplication', () => {
    it('should deduplicate plugins in built configs', () => {
      const builder = configBuilder();
      builder.addTypeScriptConfig({ sources: ['src/**/*.ts'] });
      const configs = builder.build();

      expect(configs[0]?.plugins).toBeDefined();

      const configsWithPlugins = configs.filter((c) => c.plugins);

      expect(configsWithPlugins.length).toBe(1);
    });

    it('should not have duplicate plugin errors with TypeScript and Angular configs', () => {
      const builder = configBuilder();
      builder
        .addTypeScriptConfig({ sources: ['src/**/*.ts'] })
        .addAngularConfig({ sources: ['src/**/*.ts'] });

      const configs = builder.build();
      expect(Array.isArray(configs)).toBe(true);
      expect(configs.length).toBeGreaterThan(0);
    });

    it('should place all plugins in the first config entry', () => {
      const builder = configBuilder();
      builder
        .addTypeScriptConfig({ sources: ['src/**/*.ts'] })
        .addAngularConfig({ sources: ['src/**/*.ts'] });

      const configs = builder.build();

      expect(configs[0]?.plugins).toBeDefined();
      expect(Object.keys(configs[0]?.plugins ?? {}).length).toBeGreaterThan(0);

      for (let i = 1; i < configs.length; i++) {
        expect(configs[i]?.plugins).toBeUndefined();
      }
    });

    it('should preserve all other config properties when deduplicating', () => {
      const builder = configBuilder();
      builder.addTypeScriptConfig({ sources: ['src/**/*.ts'] });

      const configs = builder.build();

      const configsWithRules = configs.filter((c) => c.rules);

      expect(configsWithRules.length).toBeGreaterThan(0);

      const configsWithFiles = configs.filter((c) => c.files);

      expect(configsWithFiles.length).toBeGreaterThan(0);
    });

    it('should handle configs without plugins', () => {
      const builder = configBuilder();
      builder.addIgnored({ ignored: ['dist/**'] });

      const configs = builder.build();

      expect(Array.isArray(configs)).toBe(true);

      const configsWithPlugins = configs.filter((c) => c.plugins);

      expect(configsWithPlugins.length).toBe(0);
    });

    it('should deduplicate plugins across multiple config types', () => {
      const builder = configBuilder();
      builder
        .addTypeScriptConfig({ sources: ['src/**/*.ts'] })
        .addTypeScriptTestsConfig({ sources: ['**/*.spec.ts'] })
        .addAngularConfig({
          jsons: ['**/*.json'],
          sources: ['src/**/*.component.ts'],
          templates: ['**/*.html'],
        });

      const configs = builder.build();

      const configsWithPlugins = configs.filter((c) => c.plugins);

      expect(configsWithPlugins.length).toBe(1);
      expect(configsWithPlugins[0]).toBe(configs[0]);
    });
  });
});
