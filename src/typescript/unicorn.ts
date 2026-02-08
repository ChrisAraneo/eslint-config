import type { Linter } from 'eslint';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import { isEmpty } from 'lodash-es';

export const getUnicornConfigs = (sources?: string[]): Linter.Config[] =>
  isEmpty(sources)
    ? []
    : [
        {
          ...unicorn.configs.all,
          files: sources,
          languageOptions: {
            ...unicorn.configs.all.languageOptions,
            globals: globals.builtin,
          },
          rules: {
            ...unicorn.configs.all.rules,
            'unicorn/import-style': 'off',
            'unicorn/new-for-builtins': 'off',
            'unicorn/no-array-for-each': 'off',
            'unicorn/no-array-reduce': 'off',
            'unicorn/no-for-loop': 'error',
            'unicorn/no-null': 'off',
            'unicorn/number-literal-case': 'off',
            'unicorn/prefer-global-this': 'off',
            'unicorn/prefer-ternary': 'off',
            'unicorn/prevent-abbreviations': 'off',
            'unicorn/template-indent': 'off',
          },
        },
      ];
