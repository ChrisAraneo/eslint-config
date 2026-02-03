import { defineConfig } from 'eslint/config';
import { InfiniteDepthConfigWithExtends } from 'typescript-eslint';

import createJsonConfigs from '../json/index.js';
import { createTypeScriptConfigs } from '../typescript/index.js';
import { addCrossConfigOffRules } from '../utils.js';
import { getAngularSourcesConfigs } from './angular-eslint.js';
import { getAngularTemplatesConfigs } from './angular-eslint-template.js';

export default (
  prefix = 'app',
  sources: string[] = [],
  templates: string[] = [],
  jsons: string[] = [],
  ignored?: string[],
): InfiniteDepthConfigWithExtends[] =>
  defineConfig(
    addCrossConfigOffRules(
      {
        ignored: [
          {
            ignores: ignored,
          },
        ],
        json: createJsonConfigs(jsons),
        sources: [
          ...createTypeScriptConfigs(sources),
          ...getAngularSourcesConfigs(prefix, sources),
        ],
        templates: getAngularTemplatesConfigs(templates),
      },
      { order: ['sources', 'templates', 'json', 'ignored'] },
    ),
  );
