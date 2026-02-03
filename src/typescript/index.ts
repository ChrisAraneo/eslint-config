import { get as getAppRootDir } from 'app-root-dir';
import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';

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
): Linter.Config[] => {
  if (isEmpty(sources)) {
    return [];
  }

  const parserOptions = {};

  if (tsconfigRootDir && !shouldResolveAppRootDir) {
    Object.assign(parserOptions, { tsconfigRootDir });
  } else if (shouldResolveAppRootDir) {
    Object.assign(parserOptions, { tsconfigRootDir: getAppRootDir() });
  }

  return defineConfig([
    ...getEslintConfigs(sources, isTests),
    ...getTypescriptEslintConfigs(sources, parserOptions, isTests),
    ...getUnicornConfigs(sources),
    ...getSimpleImportSortConfigs(sources),
  ]);
};

export const createTypeScriptConfigs = (
  sources: string[] = [],
  tsconfigRootDir?: string,
  shouldResolveAppRootDir?: boolean,
) => {
  return createConfigs(
    sources,
    false,
    tsconfigRootDir,
    shouldResolveAppRootDir,
  );
};

export const createTypeScriptTestsConfigs = (
  sources: string[] = [],
  tsconfigRootDir?: string,
) => {
  return createConfigs(sources, true, tsconfigRootDir);
};
