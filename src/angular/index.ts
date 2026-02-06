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
  ],
  [TEMPLATES]: getAngularTemplatesConfigs(templates),
  [TESTS]: [...(createTypeScriptTestsConfigBlock(tests)[TESTS] || [])],
});
