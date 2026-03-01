import { describe, expect, it } from '@jest/globals';

import {
  ConfigBlock,
  IGNORED,
  JSONS,
  NX,
  SOURCES,
  TEMPLATES,
  TESTS,
} from '../interfaces.js';
import { appendCrossConfigFilesToIgnores } from './append-cross-config-files-to-ignores.js';

describe('appendCrossConfigFilesToIgnores', () => {
  describe('SOURCES', () => {
    it('should append TEMPLATES and JSONS files as ignores', () => {
      const configBlock = {
        [JSONS]: [{ files: ['src/**/*.json'] }],
        [SOURCES]: [{ files: ['src/**/*.ts'] }],
        [TEMPLATES]: [{ files: ['src/**/*.html'] }],
      };

      const result = appendCrossConfigFilesToIgnores(configBlock);

      expect(result[SOURCES]?.[0]?.ignores).toEqual([
        'src/**/*.html',
        'src/**/*.json',
      ]);
    });

    it('should not append TESTS or NX files', () => {
      const configBlock = {
        [NX]: [{ files: ['project.json'] }],
        [SOURCES]: [{ files: ['src/**/*.ts'] }],
        [TESTS]: [{ files: ['src/**/*.spec.ts'] }],
      };

      const result = appendCrossConfigFilesToIgnores(configBlock);

      expect(result[SOURCES]?.[0]?.ignores).toBeUndefined();
    });
  });

  describe('TESTS', () => {
    it('should append TEMPLATES and JSONS files as ignores', () => {
      const configBlock = {
        [JSONS]: [{ files: ['src/**/*.json'] }],
        [TEMPLATES]: [{ files: ['src/**/*.html'] }],
        [TESTS]: [{ files: ['src/**/*.spec.ts'] }],
      };

      const result = appendCrossConfigFilesToIgnores(configBlock);

      expect(result[TESTS]?.[0]?.ignores).toEqual([
        'src/**/*.html',
        'src/**/*.json',
      ]);
    });

    it('should not append SOURCES or NX files', () => {
      const configBlock = {
        [NX]: [{ files: ['project.json'] }],
        [SOURCES]: [{ files: ['src/**/*.ts'] }],
        [TESTS]: [{ files: ['src/**/*.spec.ts'] }],
      };

      const result = appendCrossConfigFilesToIgnores(configBlock);

      expect(result[TESTS]?.[0]?.ignores).toBeUndefined();
    });
  });

  describe('TEMPLATES', () => {
    it('should append SOURCES, TESTS, JSONS and NX files as ignores', () => {
      const configBlock = {
        [JSONS]: [{ files: ['src/**/*.json'] }],
        [NX]: [{ files: ['project.json'] }],
        [SOURCES]: [{ files: ['src/**/*.ts'] }],
        [TEMPLATES]: [{ files: ['src/**/*.html'] }],
        [TESTS]: [{ files: ['src/**/*.spec.ts'] }],
      };

      const result = appendCrossConfigFilesToIgnores(configBlock);

      expect(result[TEMPLATES]?.[0]?.ignores).toEqual([
        'src/**/*.ts',
        'src/**/*.spec.ts',
        'src/**/*.json',
        'project.json',
      ]);
    });
  });

  describe('JSONS', () => {
    it('should append SOURCES, TESTS, TEMPLATES and NX files as ignores', () => {
      const configBlock = {
        [JSONS]: [{ files: ['src/**/*.json'] }],
        [NX]: [{ files: ['project.json'] }],
        [SOURCES]: [{ files: ['src/**/*.ts'] }],
        [TEMPLATES]: [{ files: ['src/**/*.html'] }],
        [TESTS]: [{ files: ['src/**/*.spec.ts'] }],
      };

      const result = appendCrossConfigFilesToIgnores(configBlock);

      expect(result[JSONS]?.[0]?.ignores).toEqual([
        'src/**/*.ts',
        'src/**/*.spec.ts',
        'src/**/*.html',
        'project.json',
      ]);
    });
  });

  describe('NX and IGNORED passthrough', () => {
    it('should leave NX configs unchanged', () => {
      const nxConfigs = [
        { files: ['project.json'], rules: { 'no-console': 'error' } },
      ];
      const configBlock = {
        [NX]: nxConfigs,
        [SOURCES]: [{ files: ['src/**/*.ts'] }],
      } as ConfigBlock;

      const result = appendCrossConfigFilesToIgnores(configBlock);

      expect(result[NX]).toEqual(nxConfigs);
    });

    it('should leave IGNORED configs unchanged', () => {
      const ignoredConfigs = [{ ignores: ['dist/**'] }];
      const configBlock = {
        [IGNORED]: ignoredConfigs,
        [SOURCES]: [{ files: ['src/**/*.ts'] }],
      } as ConfigBlock;

      const result = appendCrossConfigFilesToIgnores(configBlock);

      expect(result[IGNORED]).toEqual(ignoredConfigs);
    });
  });

  describe('existing ignores', () => {
    it('should preserve existing ignores and append cross-config files', () => {
      const configBlock = {
        [SOURCES]: [{ files: ['src/**/*.ts'], ignores: ['src/legacy/**'] }],
        [TEMPLATES]: [{ files: ['src/**/*.html'] }],
      } as ConfigBlock;

      const result = appendCrossConfigFilesToIgnores(configBlock);

      expect(result[SOURCES]?.[0]?.ignores).toEqual([
        'src/legacy/**',
        'src/**/*.html',
      ]);
    });
  });

  describe('empty and missing configs', () => {
    it('should return unchanged config when cross-config keys are absent', () => {
      const configBlock = {
        [SOURCES]: [{ files: ['src/**/*.ts'] }],
      } as ConfigBlock;

      const result = appendCrossConfigFilesToIgnores(configBlock);

      expect(result[SOURCES]?.[0]?.ignores).toBeUndefined();
    });

    it('should handle an empty configBlock', () => {
      const result = appendCrossConfigFilesToIgnores({});

      expect(result[SOURCES]).toEqual([]);
      expect(result[TESTS]).toEqual([]);
      expect(result[TEMPLATES]).toEqual([]);
      expect(result[JSONS]).toEqual([]);
    });

    it('should handle configs without a files property in cross keys', () => {
      const configBlock = {
        [SOURCES]: [{ files: ['src/**/*.ts'] }],
        [TEMPLATES]: [{ rules: { 'no-console': 'error' } }],
      } as ConfigBlock;

      const result = appendCrossConfigFilesToIgnores(configBlock);

      expect(result[SOURCES]?.[0]?.ignores).toBeUndefined();
    });
  });

  describe('immutability', () => {
    it('should return a new ConfigBlock and not mutate the original', () => {
      const configBlock = {
        [SOURCES]: [{ files: ['src/**/*.ts'] }],
        [TEMPLATES]: [{ files: ['src/**/*.html'] }],
      } as ConfigBlock;
      const originalSource = configBlock[SOURCES]![0];

      const result = appendCrossConfigFilesToIgnores(configBlock);

      expect(result).not.toBe(configBlock);
      expect(result[SOURCES]![0]).not.toBe(originalSource);
      expect(originalSource?.ignores).toBeUndefined();
    });
  });

  describe('multiple configs per key', () => {
    it('should update ignores on each config entry independently', () => {
      const configBlock = {
        [JSONS]: [{ files: ['src/**/*.json'] }],
        [SOURCES]: [
          { files: ['src/**/*.ts'] },
          { files: ['lib/**/*.ts'], ignores: ['lib/legacy/**'] },
        ],
      };

      const result = appendCrossConfigFilesToIgnores(configBlock);

      expect(result[SOURCES]?.[0]?.ignores).toEqual(['src/**/*.json']);
      expect(result[SOURCES]?.[1]?.ignores).toEqual([
        'lib/legacy/**',
        'src/**/*.json',
      ]);
    });
  });
});
