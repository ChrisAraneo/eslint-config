import eslint from '@eslint/js';
import type { Linter } from 'eslint';
import { chain, isEmpty } from 'lodash-es';

export const getEslintConfigs = (
  sources?: string[],
  isTests?: boolean,
): Linter.Config[] =>
  isEmpty(sources)
    ? []
    : [
        chain({ errorWhenNotTests: !isTests ? 'error' : 'off' })
          .thru(({ errorWhenNotTests }) => ({
            files: sources,
            rules: {
              ...eslint.configs.all.rules,
              'id-length': 'off',
              'init-declarations': errorWhenNotTests,
              'max-lines-per-function': errorWhenNotTests,
              'max-params': ['error', 6],
              'max-statements': isTests ? 'off' : ['error', 15],
              'new-cap': 'off',
              'no-await-in-loop': 'off',
              'no-duplicate-imports': 'off',
              'no-magic-numbers': 'off',
              'no-plusplus': 'off',
              'no-ternary': 'off',
              'no-underscore-dangle': 'off',
              'no-unused-vars': 'off',
              'no-void': 'off',
              'no-warning-comments': 'off',
              'one-var': 'off',
              'sort-imports': 'off',
              'sort-keys': 'off',
              'sort-vars': 'off',
            },
          }))
          .value() as unknown as Linter.Config,
      ];
