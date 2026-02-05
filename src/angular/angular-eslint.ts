import angular from 'angular-eslint';
import type { Linter } from 'eslint';
import { isEmpty } from 'lodash';

export const getAngularSourcesConfigs = (
  prefix?: string,
  sources?: string[],
): Linter.Config[] =>
  isEmpty(sources)
    ? []
    : angular.configs.tsAll.map(
        (config) =>
          ({
            ...config,
            files: sources,
            rules: {
              ...config.rules,
              '@angular-eslint/component-selector': [
                'error',
                {
                  prefix: prefix ?? 'app',
                  style: 'kebab-case',
                  type: 'element',
                },
              ],
              '@angular-eslint/directive-selector': [
                'error',
                {
                  prefix: prefix ?? 'app',
                  style: 'camelCase',
                  type: 'attribute',
                },
              ],
              '@angular-eslint/no-forward-ref': 'off',
              '@angular-eslint/prefer-on-push-component-change-detection':
                'off',
              '@angular-eslint/prefer-output-emitter-ref': 'off',
              '@angular-eslint/prefer-signals': 'off',
            },
          }) as Linter.Config,
      );
