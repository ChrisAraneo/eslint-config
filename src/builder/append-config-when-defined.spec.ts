import { describe, expect, it } from '@jest/globals';
import type { Linter } from 'eslint';

import { appendConfigWhenDefined } from './append-config-when-defined.js';

describe('appendConfigWhenDefined', () => {
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

    const result = appendConfigWhenDefined({ config: newConfig, configs });

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

    const result = appendConfigWhenDefined({ config: null, configs });

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

    const result = appendConfigWhenDefined({ config: undefined, configs });

    expect(result).toHaveLength(1);
    expect(result).toEqual(configs);
  });

  it('should not append when config is an empty object', () => {
    const configs: Linter.Config[] = [
      {
        files: ['src/**/*.ts'],
        rules: { 'no-console': 'error' },
      },
    ];

    const result = appendConfigWhenDefined({ config: {}, configs });

    expect(result).toHaveLength(1);
    expect(result).toEqual(configs);
  });

  it('should not append when config is an array', () => {
    const configs: Linter.Config[] = [
      {
        files: ['src/**/*.ts'],
        rules: { 'no-console': 'error' },
      },
    ];

    const result = appendConfigWhenDefined({
      config: [
        { files: ['lib/**/*.ts'], rules: { 'no-unused-vars': 'error' } },
      ],
      configs,
    });

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

    const result = appendConfigWhenDefined({ config: newConfig, configs });

    expect(result).not.toBe(configs);
  });

  it('should handle empty configs array', () => {
    const configs: Linter.Config[] = [];
    const newConfig: Linter.Config = {
      files: ['src/**/*.ts'],
      rules: { 'no-console': 'error' },
    };

    const result = appendConfigWhenDefined({ config: newConfig, configs });

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(newConfig);
  });

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

    appendConfigWhenDefined({ config: newConfig, configs });

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

    appendConfigWhenDefined({ config: null, configs });

    expect(configs).toHaveLength(originalLength);
  });

  it('should append config when configs is undefined', () => {
    const newConfig: Linter.Config = { files: ['src/**/*.ts'] };

    const result = appendConfigWhenDefined({
      config: newConfig,
      configs: undefined,
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(newConfig);
  });

  it('should return empty array when configs is undefined and config is not appendable', () => {
    const result = appendConfigWhenDefined({
      config: null,
      configs: undefined,
    });

    expect(result).toEqual([]);
  });
});
