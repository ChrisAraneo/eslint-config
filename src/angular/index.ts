import {
  ConfigBlock,
  IGNORED,
  JSONS,
  SOURCES,
  TEMPLATES,
} from 'src/interfaces.js';
import { getJsoncConfigs } from 'src/json/jsonc.js';

import { createTypeScriptConfigBlock } from '../typescript/index.js';
import { getAngularSourcesConfigs } from './angular-eslint.js';
import { getAngularTemplatesConfigs } from './angular-eslint-template.js';

export const createAngularConfigBlock = (
  prefix = 'app',
  sources: string[] = [],
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
});
