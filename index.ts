import tseslint from 'typescript-eslint';
import createJsonConfigs from './src/json.js';
import createAngularConfigsWhenIsAngularApp from './src/angular.js';
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
    ignored: string[];
    tsconfigRootDir?: string;
    isAngularApp?: boolean;
  } = {
    jsons: [],
    sources: [],
    tests: [],
    templates: [],
    angularElementPrefix: 'app',
    ignored: [],
    isAngularApp: false,
  },
) => {
  const {
    jsons,
    sources,
    tests,
    templates,
    angularElementPrefix,
    ignored,
    isAngularApp,
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
    ...createTypeScriptConfigs(sources, tsconfigRootDir),
    ...createTypeScriptTestsConfigs(tests, tsconfigRootDir),
    {
      ignores: ignored || DEFAULT_IGNORED_FILES,
    },
  );
};
