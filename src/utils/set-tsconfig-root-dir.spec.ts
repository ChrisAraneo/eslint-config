import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import type { Linter } from 'eslint';

let setTsconfigRootDir: (typeof import('./set-tsconfig-root-dir.js'))['setTsconfigRootDir'];

beforeAll(async () => {
  jest.unstable_mockModule('app-root-dir', () => ({
    get: () => '/mocked/app/root',
  }));

  ({ setTsconfigRootDir } = await import('./set-tsconfig-root-dir.js'));
});

describe('setTsconfigRootDir', () => {
  describe('when source matches config files', () => {
    it('should set tsconfigRootDir from the provided value', () => {
      const config = { files: ['src/**/*.ts'], rules: {} };

      const result = setTsconfigRootDir({
        config,
        sources: ['src/**/*.ts'],
        tsconfigRootDir: '/custom/root',
      });

      expect(result.languageOptions?.parserOptions).toEqual(
        expect.objectContaining({ tsconfigRootDir: '/custom/root' }),
      );
    });

    it('should resolve tsconfigRootDir from app-root-dir when shouldResolveAppRootDir is true', () => {
      const config = { files: ['src/**/*.ts'], rules: {} };

      const result = setTsconfigRootDir({
        config,
        shouldResolveAppRootDir: true,
        sources: ['src/**/*.ts'],
      });

      expect(result.languageOptions?.parserOptions).toEqual(
        expect.objectContaining({ tsconfigRootDir: '/mocked/app/root' }),
      );
    });

    it('should prefer shouldResolveAppRootDir over tsconfigRootDir', () => {
      const config = { files: ['src/**/*.ts'], rules: {} };

      const result = setTsconfigRootDir({
        config,
        shouldResolveAppRootDir: true,
        sources: ['src/**/*.ts'],
        tsconfigRootDir: '/custom/root',
      });

      expect(result.languageOptions?.parserOptions).toEqual(
        expect.objectContaining({ tsconfigRootDir: '/mocked/app/root' }),
      );
    });

    it('should not set tsconfigRootDir when neither option is provided', () => {
      const config = { files: ['src/**/*.ts'], rules: {} };

      const result = setTsconfigRootDir({
        config,
        sources: ['src/**/*.ts'],
      });

      expect(result.languageOptions?.parserOptions).toEqual({});
    });

    it('should not set tsconfigRootDir when shouldResolveAppRootDir is false and tsconfigRootDir is absent', () => {
      const config = { files: ['src/**/*.ts'], rules: {} };

      const result = setTsconfigRootDir({
        config,
        shouldResolveAppRootDir: false,
        sources: ['src/**/*.ts'],
      });

      expect(result.languageOptions?.parserOptions).toEqual({});
    });
  });

  describe('when source does not match config files', () => {
    it('should return the original config unchanged', () => {
      const config: Linter.Config = {
        files: ['lib/**/*.ts'],
        rules: { 'no-console': 'error' },
      };

      const result = setTsconfigRootDir({
        config,
        sources: ['src/**/*.ts'],
        tsconfigRootDir: '/custom/root',
      });

      expect(result).toEqual(config);
    });

    it('should return the original config when config has no files', () => {
      const config: Linter.Config = { rules: { 'no-console': 'error' } };

      const result = setTsconfigRootDir({
        config,
        sources: ['src/**/*.ts'],
        tsconfigRootDir: '/custom/root',
      });

      expect(result).toEqual(config);
    });
  });

  describe('preserves existing config properties', () => {
    it('should preserve existing languageOptions', () => {
      const config = {
        files: ['src/**/*.ts'],
        languageOptions: {
          ecmaVersion: 2022 as const,
        },
      };

      const result = setTsconfigRootDir({
        config,
        sources: ['src/**/*.ts'],
        tsconfigRootDir: '/root',
      });

      expect(result.languageOptions?.ecmaVersion).toBe(2022);
    });

    it('should preserve existing parserOptions', () => {
      const config = {
        files: ['src/**/*.ts'],
        languageOptions: {
          parserOptions: {
            projectService: true,
          },
        },
      };

      const result = setTsconfigRootDir({
        config,
        sources: ['src/**/*.ts'],
        tsconfigRootDir: '/root',
      });

      expect(result.languageOptions?.parserOptions).toEqual(
        expect.objectContaining({
          projectService: true,
          tsconfigRootDir: '/root',
        }),
      );
    });

    it('should preserve rules and other top-level config properties', () => {
      const config: Linter.Config = {
        files: ['src/**/*.ts'],
        rules: { 'no-console': 'error' },
      };

      const result = setTsconfigRootDir({
        config,
        sources: ['src/**/*.ts'],
        tsconfigRootDir: '/root',
      });

      expect(result.rules).toEqual({ 'no-console': 'error' });
    });
  });

  describe('multiple sources', () => {
    it('should match when any source is in config files', () => {
      const config = { files: ['src/**/*.ts', 'lib/**/*.ts'] };

      const result = setTsconfigRootDir({
        config,
        sources: ['lib/**/*.ts'],
        tsconfigRootDir: '/root',
      });

      expect(result.languageOptions?.parserOptions).toEqual(
        expect.objectContaining({ tsconfigRootDir: '/root' }),
      );
    });

    it('should not match when no source is in config files', () => {
      const config = { files: ['src/**/*.ts'] };

      const result = setTsconfigRootDir({
        config,
        sources: ['test/**/*.ts', 'lib/**/*.ts'],
        tsconfigRootDir: '/root',
      });

      expect(result).toEqual(config);
    });
  });

  describe('edge cases', () => {
    it('should handle empty sources array', () => {
      const config = { files: ['src/**/*.ts'] };

      const result = setTsconfigRootDir({
        config,
        sources: [],
        tsconfigRootDir: '/root',
      });

      expect(result).toEqual(config);
    });

    it('should handle config with empty files array', () => {
      const config = { files: [] };

      const result = setTsconfigRootDir({
        config,
        sources: ['src/**/*.ts'],
        tsconfigRootDir: '/root',
      });

      expect(result).toEqual(config);
    });
  });
});
