import angular from 'angular-eslint';
import type { Linter } from 'eslint';
import { match } from 'ts-pattern';

export const getAngularTemplatesConfigs = (
  templates?: string[],
): Linter.Config[] =>
  match(templates?.length ?? 0)
    .with(0, () => [])
    .otherwise(() => [
      ...angular.configs.templateAll.map(
        (config) =>
          ({
            ...config,
            files: templates,
            rules: {
              ...config.rules,
              '@angular-eslint/template/i18n': 'off',
              '@angular-eslint/template/no-call-expression': 'off',
              '@angular-eslint/template/prefer-control-flow': 'off',
            },
          }) as Linter.Config,
      ),
    ]);
