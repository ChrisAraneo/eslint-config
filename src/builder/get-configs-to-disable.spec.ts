import { describe, expect, it } from '@jest/globals';
import type { Linter } from 'eslint';

import {
  ConfigBlock,
  JSONS,
  NX,
  SOURCES,
  TEMPLATES,
  TESTS,
} from '../interfaces.js';
import { getConfigsToDisable } from './get-configs-to-disable.js';

describe('getConfigsToDisable', () => {
  it('should return empty array when given empty keys array', () => {
    const configBlock = {
      [SOURCES]: [{ files: ['**/*.ts'] }],
    };

    const result = getConfigsToDisable(configBlock, []);

    expect(result).toEqual([]);
  });

  it('should return configs for a single key', () => {
    const sourceConfig: Linter.Config = { files: ['**/*.ts'], rules: {} };
    const configBlock = {
      [SOURCES]: [sourceConfig],
    };

    const result = getConfigsToDisable(configBlock, [SOURCES]);

    expect(result).toEqual([sourceConfig]);
  });

  it('should return configs for multiple keys', () => {
    const configs: Record<string, Linter.Config> = {
      json: { files: ['**/*.json'] },
      nx: { files: ['**/project.json'] },
      source: { files: ['**/*.ts'] },
      template: { files: ['**/*.html'] },
      test: { files: ['**/*.spec.ts'] },
    };
    const configBlock = {
      [JSONS]: [configs.json],
      [NX]: [configs.nx],
      [SOURCES]: [configs.source],
      [TEMPLATES]: [configs.template],
      [TESTS]: [configs.test],
    } as ConfigBlock;

    const result = getConfigsToDisable(configBlock, [
      SOURCES,
      TESTS,
      TEMPLATES,
      JSONS,
      NX,
    ]);

    expect(result).toEqual([
      configs.source,
      configs.test,
      configs.template,
      configs.json,
      configs.nx,
    ]);
  });

  it('should flatten multiple configs from multiple keys', () => {
    const sourceConfig1: Linter.Config = { files: ['**/*.ts'] };
    const sourceConfig2: Linter.Config = { files: ['**/*.tsx'] };
    const testConfig: Linter.Config = { files: ['**/*.spec.ts'] };
    const configBlock = {
      [SOURCES]: [sourceConfig1, sourceConfig2],
      [TESTS]: [testConfig],
    };

    const result = getConfigsToDisable(configBlock, [SOURCES, TESTS]);

    expect(result).toEqual([sourceConfig1, sourceConfig2, testConfig]);
  });

  it('should return empty array for keys that do not exist in configBlock', () => {
    const configBlock = {
      [SOURCES]: [{ files: ['**/*.ts'] }],
    };

    const result = getConfigsToDisable(configBlock, [TESTS, TEMPLATES]);

    expect(result).toEqual([]);
  });

  it('should handle mix of existing and non-existing keys', () => {
    const sourceConfig: Linter.Config = { files: ['**/*.ts'] };
    const configBlock = {
      [SOURCES]: [sourceConfig],
    };

    const result = getConfigsToDisable(configBlock, [
      SOURCES,
      TESTS,
      TEMPLATES,
    ]);

    expect(result).toEqual([sourceConfig]);
  });

  it('should handle empty configBlock', () => {
    const configBlock = {};

    const result = getConfigsToDisable(configBlock, [SOURCES, TESTS]);

    expect(result).toEqual([]);
  });

  it('should preserve config order based on keys order', () => {
    const config1: Linter.Config = { files: ['*.ts'] };
    const config2: Linter.Config = { files: ['*.spec.ts'] };
    const configBlock = {
      [SOURCES]: [config1],
      [TESTS]: [config2],
    };

    const resultOrder1 = getConfigsToDisable(configBlock, [SOURCES, TESTS]);
    const resultOrder2 = getConfigsToDisable(configBlock, [TESTS, SOURCES]);

    expect(resultOrder1).toEqual([config1, config2]);
    expect(resultOrder2).toEqual([config2, config1]);
  });
});
