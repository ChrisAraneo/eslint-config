import tseslint from 'typescript-eslint';
import createJsonConfigs from './src/json.js';
import createAngularConfigs from './src/angular.js';
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
  } = {
    jsons: [],
    sources: [],
    tests: [],
    templates: [],
    angularElementPrefix: 'app',
    ignored: [],
  },
) => {
  const { jsons, sources, tests, templates, ignored } = input;

  return tseslint.config(
    ...createJsonConfigs(jsons),
    ...createAngularConfigs(sources, templates),
    ...createTypeScriptConfigs(sources),
    ...createTypeScriptTestsConfigs(tests),
    {
      ignores: ignored || DEFAULT_IGNORED_FILES,
    },
  );
};
