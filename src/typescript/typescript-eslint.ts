import type { Linter } from 'eslint';
import { isEmpty } from 'lodash';
import { CompatibleConfig } from 'node_modules/typescript-eslint/dist/compatibility-types.js';
import tseslint from 'typescript-eslint';

export const getTypescriptEslintConfigs = (
  sources: string[],
  parserOptions: Record<string, unknown>,
  isTests: boolean,
): Linter.Config[] => {
  const warnWhenNotTests = !isTests ? 'warn' : 'off';
  const errorWhenNotTests = !isTests ? 'error' : 'off';

  return isEmpty(sources)
    ? []
    : [
        {
          files: sources,
          languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
              ...parserOptions,
              allowAutomaticSingleRunInference: true,
              projectService: true,
            },
          },
          plugins: {
            '@typescript-eslint': tseslint.plugin,
          },
          rules: {
            ...tseslint.configs.strictTypeChecked
              .map((config: CompatibleConfig) => config.rules)
              .reduce((a, b) => ({ ...a, ...b }), {}),
            '@typescript-eslint/class-methods-use-this': 'off',
            '@typescript-eslint/consistent-type-imports': 'off',
            '@typescript-eslint/explicit-member-accessibility': [
              'error',
              { accessibility: 'no-public' },
            ],
            '@typescript-eslint/init-declarations': 'off',
            '@typescript-eslint/max-params': 'off',
            '@typescript-eslint/member-ordering': [
              'error',
              {
                default: {
                  memberTypes: [
                    'public-decorated-field',
                    'protected-decorated-field',
                    'private-decorated-field',
                    'public-static-field',
                    'protected-static-field',
                    'private-static-field',
                    'public-instance-field',
                    'protected-instance-field',
                    'private-instance-field',
                    'static-field',
                    'public-field',
                    'instance-field',
                    'protected-field',
                    'private-field',
                    'constructor',
                    'public-static-method',
                    'protected-static-method',
                    'private-static-method',
                    'public-method',
                    'protected-method',
                    'private-method',
                  ],
                },
              },
            ],
            '@typescript-eslint/naming-convention': [
              'warn',
              { format: ['strictCamelCase'], selector: 'default' },
              {
                filter: {
                  match: false,
                  regex: '^_+$',
                },
                format: ['strictCamelCase'],
                leadingUnderscore: 'allow',
                selector: 'parameter',
              },
              {
                custom: {
                  match: true,
                  regex: '^_+$',
                },
                format: null,
                selector: 'parameter',
              },
              {
                format: ['strictCamelCase', 'StrictPascalCase'],
                selector: ['function', 'import'],
              },
              {
                format: ['StrictPascalCase'],
                selector: ['typeLike'],
              },
              { format: ['PascalCase'], selector: 'enumMember' },
              {
                format: ['PascalCase'],
                modifiers: ['static'],
                selector: 'classProperty',
              },
              {
                format: ['PascalCase'],
                prefix: [
                  'is',
                  'has',
                  'are',
                  'can',
                  'should',
                  'did',
                  'will',
                  'with',
                ],
                selector: ['variable', 'parameter', 'accessor'],
                types: ['boolean'],
              },
              {
                format: null,
                modifiers: ['requiresQuotes'],
                selector: ['objectLiteralProperty'],
              },
              {
                filter: {
                  match: false,
                  regex:
                    '^(allowfullscreen|allowFullScreen|async|autofocus|autoFocus|autoplay|autoPlay|checked|defaultChecked|contenteditable|contentEditable|controls|default|defer|disabled|draggable|formnovalidate|formNoValidate|hidden|inert|ismap|itemscope|itemScope|loop|multiple|muted|nomodule|noModule|novalidate|noValidate|open|playsinline|playsInline|readonly|readOnly|required|reversed|selected|spellcheck|spellCheck)$',
                },
                format: ['PascalCase'],
                prefix: [
                  'is',
                  'has',
                  'are',
                  'can',
                  'should',
                  'did',
                  'will',
                  'with',
                ],
                selector: ['property'],
                types: ['boolean'],
              },
              {
                format: ['UPPER_CASE'],
                leadingUnderscore: 'allow',
                modifiers: ['const', 'global'],
                prefix: [
                  'IS_',
                  'HAS_',
                  'ARE_',
                  'CAN_',
                  'SHOULD_',
                  'DID_',
                  'WILL_',
                  'WITH_',
                ],
                selector: 'variable',
                types: ['boolean'],
              },
              {
                format: ['UPPER_CASE'],
                leadingUnderscore: 'allow',
                modifiers: ['const', 'global'],
                selector: 'variable',
                types: ['string', 'number', 'array'],
              },
              {
                format: ['UPPER_CASE'],
                modifiers: ['const', 'global'],
                selector: 'default',
              },
              {
                format: ['strictCamelCase'],
                modifiers: ['const', 'global'],
                selector: 'variable',
                types: ['function'],
              },
            ],
            '@typescript-eslint/no-confusing-void-expression': 'off',
            '@typescript-eslint/no-explicit-any': errorWhenNotTests,
            '@typescript-eslint/no-extraneous-class': 'off',
            '@typescript-eslint/no-magic-numbers': [
              errorWhenNotTests,
              {
                ignoreEnums: true,
                ignoreNumericLiteralTypes: true,
                ignoreReadonlyClassProperties: true,
                ignoreTypeIndexes: true,
              },
            ],
            '@typescript-eslint/no-non-null-assertion': errorWhenNotTests,
            '@typescript-eslint/no-unsafe-assignment': errorWhenNotTests,
            '@typescript-eslint/no-unsafe-call': errorWhenNotTests,
            '@typescript-eslint/no-unsafe-function-type': errorWhenNotTests,
            '@typescript-eslint/no-unsafe-member-access': errorWhenNotTests,
            '@typescript-eslint/no-unsafe-return': errorWhenNotTests,
            '@typescript-eslint/no-unsafe-type-assertion': warnWhenNotTests,
            '@typescript-eslint/no-unused-vars': [
              'error',
              {
                args: 'all',
                argsIgnorePattern: '^_',
                caughtErrors: 'all',
                caughtErrorsIgnorePattern: '^_',
                destructuredArrayIgnorePattern: '^_',
                ignoreRestSiblings: true,
                varsIgnorePattern: '^_',
              },
            ],
            '@typescript-eslint/parameter-properties': 'off',
            '@typescript-eslint/prefer-destructuring': errorWhenNotTests,
            '@typescript-eslint/prefer-readonly-parameter-types': 'off',
            '@typescript-eslint/require-await': 'off',
            '@typescript-eslint/strict-boolean-expressions': 'off',
          },
        },
      ];
};
