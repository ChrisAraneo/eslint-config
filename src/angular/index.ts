import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';
import { InfiniteDepthConfigWithExtends } from 'typescript-eslint';

import createJsonConfigs from '../json/index.js';
import { createTypeScriptConfigs } from '../typescript/index.js';
import { isEmpty } from '../utils.js';
import { getAngularSourcesConfigs } from './angular-eslint.js';
import { getAngularTemplatesConfigs } from './angular-eslint-template.js';

export default (
  prefix = 'app',
  sources: string[] = [],
  templates: string[] = [],
  jsons: string[] = [],
  ignored?: string[],
): InfiniteDepthConfigWithExtends[] => {
  const configs: Linter.Config[] = [];

  if (!isEmpty(sources)) {
    configs.push(...createTypeScriptConfigs(sources));
    configs.push(...getAngularSourcesConfigs(prefix, sources));
  }

  if (!isEmpty(templates)) {
    configs.push(...getAngularTemplatesConfigs(templates));
  }

  if (!isEmpty(jsons)) {
    configs.push(...createJsonConfigs(jsons));
  }

  if (!isEmpty(ignored)) {
    configs.push({
      ignores: ignored,
    });
  }

  return defineConfig(configs);
};
