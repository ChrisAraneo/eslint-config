import angular from 'angular-eslint';
import type { Linter } from 'eslint';

import { getTypescriptEslintConfig } from '../typescript/typescript-eslint.js';

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
  // Ensure template files don't inherit TypeScript-specific rules
  {
    files: templates,
    rules: Object.keys(
      getTypescriptEslintConfig(templates, {}, false).rules ?? {},
    ).reduce(
      (acc, key) => ({ ...acc, [key]: 'off' }),
      {} as Record<string, string>,
    ),
  } as Linter.Config,
];
