import tseslint from 'typescript-eslint';

import createAngularConfigsWhenIsAngularApp from './src/angular.js';
import createJsonConfigs from './src/json.js';
import {
  createTypeScriptConfigs,
  createTypeScriptTestsConfigs,
} from './src/typescript.js';

const DEFAULT_IGNORED_FILES = [
  'node_modules/',
  'reports/',
  '.stryker-tmp/',
  '.angular',
  'package.json',
  'package-lock.json',
];

export default (
  input: {
    jsons: string[];
    sources: string[];
    tests: string[];
    templates: string[];
    angularElementPrefix: string;
    ignored?: string[];
    tsconfigRootDir?: string;
    isAngularApp?: boolean;
    shouldResolveAppRootDir?: boolean;
  } = {
    angularElementPrefix: 'app',
    isAngularApp: false,
    jsons: [],
    shouldResolveAppRootDir: false,
    sources: [],
    templates: [],
    tests: [],
  },
) => {
  const {
    angularElementPrefix,
    ignored,
    isAngularApp,
    jsons,
    shouldResolveAppRootDir,
    sources,
    templates,
    tests,
    tsconfigRootDir,
  } = input;

  return tseslint.config(
    ...createAngularConfigsWhenIsAngularApp(
      isAngularApp,
      sources,
      templates,
      angularElementPrefix,
    ),
    ...createJsonConfigs(jsons),
    ...createTypeScriptConfigs(
      sources,
      tsconfigRootDir,
      shouldResolveAppRootDir,
    ),
    ...createTypeScriptTestsConfigs(tests, tsconfigRootDir),
    {
      ignores: ignored ?? DEFAULT_IGNORED_FILES,
    },
  );
};
