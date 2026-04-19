import ngPerfectionist from '@chris.araneo/eslint-plugin-ng-perfectionist';
import angular from 'angular-eslint';
import type { Linter } from 'eslint';
import { match } from 'ts-pattern';

interface Input {
  prefix?: string;
  sources?: string[];
}

export const getAngularSourcesConfigs = ({
  prefix,
  sources,
}: Input = {}): Linter.Config[] =>
  match(sources?.length ?? 0)
    .with(0, () => [])
    .otherwise(() =>
      angular.configs.tsAll.map(
        (config) =>
          ({
            ...config,
            files: sources,
            plugins: {
              ...config.plugins,
              '@chris.araneo/ng-perfectionist': ngPerfectionist,
            },
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
              '@chris.araneo/ng-perfectionist/sort-component-imports': 'error',
              '@chris.araneo/ng-perfectionist/sort-component-style-urls':
                'error',
              '@chris.araneo/ng-perfectionist/sort-ng-module-declarations':
                'error',
              '@chris.araneo/ng-perfectionist/sort-ng-module-exports': 'error',
              '@chris.araneo/ng-perfectionist/sort-ng-module-imports': 'error',
            },
          }) as Linter.Config,
      ),
    );
