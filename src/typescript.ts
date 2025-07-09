import eslint from '@eslint/js';
import { get as getAppRootDir } from 'app-root-dir';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { InfiniteDepthConfigWithExtends } from 'typescript-eslint';

import { isEmpty } from './utils.js';

const createConfigs = (
  sources: string[] = [],
  isTests = false,
  tsconfigRootDir?: string,
): InfiniteDepthConfigWithExtends[] => {
  if (isEmpty(sources)) {
    return [];
  }
  const errorWhenNotTests = !isTests ? 'error' : 'off';
  const warnWhenNotTests = !isTests ? 'warn' : 'off';
  return [
    {
      extends: [eslint.configs.all, ...tseslint.configs.all],
      files: sources,
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: tsconfigRootDir || getAppRootDir(),
        },
      },
      rules: {
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
          'error',
          { format: ['strictCamelCase'], selector: 'default' },
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
            prefix: ['is', 'has', 'are', 'can', 'should', 'did', 'will'],
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
            prefix: ['is', 'has', 'are', 'can', 'should', 'did', 'will'],
            selector: ['property'],
            types: ['boolean'],
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
        '@typescript-eslint/parameter-properties': 'off',
        '@typescript-eslint/prefer-destructuring': errorWhenNotTests,
        '@typescript-eslint/prefer-readonly-parameter-types': 'off',
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/strict-boolean-expressions': 'off',
        'id-length': 'off',
        'max-lines-per-function': errorWhenNotTests,
        'max-params': ['error', { max: 6 }],
        'max-statements': ['error', { ignoreTopLevelFunctions: true, max: 15 }],
        'new-cap': 'off',
        'no-duplicate-imports': 'off',
        'no-magic-numbers': 'off',
        'no-ternary': 'off',
        'no-underscore-dangle': 'off',
        'no-warning-comments': 'off',
        'one-var': 'off',
        'sort-imports': 'off',
        'sort-keys': 'off',
        'sort-vars': 'off',
      },
    },
    {
      extends: [unicorn.configs.all],
      files: sources,
      languageOptions: { globals: globals.builtin },
      rules: {
        'unicorn/no-null': 'off',
        'unicorn/prefer-global-this': 'off',
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/template-indent': 'off',
      },
    },
    {
      files: sources,
      plugins: { 'simple-import-sort': simpleImportSort },
      rules: {
        'simple-import-sort/exports': 'error',
        'simple-import-sort/imports': 'error',
      },
    },
  ];
};
export const createTypeScriptConfigs = (
  sources: string[] = [],
  tsconfigRootDir?: string,
) => {
  return createConfigs(sources, false, tsconfigRootDir);
};
export const createTypeScriptTestsConfigs = (
  sources: string[] = [],
  tsconfigRootDir?: string,
) => {
  return createConfigs(sources, true, tsconfigRootDir);
};
