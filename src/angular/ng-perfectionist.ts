import ngPerfectionist from '@chris.araneo/eslint-plugin-ng-perfectionist';
import angular from 'angular-eslint';
import type { Linter } from 'eslint';
import { match } from 'ts-pattern';

interface Input {
  sources?: string[];
}

export const getNgPerfectionistConfigs = ({
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
