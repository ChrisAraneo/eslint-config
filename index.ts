import createAngularConfigs from './src/angular.js';
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

export default {
  createAngularConfigs: (
    sources: string[],
    templates: string[],
    jsons: string[],
    angularElementPrefix: string,
    ignored?: string[],
  ) =>
    createAngularConfigs(
      sources,
      templates,
      jsons,
      angularElementPrefix,
      ignored ?? DEFAULT_IGNORED_FILES,
    ),
  createJsonConfigs: (jsons: string[], ignored?: string[]) =>
    createJsonConfigs(jsons, ignored),
  createTypeScriptConfigs: (
    sources: string[],
    tsconfigRootDir?: string,
    shouldResolveAppRootDir?: boolean,
  ) =>
    createTypeScriptConfigs(sources, tsconfigRootDir, shouldResolveAppRootDir),
  createTypeScriptTestsConfigs: (tests: string[], tsconfigRootDir?: string) =>
    createTypeScriptTestsConfigs(tests, tsconfigRootDir),
};
