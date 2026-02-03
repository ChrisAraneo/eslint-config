import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';
import { getEslintConfigRuleKeys } from 'src/typescript/eslint.js';
import { getTypescriptEslintConfigRuleKeys } from 'src/typescript/typescript-eslint.js';
import { InfiniteDepthConfigWithExtends } from 'typescript-eslint';

import createJsonConfigs from '../json/index.js';
import { createTypeScriptConfigs } from '../typescript/index.js';
import { isEmpty } from '../utils.js';
import {
  getAngularSourcesConfigs,
  getAngularSourcesConfigsRuleKeys,
} from './angular-eslint.js';
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
    configs.push(
      ...([
        ...getAngularTemplatesConfigs(templates),
        getDisabledSourceRules(templates),
      ] as Linter.Config[]),
    );
  }

  if (!isEmpty(jsons)) {
    configs.push(
      ...[...createJsonConfigs(jsons), getDisabledSourceRules(jsons)],
    );
  }

  if (!isEmpty(ignored)) {
    configs.push({
      ignores: ignored,
    });
  }

  return defineConfig(configs);
};

const getDisabledSourceRules = (files: string[]) =>
  ({
    files,
    rules: [
      ...getEslintConfigRuleKeys(),
      ...getTypescriptEslintConfigRuleKeys(),
      ...getAngularSourcesConfigsRuleKeys(),
    ].reduce((acc, key) => ({ ...acc, [key]: 'off' }), {}),
  }) as Linter.Config;
