import { get as getAppRootDir } from 'app-root-dir';
import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';

import { ConfigBlock, SOURCES, TESTS } from '../interfaces.js';
import { isEmpty } from '../utils.js';
import { getEslintConfigs } from './eslint.js';
import { getSimpleImportSortConfigs } from './simple-import-sort.js';
import { getTypescriptEslintConfigs } from './typescript-eslint.js';
import { getUnicornConfigs } from './unicorn.js';

const createConfigs = (
  sources: string[] = [],
  isTests = false,
  tsconfigRootDir?: string,
  shouldResolveAppRootDir?: boolean,
): Linter.Config[] =>
  isEmpty(sources)
    ? []
    : defineConfig([
        ...getEslintConfigs(sources, isTests),
        ...getTypescriptEslintConfigs(
          sources,
          {
            ...(tsconfigRootDir && !shouldResolveAppRootDir
              ? { tsconfigRootDir }
              : {}),
            ...(shouldResolveAppRootDir
              ? { tsconfigRootDir: getAppRootDir() }
              : {}),
          },
          isTests,
        ),
        ...getUnicornConfigs(sources),
        ...getSimpleImportSortConfigs(sources),
      ]);

export const createTypeScriptConfigBlock = (
  sources: string[] = [],
  tsconfigRootDir?: string,
  shouldResolveAppRootDir?: boolean,
): ConfigBlock => ({
  [SOURCES]: createConfigs(
    sources,
    false,
    tsconfigRootDir,
    shouldResolveAppRootDir,
  ),
});

export const createTypeScriptTestsConfigBlock = (
  tests?: string[],
  tsconfigRootDir?: string,
): ConfigBlock => ({
  [TESTS]: createConfigs(tests, true, tsconfigRootDir),
});
