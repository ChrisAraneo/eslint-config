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

      builder.addTypeScriptConfig({} as any);
      const configs = builder.build();

      expect(Array.isArray(configs)).toBe(true);
    });

    describe('addTypeScriptConfig edge cases', () => {
      it('should handle empty object input', () => {
        const builder = configBuilder();
        builder.addTypeScriptConfig({});
        const configs = builder.build();

        expect(Array.isArray(configs)).toBe(true);
      });

      it('should handle undefined sources', () => {
        const builder = configBuilder();
        builder.addTypeScriptConfig({ sources: undefined });
        const configs = builder.build();

        expect(Array.isArray(configs)).toBe(true);
      });

      it('should handle undefined tsconfigRootDir', () => {
        const builder = configBuilder();
        builder.addTypeScriptConfig({
          sources: ['src/**/*.ts'],
          tsconfigRootDir: undefined,
        });
        const configs = builder.build();

        expect(Array.isArray(configs)).toBe(true);
      });

      it('should handle undefined shouldResolveAppRootDir', () => {
        const builder = configBuilder();
        builder.addTypeScriptConfig({
          shouldResolveAppRootDir: undefined,
          sources: ['src/**/*.ts'],
        });
        const configs = builder.build();

        expect(Array.isArray(configs)).toBe(true);
      });

      it('should handle all properties undefined', () => {
        const builder = configBuilder();
        builder.addTypeScriptConfig({
          shouldResolveAppRootDir: undefined,
          sources: undefined,
          tsconfigRootDir: undefined,
        });
        const configs = builder.build();

        expect(Array.isArray(configs)).toBe(true);
      });
    });

    describe('addTypeScriptTestsConfig edge cases', () => {
      it('should handle empty object input', () => {
        const builder = configBuilder();
        builder.addTypeScriptTestsConfig({});
        const configs = builder.build();

        expect(Array.isArray(configs)).toBe(true);
      });

      it('should handle undefined sources', () => {
        const builder = configBuilder();
        builder.addTypeScriptTestsConfig({ sources: undefined });
        const configs = builder.build();

        expect(Array.isArray(configs)).toBe(true);
      });

      it('should handle undefined tsconfigRootDir', () => {
        const builder = configBuilder();
        builder.addTypeScriptTestsConfig({
          sources: ['**/*.spec.ts'],
          tsconfigRootDir: undefined,
        });
        const configs = builder.build();

        expect(Array.isArray(configs)).toBe(true);
      });

      it('should handle all properties undefined', () => {
        const builder = configBuilder();
        builder.addTypeScriptTestsConfig({
          sources: undefined,
          tsconfigRootDir: undefined,
        });
        const configs = builder.build();

        expect(Array.isArray(configs)).toBe(true);
      });
    });

    describe('addAngularConfig edge cases', () => {
      it('should handle empty object input', () => {
        const builder = configBuilder();
        builder.addAngularConfig({});
        const configs = builder.build();

        expect(Array.isArray(configs)).toBe(true);
      });

      it('should handle all properties undefined', () => {
        const builder = configBuilder();
        builder.addAngularConfig({
          ignored: undefined,
          jsons: undefined,
          prefix: undefined,
          sources: undefined,
          templates: undefined,
          tests: undefined,
        });
        const configs = builder.build();

        expect(Array.isArray(configs)).toBe(true);
      });

      it('should handle undefined ignored', () => {
        const builder = configBuilder();
        builder.addAngularConfig({
          ignored: undefined,
          sources: ['src/**/*.ts'],
        });
        const configs = builder.build();

        expect(Array.isArray(configs)).toBe(true);
      });

      it('should handle empty string prefix', () => {
        const builder = configBuilder();
        builder.addAngularConfig({
          prefix: '',
          sources: ['src/**/*.ts'],
        });
        const configs = builder.build();

        expect(Array.isArray(configs)).toBe(true);
      });
    });

    describe('addJsonConfig edge cases', () => {
      it('should handle empty object input', () => {
        const builder = configBuilder();
        builder.addJsonConfig({});
        const configs = builder.build();

        expect(Array.isArray(configs)).toBe(true);
      });

      it('should handle undefined jsons', () => {
        const builder = configBuilder();
        builder.addJsonConfig({ jsons: undefined });
        const configs = builder.build();

        expect(Array.isArray(configs)).toBe(true);
      });
    });

    describe('addNxConfig edge cases', () => {
      it('should handle empty object input', () => {
        const builder = configBuilder();
        builder.addNxConfig({});
        const configs = builder.build();

        expect(Array.isArray(configs)).toBe(true);
      });

      it('should handle undefined sources', () => {
        const builder = configBuilder();
        builder.addNxConfig({ sources: undefined });
        const configs = builder.build();

        expect(Array.isArray(configs)).toBe(true);
      });

      it('should handle undefined rulesConfig', () => {
        const builder = configBuilder();
        builder.addNxConfig({
          rulesConfig: undefined,
          sources: ['**/project.json'],
        });
        const configs = builder.build();

        expect(Array.isArray(configs)).toBe(true);
      });

      it('should handle all properties undefined', () => {
        const builder = configBuilder();
        builder.addNxConfig({
          rulesConfig: undefined,
          sources: undefined,
        });
        const configs = builder.build();

        expect(Array.isArray(configs)).toBe(true);
      });

      it('should handle rulesConfig with nested undefined values', () => {
        const builder = configBuilder();
        builder.addNxConfig({
          rulesConfig: {
            dependencyChecks: undefined,
            enforceModuleBoundaries: undefined,
          },
          sources: ['**/project.json'],
        });
        const configs = builder.build();

        expect(Array.isArray(configs)).toBe(true);
      });
    });

    describe('addIgnored edge cases', () => {
      it('should handle undefined ignored', () => {
        const builder = configBuilder();
        builder.addIgnored({ ignored: undefined });
        const configs = builder.build();

        expect(Array.isArray(configs)).toBe(true);
      });

      it('should handle empty ignored array', () => {
        const builder = configBuilder();
        builder.addIgnored({ ignored: [] });
        const configs = builder.build();

        expect(Array.isArray(configs)).toBe(true);
      });

      it('should handle single ignored pattern', () => {
        const builder = configBuilder();
        builder.addIgnored({ ignored: ['dist/**'] });
        const configs = builder.build();
        const ignoredConfig = configs.find((c) => c.ignores);

        expect(ignoredConfig).toBeDefined();
        expect(ignoredConfig?.ignores).toEqual(['dist/**']);
      });
    });

    describe('multiple operations with edge cases', () => {
      it('should handle multiple empty configs', () => {
        const builder = configBuilder();
        builder
          .addTypeScriptConfig({})
          .addTypeScriptTestsConfig({})
          .addAngularConfig({})
          .addJsonConfig({})
          .addNxConfig({});

        const configs = builder.build();

        expect(Array.isArray(configs)).toBe(true);
      });

      it('should handle mix of empty and populated configs', () => {
        const builder = configBuilder();
        builder
          .addTypeScriptConfig({})
          .addTypeScriptTestsConfig({ sources: ['**/*.spec.ts'] })
          .addJsonConfig({});

        const configs = builder.build();

        expect(Array.isArray(configs)).toBe(true);
        expect(configs.length).toBeGreaterThan(0);
      });

      it('should handle reset after empty configs', () => {
        const builder = configBuilder();
        builder
          .addTypeScriptConfig({})
          .addJsonConfig({})
          .reset()
          .addNxConfig({ sources: ['**/project.json'] });

        const configs = builder.build();

        expect(Array.isArray(configs)).toBe(true);
      });

      it('should handle multiple builds with varying configs', () => {
        const builder = configBuilder();
        builder.addTypeScriptConfig({ sources: ['src/**/*.ts'] });

        const configs1 = builder.build();

        builder.addJsonConfig({ jsons: ['**/*.json'] });

        const configs2 = builder.build();

        expect(configs1.length).toBeGreaterThan(0);
        expect(configs2.length).toBeGreaterThan(0);
        expect(configs2.length).toBeGreaterThanOrEqual(configs1.length);
      });
    });

    describe('idempotency', () => {
      it('should produce consistent results from multiple builds', () => {
        const builder = configBuilder();
        builder.addTypeScriptConfig({ sources: ['src/**/*.ts'] });

        const configs1 = builder.build();
        const configs2 = builder.build();
        const configs3 = builder.build();

        expect(configs1).toEqual(configs2);
        expect(configs2).toEqual(configs3);
      });

      it('should produce same results when adding identical configs multiple times', () => {
        const builder1 = configBuilder();
        builder1.addTypeScriptConfig({ sources: ['src/**/*.ts'] });
        const configs1 = builder1.build();

        const builder2 = configBuilder();
        builder2
          .addTypeScriptConfig({ sources: ['src/**/*.ts'] })
          .addTypeScriptConfig({ sources: ['src/**/*.ts'] });
        const configs2 = builder2.build();

        expect(configs2.length).toBeGreaterThanOrEqual(configs1.length);
      });
    });

    describe('type validation for incorrect inputs', () => {
      describe('addTypeScriptConfig type validation', () => {
        describe('options parameter errors', () => {
          it('should throw exact error for null options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptConfig(null as any);
            }).toThrow(new Error('Expected an object'));
          });

          it('should throw exact error for undefined options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptConfig(undefined as any);
            }).toThrow(new Error('Expected an object'));
          });

          it('should not throw for array options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptConfig([] as any);
            }).not.toThrow();
          });

          it('should throw exact error for string options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptConfig('invalid' as any);
            }).toThrow(new Error('Expected an object'));
          });

          it('should throw exact error for number options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptConfig(123 as any);
            }).toThrow(new Error('Expected an object'));
          });

          it('should throw exact error for boolean options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptConfig(true as any);
            }).toThrow(new Error('Expected an object'));
          });
        });

        describe('sources field errors', () => {
          it('should throw exact error for string sources', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptConfig({ sources: 'invalid' as any });
            }).toThrow(new Error('sources must be an array or undefined'));
          });

          it('should throw exact error for object sources', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptConfig({ sources: {} as any });
            }).toThrow(new Error('sources must be an array or undefined'));
          });

          it('should throw exact error for number sources', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptConfig({ sources: 123 as any });
            }).toThrow(new Error('sources must be an array or undefined'));
          });

          it('should throw exact error for boolean sources', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptConfig({ sources: true as any });
            }).toThrow(new Error('sources must be an array or undefined'));
          });

          it('should throw exact error for null sources', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptConfig({ sources: null as any });
            }).toThrow(new Error('sources must be an array or undefined'));
          });
        });

        describe('tsconfigRootDir field errors', () => {
          it('should throw exact error for number tsconfigRootDir', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptConfig({ tsconfigRootDir: 123 as any });
            }).toThrow(
              new Error('tsconfigRootDir must be a string or undefined'),
            );
          });

          it('should throw exact error for array tsconfigRootDir', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptConfig({ tsconfigRootDir: [] as any });
            }).toThrow(
              new Error('tsconfigRootDir must be a string or undefined'),
            );
          });

          it('should throw exact error for object tsconfigRootDir', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptConfig({ tsconfigRootDir: {} as any });
            }).toThrow(
              new Error('tsconfigRootDir must be a string or undefined'),
            );
          });

          it('should throw exact error for boolean tsconfigRootDir', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptConfig({ tsconfigRootDir: true as any });
            }).toThrow(
              new Error('tsconfigRootDir must be a string or undefined'),
            );
          });

          it('should throw exact error for null tsconfigRootDir', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptConfig({ tsconfigRootDir: null as any });
            }).toThrow(
              new Error('tsconfigRootDir must be a string or undefined'),
            );
          });
        });

        describe('shouldResolveAppRootDir field errors', () => {
          it('should throw exact error for string shouldResolveAppRootDir', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptConfig({
                shouldResolveAppRootDir: 'true' as any,
              });
            }).toThrow(
              new Error(
                'shouldResolveAppRootDir must be a boolean or undefined',
              ),
            );
          });

          it('should throw exact error for number shouldResolveAppRootDir', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptConfig({
                shouldResolveAppRootDir: 1 as any,
              });
            }).toThrow(
              new Error(
                'shouldResolveAppRootDir must be a boolean or undefined',
              ),
            );
          });

          it('should throw exact error for array shouldResolveAppRootDir', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptConfig({
                shouldResolveAppRootDir: [] as any,
              });
            }).toThrow(
              new Error(
                'shouldResolveAppRootDir must be a boolean or undefined',
              ),
            );
          });

          it('should throw exact error for object shouldResolveAppRootDir', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptConfig({
                shouldResolveAppRootDir: {} as any,
              });
            }).toThrow(
              new Error(
                'shouldResolveAppRootDir must be a boolean or undefined',
              ),
            );
          });

          it('should throw exact error for null shouldResolveAppRootDir', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptConfig({
                shouldResolveAppRootDir: null as any,
              });
            }).toThrow(
              new Error(
                'shouldResolveAppRootDir must be a boolean or undefined',
              ),
            );
          });
        });
      });

      describe('addTypeScriptTestsConfig type validation', () => {
        describe('options parameter errors', () => {
          it('should throw exact error for null options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptTestsConfig(null as any);
            }).toThrow(new Error('Expected an object'));
          });

          it('should throw exact error for undefined options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptTestsConfig(undefined as any);
            }).toThrow(new Error('Expected an object'));
          });

          it('should not throw for array options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptTestsConfig([] as any);
            }).not.toThrow();
          });

          it('should throw exact error for string options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptTestsConfig('test' as any);
            }).toThrow(new Error('Expected an object'));
          });

          it('should throw exact error for number options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptTestsConfig(123 as any);
            }).toThrow(new Error('Expected an object'));
          });

          it('should throw exact error for boolean options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptTestsConfig(false as any);
            }).toThrow(new Error('Expected an object'));
          });
        });

        describe('sources field errors', () => {
          it('should throw exact error for string sources', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptTestsConfig({ sources: 'test' as any });
            }).toThrow(new Error('sources must be an array or undefined'));
          });

          it('should throw exact error for object sources', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptTestsConfig({ sources: {} as any });
            }).toThrow(new Error('sources must be an array or undefined'));
          });

          it('should throw exact error for number sources', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptTestsConfig({ sources: 42 as any });
            }).toThrow(new Error('sources must be an array or undefined'));
          });

          it('should throw exact error for boolean sources', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptTestsConfig({ sources: true as any });
            }).toThrow(new Error('sources must be an array or undefined'));
          });

          it('should throw exact error for null sources', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptTestsConfig({ sources: null as any });
            }).toThrow(new Error('sources must be an array or undefined'));
          });
        });

        describe('tsconfigRootDir field errors', () => {
          it('should throw exact error for number tsconfigRootDir', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptTestsConfig({ tsconfigRootDir: 123 as any });
            }).toThrow(
              new Error('tsconfigRootDir must be a string or undefined'),
            );
          });

          it('should throw exact error for array tsconfigRootDir', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptTestsConfig({ tsconfigRootDir: [] as any });
            }).toThrow(
              new Error('tsconfigRootDir must be a string or undefined'),
            );
          });

          it('should throw exact error for object tsconfigRootDir', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptTestsConfig({ tsconfigRootDir: {} as any });
            }).toThrow(
              new Error('tsconfigRootDir must be a string or undefined'),
            );
          });

          it('should throw exact error for boolean tsconfigRootDir', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptTestsConfig({
                tsconfigRootDir: false as any,
              });
            }).toThrow(
              new Error('tsconfigRootDir must be a string or undefined'),
            );
          });

          it('should throw exact error for null tsconfigRootDir', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addTypeScriptTestsConfig({
                tsconfigRootDir: null as any,
              });
            }).toThrow(
              new Error('tsconfigRootDir must be a string or undefined'),
            );
          });
        });
      });

      describe('addAngularConfig type validation', () => {
        describe('options parameter errors', () => {
          it('should throw exact error for null options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig(null as any);
            }).toThrow(new Error('Expected an object'));
          });

          it('should throw exact error for undefined options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig(undefined as any);
            }).toThrow(new Error('Expected an object'));
          });

          it('should not throw for array options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig([] as any);
            }).not.toThrow();
          });

          it('should throw exact error for string options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig('test' as any);
            }).toThrow(new Error('Expected an object'));
          });

          it('should throw exact error for number options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig(999 as any);
            }).toThrow(new Error('Expected an object'));
          });

          it('should throw exact error for boolean options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig(true as any);
            }).toThrow(new Error('Expected an object'));
          });
        });

        describe('sources field errors', () => {
          it('should throw exact error for string sources', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ sources: 'test' as any });
            }).toThrow(new Error('sources must be an array or undefined'));
          });

          it('should throw exact error for object sources', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ sources: {} as any });
            }).toThrow(new Error('sources must be an array or undefined'));
          });

          it('should throw exact error for number sources', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ sources: 456 as any });
            }).toThrow(new Error('sources must be an array or undefined'));
          });

          it('should throw exact error for boolean sources', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ sources: false as any });
            }).toThrow(new Error('sources must be an array or undefined'));
          });

          it('should throw exact error for null sources', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ sources: null as any });
            }).toThrow(new Error('sources must be an array or undefined'));
          });
        });

        describe('tests field errors', () => {
          it('should throw exact error for string tests', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ tests: 'test' as any });
            }).toThrow(new Error('tests must be an array or undefined'));
          });

          it('should throw exact error for object tests', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ tests: {} as any });
            }).toThrow(new Error('tests must be an array or undefined'));
          });

          it('should throw exact error for number tests', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ tests: 789 as any });
            }).toThrow(new Error('tests must be an array or undefined'));
          });

          it('should throw exact error for boolean tests', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ tests: true as any });
            }).toThrow(new Error('tests must be an array or undefined'));
          });

          it('should throw exact error for null tests', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ tests: null as any });
            }).toThrow(new Error('tests must be an array or undefined'));
          });
        });

        describe('templates field errors', () => {
          it('should throw exact error for string templates', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ templates: 'test' as any });
            }).toThrow(new Error('templates must be an array or undefined'));
          });

          it('should throw exact error for number templates', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ templates: 123 as any });
            }).toThrow(new Error('templates must be an array or undefined'));
          });

          it('should throw exact error for object templates', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ templates: {} as any });
            }).toThrow(new Error('templates must be an array or undefined'));
          });

          it('should throw exact error for boolean templates', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ templates: false as any });
            }).toThrow(new Error('templates must be an array or undefined'));
          });

          it('should throw exact error for null templates', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ templates: null as any });
            }).toThrow(new Error('templates must be an array or undefined'));
          });
        });

        describe('jsons field errors', () => {
          it('should throw exact error for string jsons', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ jsons: 'test' as any });
            }).toThrow(new Error('jsons must be an array or undefined'));
          });

          it('should throw exact error for object jsons', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ jsons: {} as any });
            }).toThrow(new Error('jsons must be an array or undefined'));
          });

          it('should throw exact error for number jsons', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ jsons: 100 as any });
            }).toThrow(new Error('jsons must be an array or undefined'));
          });

          it('should throw exact error for boolean jsons', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ jsons: true as any });
            }).toThrow(new Error('jsons must be an array or undefined'));
          });

          it('should throw exact error for null jsons', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ jsons: null as any });
            }).toThrow(new Error('jsons must be an array or undefined'));
          });
        });

        describe('prefix field errors', () => {
          it('should throw exact error for number prefix', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ prefix: 123 as any });
            }).toThrow(new Error('prefix must be a string or undefined'));
          });

          it('should throw exact error for array prefix', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ prefix: [] as any });
            }).toThrow(new Error('prefix must be a string or undefined'));
          });

          it('should throw exact error for object prefix', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ prefix: {} as any });
            }).toThrow(new Error('prefix must be a string or undefined'));
          });

          it('should throw exact error for boolean prefix', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ prefix: false as any });
            }).toThrow(new Error('prefix must be a string or undefined'));
          });

          it('should throw exact error for null prefix', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ prefix: null as any });
            }).toThrow(new Error('prefix must be a string or undefined'));
          });
        });

        describe('ignored field errors', () => {
          it('should throw exact error for string ignored', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ ignored: 'test' as any });
            }).toThrow(new Error('ignored must be an array or undefined'));
          });

          it('should throw exact error for object ignored', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ ignored: {} as any });
            }).toThrow(new Error('ignored must be an array or undefined'));
          });

          it('should throw exact error for number ignored', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ ignored: 555 as any });
            }).toThrow(new Error('ignored must be an array or undefined'));
          });

          it('should throw exact error for boolean ignored', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ ignored: true as any });
            }).toThrow(new Error('ignored must be an array or undefined'));
          });

          it('should throw exact error for null ignored', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addAngularConfig({ ignored: null as any });
            }).toThrow(new Error('ignored must be an array or undefined'));
          });
        });
      });

      describe('addJsonConfig type validation', () => {
        describe('options parameter errors', () => {
          it('should throw exact error for null options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addJsonConfig(null as any);
            }).toThrow(new Error('Expected an object'));
          });

          it('should throw exact error for undefined options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addJsonConfig(undefined as any);
            }).toThrow(new Error('Expected an object'));
          });

          it('should not throw for array options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addJsonConfig(['test'] as any);
            }).not.toThrow();
          });

          it('should throw exact error for string options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addJsonConfig('config' as any);
            }).toThrow(new Error('Expected an object'));
          });

          it('should throw exact error for number options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addJsonConfig(777 as any);
            }).toThrow(new Error('Expected an object'));
          });

          it('should throw exact error for boolean options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addJsonConfig(false as any);
            }).toThrow(new Error('Expected an object'));
          });
        });

        describe('jsons field errors', () => {
          it('should throw exact error for string jsons', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addJsonConfig({ jsons: 'test' as any });
            }).toThrow(new Error('jsons must be an array or undefined'));
          });

          it('should throw exact error for object jsons', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addJsonConfig({ jsons: {} as any });
            }).toThrow(new Error('jsons must be an array or undefined'));
          });

          it('should throw exact error for number jsons', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addJsonConfig({ jsons: 888 as any });
            }).toThrow(new Error('jsons must be an array or undefined'));
          });

          it('should throw exact error for boolean jsons', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addJsonConfig({ jsons: true as any });
            }).toThrow(new Error('jsons must be an array or undefined'));
          });

          it('should throw exact error for null jsons', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addJsonConfig({ jsons: null as any });
            }).toThrow(new Error('jsons must be an array or undefined'));
          });
        });
      });

      describe('addNxConfig type validation', () => {
        describe('options parameter errors', () => {
          it('should throw exact error for null options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addNxConfig(null as any);
            }).toThrow(new Error('Expected an object'));
          });

          it('should throw exact error for undefined options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addNxConfig(undefined as any);
            }).toThrow(new Error('Expected an object'));
          });

          it('should not throw for array options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addNxConfig([] as any);
            }).not.toThrow();
          });

          it('should throw exact error for string options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addNxConfig('nx' as any);
            }).toThrow(new Error('Expected an object'));
          });

          it('should throw exact error for number options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addNxConfig(999 as any);
            }).toThrow(new Error('Expected an object'));
          });

          it('should throw exact error for boolean options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addNxConfig(true as any);
            }).toThrow(new Error('Expected an object'));
          });
        });

        describe('sources field errors', () => {
          it('should throw exact error for string sources', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addNxConfig({ sources: 'test' as any });
            }).toThrow(new Error('sources must be an array or undefined'));
          });

          it('should throw exact error for object sources', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addNxConfig({ sources: {} as any });
            }).toThrow(new Error('sources must be an array or undefined'));
          });

          it('should throw exact error for number sources', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addNxConfig({ sources: 123 as any });
            }).toThrow(new Error('sources must be an array or undefined'));
          });

          it('should throw exact error for boolean sources', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addNxConfig({ sources: false as any });
            }).toThrow(new Error('sources must be an array or undefined'));
          });

          it('should throw exact error for null sources', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addNxConfig({ sources: null as any });
            }).toThrow(new Error('sources must be an array or undefined'));
          });
        });

        describe('rulesConfig field errors', () => {
          it('should throw exact error for string rulesConfig', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addNxConfig({ rulesConfig: 'test' as any });
            }).toThrow(new Error('rulesConfig must be an object or undefined'));
          });

          it('should not throw for array rulesConfig (lodash treats arrays as objects)', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addNxConfig({ rulesConfig: [] as any });
            }).not.toThrow();
          });

          it('should throw exact error for number rulesConfig', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addNxConfig({ rulesConfig: 123 as any });
            }).toThrow(new Error('rulesConfig must be an object or undefined'));
          });

          it('should throw exact error for boolean rulesConfig', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addNxConfig({ rulesConfig: true as any });
            }).toThrow(new Error('rulesConfig must be an object or undefined'));
          });

          it('should throw exact error for null rulesConfig', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addNxConfig({ rulesConfig: null as any });
            }).toThrow(new Error('rulesConfig must be an object or undefined'));
          });
        });
      });

      describe('addIgnored type validation', () => {
        describe('options parameter errors', () => {
          it('should throw exact error for null options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addIgnored(null as any);
            }).toThrow(new Error('Expected an object'));
          });

          it('should throw exact error for undefined options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addIgnored(undefined as any);
            }).toThrow(new Error('Expected an object'));
          });

          it('should not throw for array options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addIgnored(['test'] as any);
            }).not.toThrow();
          });

          it('should throw exact error for string options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addIgnored('test' as any);
            }).toThrow(new Error('Expected an object'));
          });

          it('should throw exact error for number options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addIgnored(555 as any);
            }).toThrow(new Error('Expected an object'));
          });

          it('should throw exact error for boolean options', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addIgnored(false as any);
            }).toThrow(new Error('Expected an object'));
          });
        });

        describe('ignored field errors', () => {
          it('should throw exact error for string ignored', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addIgnored({ ignored: 'test' as any });
            }).toThrow(new Error('ignored must be an array or undefined'));
          });

          it('should throw exact error for object ignored', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addIgnored({ ignored: {} as any });
            }).toThrow(new Error('ignored must be an array or undefined'));
          });

          it('should throw exact error for number ignored', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addIgnored({ ignored: 123 as any });
            }).toThrow(new Error('ignored must be an array or undefined'));
          });

          it('should throw exact error for boolean ignored', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addIgnored({ ignored: true as any });
            }).toThrow(new Error('ignored must be an array or undefined'));
          });

          it('should throw exact error for null ignored', () => {
            const builder = configBuilder();
            expect(() => {
              builder.addIgnored({ ignored: null as any });
            }).toThrow(new Error('ignored must be an array or undefined'));
          });
        });
      });

      describe('mixed incorrect input scenarios', () => {
        it('should throw error when chaining with incorrect input in the middle', () => {
          const builder = configBuilder();
          expect(() => {
            builder
              .addTypeScriptConfig({ sources: ['src/**/*.ts'] })

              .addJsonConfig(null as any)
              .addNxConfig({ sources: ['**/project.json'] });
          }).toThrow('Expected an object');
        });

        it('should allow reset after error is thrown', () => {
          const builder = configBuilder();
          try {
            builder.addTypeScriptConfig(null as any);
          } catch {
            // Error expected
          }

          builder.reset();
          builder.addJsonConfig({ jsons: ['**/*.json'] });
          const configs = builder.build();

          expect(Array.isArray(configs)).toBe(true);
        });

        it('should handle multiple type errors for different properties', () => {
          const builder = configBuilder();
          expect(() => {
            builder.addTypeScriptConfig({
              sources: 'invalid' as any,
            });
          }).toThrow('sources must be an array or undefined');
        });

        it('should validate first error when multiple properties are incorrect', () => {
          const builder = configBuilder();
          expect(() => {
            builder.addTypeScriptConfig({
              shouldResolveAppRootDir: 'not-a-boolean' as any,

              sources: 'not-an-array' as any,
            });
          }).toThrow();
        });
      });
    });
  });
});
