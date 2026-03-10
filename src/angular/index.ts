import { setTsconfigRootDir } from 'src/utils/set-tsconfig-root-dir.js';

import {
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
import { getAngularSourcesConfigs } from './angular-eslint.js';
import { getAngularTemplatesConfigs } from './angular-eslint-template.js';

export const createAngularConfigBlock = (
  prefix = 'app',
  sources: string[] = [],
  tests: string[] = [],
  templates: string[] = [],
  jsons: string[] = [],
  ignored?: string[],
  tsconfigRootDir?: string,
  shouldResolveAppRootDir = false,
): ConfigBlock => ({
  [IGNORED]: [
    {
      ignores: ignored,
    },
  ],
  [JSONS]: getJsoncConfigs(jsons),
  [SOURCES]: [
    ...(createTypeScriptConfigBlock(sources)[SOURCES] || []),
    ...getAngularSourcesConfigs(prefix, sources),
  ].map((config) =>
    setTsconfigRootDir(
      config,
      sources,
      tsconfigRootDir,
      shouldResolveAppRootDir,
    ),
  ),
  [TEMPLATES]: getAngularTemplatesConfigs(templates),
  [TESTS]: [...(createTypeScriptTestsConfigBlock(tests)[TESTS] || [])].map(
    (config) =>
      setTsconfigRootDir(
        config,
        tests,
        tsconfigRootDir,
        shouldResolveAppRootDir,
      ),
  ),
});
