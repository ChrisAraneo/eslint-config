import eslint from '@eslint/js';
import type { Linter } from 'eslint';
import { isEmpty } from 'lodash';

export const getEslintConfigs = (
  sources?: string[],
  isTests?: boolean,
): Linter.Config[] => {
  const errorWhenNotTests = !isTests ? 'error' : 'off';

  return isEmpty(sources)
    ? []
    : [
        {
          files: sources,
          rules: {
            ...eslint.configs.all.rules,
            'id-length': 'off',
            'max-lines-per-function': errorWhenNotTests,
            'max-params': ['error', 6],
            'max-statements': ['error', 15],
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
        },
      ];
};
