import { get as getAppRootDir } from 'app-root-dir';
import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';
import { isEmpty } from 'lodash';

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

export const createTypeScriptConfigs = (
  sources: string[] = [],
  tsconfigRootDir?: string,
  shouldResolveAppRootDir?: boolean,
): Linter.Config[] =>
  createConfigs(sources, false, tsconfigRootDir, shouldResolveAppRootDir);

export const createTypeScriptTestsConfigs = (
  sources: string[] = [],
  tsconfigRootDir?: string,
): Linter.Config[] => createConfigs(sources, true, tsconfigRootDir);
