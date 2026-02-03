import angular from 'angular-eslint';
import type { Linter } from 'eslint';

import { isEmpty } from '../utils.js';

export const getAngularTemplatesConfigs = (
  templates: string[],
): Linter.Config[] =>
  isEmpty(templates)
    ? []
    : [
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
      ];
