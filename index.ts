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

function isNonEmptyStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === 'string')
  );
}

export default (
  input: {
    jsons: string[];
    sources: string[];
    tests: string[];
    templates: string[];
    angularElementPrefix: string;
    ignored: string[];
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
  const { jsons, sources, tests, templates, ignored, isAngularApp } = input;

  return tseslint.config(
    ...(isAngularApp && isNonEmptyStringArray(templates)
      ? createAngularConfigs(sources, templates)
      : []),
    ...(isNonEmptyStringArray(jsons) ? createJsonConfigs(jsons) : []),
    ...(isNonEmptyStringArray(sources) ? createTypeScriptConfigs(sources) : []),
    ...(isNonEmptyStringArray(tests)
      ? createTypeScriptTestsConfigs(tests)
      : []),
    {
      ignores: ignored || DEFAULT_IGNORED_FILES,
    },
  );
};
