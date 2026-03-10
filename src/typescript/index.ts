import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';
import { match } from 'ts-pattern';

import {
  ConfigBlock,
  SOURCES,
  TESTS,
  TypeScriptConfigOptions,
  TypeScriptTestConfigOptions,
} from '../interfaces.js';
import { setTsconfigRootDir } from '../utils/set-tsconfig-root-dir.js';
import { getEslintConfigs } from './eslint.js';
import { getSimpleImportSortConfigs } from './simple-import-sort.js';
import { getStylisticConfigs } from './stylistic.js';
import { getTypescriptEslintConfigs } from './typescript-eslint.js';
import { getUnicornConfigs } from './unicorn.js';

const createConfigs = ({
  files = [],
  isTests = false,
  shouldResolveAppRootDir = false,
  tsconfigRootDir,
}: {
  files?: string[];
  isTests?: boolean;
  tsconfigRootDir?: string;
  shouldResolveAppRootDir?: boolean;
} = {}): Linter.Config[] =>
  match(files?.length ?? 0)
    .with(0, () => [])
    .otherwise(() =>
      defineConfig([
        ...getEslintConfigs({ isTests, sources: files }),
        ...getTypescriptEslintConfigs({ isTests, sources: files }),
        ...getUnicornConfigs({ isTests, sources: files }),
        ...getSimpleImportSortConfigs({ sources: files }),
        ...getStylisticConfigs({ isTests, sources: files }),
      ]).map((config) =>
        setTsconfigRootDir({
          config,
          shouldResolveAppRootDir,
          sources: files,
          tsconfigRootDir,
        }),
      ),
    );

export const createTypeScriptConfigBlock = ({
  shouldResolveAppRootDir = false,
  sources = [],
  tsconfigRootDir,
}: TypeScriptConfigOptions = {}): ConfigBlock => ({
  [SOURCES]: createConfigs({
    files: sources,
    isTests: false,
    shouldResolveAppRootDir,
    tsconfigRootDir,
  }),
});

export const createTypeScriptTestsConfigBlock = ({
  shouldResolveAppRootDir = false,
  sources: tests,
  tsconfigRootDir,
}: TypeScriptTestConfigOptions = {}): ConfigBlock => ({
  [TESTS]: createConfigs({
    files: tests,
    isTests: true,
    shouldResolveAppRootDir,
    tsconfigRootDir,
  }),
});
