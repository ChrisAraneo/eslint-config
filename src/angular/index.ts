import {
  AngularConfigOptions,
  ConfigBlock,
  IGNORED,
  JSONS,
  SOURCES,
  TEMPLATES,
  TESTS,
} from '../interfaces.js';
import { getJsoncConfigs } from '../json/jsonc.js';
import {
  createTypeScriptConfigBlock,
  createTypeScriptTestsConfigBlock,
} from '../typescript/index.js';
import { setTsconfigRootDir } from '../utils/set-tsconfig-root-dir.js';
import { getAngularSourcesConfigs } from './angular-eslint.js';
import { getAngularTemplatesConfigs } from './angular-eslint-template.js';

export const createAngularConfigBlock = ({
  ignored,
  jsons = [],
  prefix = 'app',
  shouldResolveAppRootDir = false,
  sources = [],
  templates = [],
  tests = [],
  tsconfigRootDir,
}: AngularConfigOptions = {}): ConfigBlock => ({
  [IGNORED]: [
    {
      ignores: ignored,
    },
  ],
  [JSONS]: getJsoncConfigs({ jsons }),
  [SOURCES]: [
    ...(createTypeScriptConfigBlock({ sources })[SOURCES] || []),
    ...getAngularSourcesConfigs({ prefix, sources }),
  ].map((config) =>
    setTsconfigRootDir({
      config,
      shouldResolveAppRootDir,
      sources,
      tsconfigRootDir,
    }),
  ),
  [TEMPLATES]: getAngularTemplatesConfigs({ templates }),
  [TESTS]: [
    ...(createTypeScriptTestsConfigBlock({ sources: tests })[TESTS] || []),
  ].map((config) =>
    setTsconfigRootDir({
      config,
      shouldResolveAppRootDir,
      sources: tests,
      tsconfigRootDir,
    }),
  ),
});
