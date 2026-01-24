import eslint from '@eslint/js';
import { get as getAppRootDir } from 'app-root-dir';
import { defineConfig } from 'eslint/config';
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
  shouldResolveAppRootDir?: boolean,
): InfiniteDepthConfigWithExtends[] => {
  if (isEmpty(sources)) {
    return [];
  }

  const errorWhenNotTests = !isTests ? 'error' : 'off';
  const warnWhenNotTests = !isTests ? 'warn' : 'off';

  const parserOptions = {
    allowAutomaticSingleRunInference: true,
    projectService: true,
  };

  if (tsconfigRootDir && !shouldResolveAppRootDir) {
    Object.assign(parserOptions, { tsconfigRootDir });
  } else if (shouldResolveAppRootDir) {
    Object.assign(parserOptions, { tsconfigRootDir: getAppRootDir() });
  }

  return defineConfig([
    {
      extends: [eslint.configs.all, ...tseslint.configs.all],
      files: sources,
      languageOptions: {
        parserOptions,
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
    {
      extends: [unicorn.configs.all],
      files: sources,
      languageOptions: {
        globals: globals.builtin,
      },
      rules: {
        'unicorn/import-style': 'off',
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
    {
      files: sources,
      plugins: { 'simple-import-sort': simpleImportSort },
      rules: {
        'simple-import-sort/exports': 'error',
        'simple-import-sort/imports': 'error',
      },
    },
  ]);
};

export const createTypeScriptConfigs = (
  sources: string[] = [],
  tsconfigRootDir?: string,
  shouldResolveAppRootDir?: boolean,
) => {
  return createConfigs(
    sources,
    false,
    tsconfigRootDir,
    shouldResolveAppRootDir,
  );
};

export const createTypeScriptTestsConfigs = (
  sources: string[] = [],
  tsconfigRootDir?: string,
) => {
  return createConfigs(sources, true, tsconfigRootDir);
};
