import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import { InfiniteDepthConfigWithExtends } from 'typescript-eslint';

const createConfigs = (
  sources: string[] = [],
  isTests: boolean = false,
): InfiniteDepthConfigWithExtends[] => {
  const errorWhenNotTests = !isTests ? 'error' : 'off';

  return [
    {
      files: sources,
      extends: [eslint.configs.all, ...tseslint.configs.all],
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: (import.meta as any).dirname,
        },
      },
      rules: {
        '@typescript-eslint/explicit-member-accessibility': [
          'error',
          {
            accessibility: 'no-public',
          },
        ],
        '@typescript-eslint/init-declarations': 'off',
        '@typescript-eslint/no-extraneous-class': 'off',
        '@typescript-eslint/parameter-properties': 'off',
        '@typescript-eslint/consistent-type-imports': 'off',
        '@typescript-eslint/no-confusing-void-expression': 'off',
        '@typescript-eslint/class-methods-use-this': 'off',
        '@typescript-eslint/prefer-readonly-parameter-types': 'off',
        '@typescript-eslint/strict-boolean-expressions': 'off',
        '@typescript-eslint/no-unsafe-type-assertion': 'warn',
        '@typescript-eslint/no-non-null-assertion': errorWhenNotTests,
        '@typescript-eslint/no-magic-numbers': errorWhenNotTests,
        '@typescript-eslint/no-unsafe-return': errorWhenNotTests,
        '@typescript-eslint/no-unsafe-function-type': errorWhenNotTests,
        '@typescript-eslint/no-unsafe-call': errorWhenNotTests,
        '@typescript-eslint/no-unsafe-member-access': errorWhenNotTests,
        '@typescript-eslint/no-unsafe-assignment': errorWhenNotTests,
        '@typescript-eslint/no-explicit-any': errorWhenNotTests,
        'max-lines-per-function': errorWhenNotTests,
        '@typescript-eslint/prefer-destructuring': errorWhenNotTests,
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
          {
            selector: 'enumMember',
            format: ['PascalCase'],
          },
        ],
        'new-cap': 'off',
        'no-duplicate-imports': 'off',
        'one-var': 'off',
        'sort-imports': 'off',
        'sort-keys': 'off',
        'sort-vars': 'off',
        'no-ternary': 'off',
        'id-length': 'off',
        'no-warning-comments': 'off',
        'no-underscore-dangle': 'off',
      },
    },
    {
      files: sources,
      languageOptions: {
        globals: globals.builtin,
      },
      extends: [unicorn.configs.all],
      rules: {
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/prefer-global-this': 'off',
        'unicorn/no-null': 'off',
        'unicorn/template-indent': 'off',
      },
    },
    {
      files: sources,
      plugins: {
        'simple-import-sort': simpleImportSort,
      },
      rules: {
        'simple-import-sort/exports': 'error',
        'simple-import-sort/imports': 'error',
      },
    },
  ];
};

export const createTypeScriptConfigs = (sources: string[] = []) => {
  return createConfigs(sources, false);
};

export const createTypeScriptTestsConfigs = (sources: string[] = []) => {
  return createConfigs(sources, true);
};
