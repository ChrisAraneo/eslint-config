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
      ),
    );
