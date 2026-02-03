import json from '@eslint/json';
import type { Linter } from 'eslint';
import jsonc from 'eslint-plugin-jsonc';
import jsoncParser from 'jsonc-eslint-parser';

export const getJsoncConfig = (jsons: string[]): Linter.Config[] => [
  {
    files: jsons,
    languageOptions: {
      parser: jsoncParser,
    },
    plugins: {
      json,
      jsonc,
    } as Linter.Config['plugins'],
    rules: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(jsonc.configs['flat/recommended-with-jsonc'] as any).rules,
      'jsonc/no-comments': 'error',
      'jsonc/no-dupe-keys': 'error',
      'jsonc/sort-keys': 'error',
      'jsonc/valid-json-number': 'error',
    },
  },
];
