import json from '@eslint/json';
import type { Linter } from 'eslint';
import jsonc from 'eslint-plugin-jsonc';
import jsoncParser from 'jsonc-eslint-parser';
import { match } from 'ts-pattern';

export const getJsoncConfigs = (jsons?: string[]): Linter.Config[] =>
  match(jsons?.length ?? 0)
    .with(0, () => [])
    .otherwise(() => [
      {
        files: jsons,
        languageOptions: {
          parser: jsoncParser,
        },
        plugins: {
          json,
          jsonc,
        } as unknown as Linter.Config['plugins'],
        rules: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(jsonc.configs['flat/recommended-with-jsonc'] as any).rules,
          'jsonc/no-comments': 'error',
          'jsonc/no-dupe-keys': 'error',
          'jsonc/sort-keys': 'error',
          'jsonc/valid-json-number': 'error',
        },
      },
    ]);
