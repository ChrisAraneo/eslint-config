import { get as getAppRootDir } from 'app-root-dir';
import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';

import { isEmpty } from '../utils.js';
import { getEslintConfig } from './eslint.js';
import { getSimpleImportSortConfig } from './simple-import-sort.js';
import { getTypescriptEslintConfig } from './typescript-eslint.js';
import { getUnicornConfig } from './unicorn.js';

const createConfigs = (
  sources: string[] = [],
  isTests = false,
  tsconfigRootDir?: string,
  shouldResolveAppRootDir?: boolean,
): Linter.Config[] => {
  if (isEmpty(sources)) {
    return [];
  }

  const parserOptions = {
    allowAutomaticSingleRunInference: true,
    projectService: true,
  };

  if (tsconfigRootDir && !shouldResolveAppRootDir) {
    Object.assign(parserOptions, { tsconfigRootDir });
  } else if (shouldResolveAppRootDir) {
    Object.assign(parserOptions, { tsconfigRootDir: getAppRootDir() });
  }

  return defineConfig([
    getEslintConfig(sources, parserOptions, isTests),
    getTypescriptEslintConfig(sources, parserOptions, isTests),
    getUnicornConfig(sources),
    getSimpleImportSortConfig(sources),
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
