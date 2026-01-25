import angular from 'angular-eslint';
import type { Linter } from 'eslint';

export const getAngularTemplatesConfigs = (
  templates: string[],
): Linter.Config[] =>
  angular.configs.templateAll.map(
    (config) =>
      ({
        ...config,
        files: templates,
        ...(config.plugins && { plugins: config.plugins }),
        rules: {
          ...config.rules,
          '@angular-eslint/template/i18n': 'off',
          '@angular-eslint/template/prefer-control-flow': 'off',
        },
      }) as Linter.Config,
  );
