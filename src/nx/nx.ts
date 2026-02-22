import nx from '@nx/eslint-plugin';
import type { Linter } from 'eslint';
import { match } from 'ts-pattern';

export const getNxConfigs = (sources?: string[]): Linter.Config[] =>
  match(sources?.length ?? 0)
    .with(0, () => [])
    .otherwise(
      () =>
        [
          ...nx.configs['flat/base'],
          ...nx.configs['flat/typescript'],
          ...nx.configs['flat/javascript'],
          {
            files: sources,
            rules: {
              '@nx/enforce-module-boundaries': [
                'error',
                {
                  allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
                  depConstraints: [
                    {
                      onlyDependOnLibsWithTags: ['*'],
                      sourceTag: '*',
                    },
                  ],
                  enforceBuildableLibDependency: true,
                },
              ],
            },
          },
        ] as Linter.Config[],
    );
