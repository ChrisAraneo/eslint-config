import json from '@eslint/json';
import type { Linter } from 'eslint';
import jsonc from 'eslint-plugin-jsonc';
import * as jsoncParser from 'jsonc-eslint-parser';
import { match } from 'ts-pattern';

interface Input {
  jsons?: string[];
}

export const getJsoncConfigs = ({ jsons = [] }: Input = {}): Linter.Config[] =>
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
          ...(jsonc.configs['flat/recommended-with-jsonc'] as any).rules,
          'jsonc/array-bracket-newline': 'off',
          'jsonc/array-bracket-spacing': 'off',
          'jsonc/array-element-newline': 'off',
          'jsonc/auto': 'off',
          'jsonc/comma-dangle': 'off',
          'jsonc/comma-style': 'off',
          'jsonc/indent': 'off',
          'jsonc/key-name-casing': 'off',
          'jsonc/key-spacing': 'off',
          'jsonc/no-bigint-literals': 'off',
          'jsonc/no-binary-expression': 'off',
          'jsonc/no-binary-numeric-literals': 'off',
          'jsonc/no-comments': 'error',
          'jsonc/no-dupe-keys': 'error',
          'jsonc/no-escape-sequence-in-identifier': 'off',
          'jsonc/no-floating-decimal': 'off',
          'jsonc/no-hexadecimal-numeric-literals': 'off',
          'jsonc/no-infinity': 'off',
          'jsonc/no-irregular-whitespace': 'off',
          'jsonc/no-multi-str': 'off',
          'jsonc/no-nan': 'off',
          'jsonc/no-number-props': 'off',
          'jsonc/no-numeric-separators': 'off',
          'jsonc/no-octal': 'off',
          'jsonc/no-octal-escape': 'off',
          'jsonc/no-octal-numeric-literals': 'off',
          'jsonc/no-parenthesized': 'off',
          'jsonc/no-plus-sign': 'off',
          'jsonc/no-regexp-literals': 'off',
          'jsonc/no-sparse-arrays': 'off',
          'jsonc/no-template-literals': 'off',
          'jsonc/no-undefined-value': 'off',
          'jsonc/no-unicode-codepoint-escapes': 'off',
          'jsonc/no-useless-escape': 'off',
          'jsonc/object-curly-newline': 'off',
          'jsonc/object-curly-spacing': 'off',
          'jsonc/object-property-newline': 'off',
          'jsonc/quote-props': 'off',
          'jsonc/quotes': 'off',
          'jsonc/sort-array-values': 'off',
          'jsonc/sort-keys': 'error',
          'jsonc/space-unary-ops': 'off',
          'jsonc/valid-json-number': 'error',
          'jsonc/vue-custom-block/no-parsing-error': 'off',
        },
      },
    ]);
