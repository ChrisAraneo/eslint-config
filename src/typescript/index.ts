import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';
import { match } from 'ts-pattern';

import { ConfigBlock, SOURCES, TESTS } from '../interfaces.js';
import { setTsconfigRootDir } from '../utils/set-tsconfig-root-dir.js';
import { getEslintConfigs } from './eslint.js';
import { getSimpleImportSortConfigs } from './simple-import-sort.js';
import { getStylisticConfigs } from './stylistic.js';
import { getTypescriptEslintConfigs } from './typescript-eslint.js';
import { getUnicornConfigs } from './unicorn.js';

const createConfigs = (
  files: string[] = [],
  isTests = false,
  tsconfigRootDir?: string,
  shouldResolveAppRootDir = false,
): Linter.Config[] =>
  match(files?.length ?? 0)
    .with(0, () => [])
    .otherwise(() =>
      defineConfig([
        ...getEslintConfigs(files, isTests),
        ...getTypescriptEslintConfigs(files, isTests),
        ...getUnicornConfigs(files, isTests),
        ...getSimpleImportSortConfigs(files),
        ...getStylisticConfigs(files, isTests),
      ]).map((config) =>
        setTsconfigRootDir(
          config,
          files,
          tsconfigRootDir,
          shouldResolveAppRootDir,
        ),
      ),
    );

export const createTypeScriptConfigBlock = (
  sources: string[] = [],
  tsconfigRootDir?: string,
  shouldResolveAppRootDir = false,
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
  shouldResolveAppRootDir = false,
): ConfigBlock => ({
  [TESTS]: createConfigs(tests, true, tsconfigRootDir, shouldResolveAppRootDir),
});
