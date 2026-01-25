import angular from 'angular-eslint';
import type { Linter } from 'eslint';

import { getEslintConfigRuleKeys } from '../typescript/eslint.js';
import { getTypescriptEslintConfigRuleKeys } from '../typescript/typescript-eslint.js';
import { getAngularSourcesConfigsRuleKeys } from './angular-eslint.js';

export const getAngularTemplatesConfigs = (
  templates: string[],
): Linter.Config[] => [
  ...angular.configs.templateAll.map(
    (config) =>
      ({
        ...config,
        files: templates,
        rules: {
          ...config.rules,
          '@angular-eslint/template/i18n': 'off',
          '@angular-eslint/template/prefer-control-flow': 'off',
        },
      }) as Linter.Config,
  ),
  getDisabledSourceRules(templates),
];

const getDisabledSourceRules = (templates: string[]) =>
  ({
    files: templates,
    rules: [
      ...getEslintConfigRuleKeys(),
      ...getTypescriptEslintConfigRuleKeys(),
      ...getAngularSourcesConfigsRuleKeys(),
    ].reduce((acc, key) => ({ ...acc, [key]: 'off' }), {}),
  }) as Linter.Config;
