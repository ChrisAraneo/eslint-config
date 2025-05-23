import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import jsonc from 'eslint-plugin-jsonc';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import jsoncParser from 'jsonc-eslint-parser';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

const DEFAULT_IGNORED_FILES = [
  'node_modules/',
  'reports/',
  '.stryker-tmp/',
  '.angular',
  'package.json',
  'package-lock.json',
];

export default (
  jsons: string[] = [],
  sources: string[] = [],
  templates: string[] = [],
  ignored: string[],
) => {
  return tseslint.config(
    ...jsonc.configs['flat/recommended-with-jsonc'],
    {
      files: jsons,
      languageOptions: {
        parser: jsoncParser,
      },
    },
    {
      files: sources,
      extends: [eslint.configs.all, ...tseslint.configs.all],
      languageOptions: {
        parserOptions: {
          projectService: true,
          allowDefaultProject: ['./**/*.{js,mjs,cjs,ts}'],
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
        'new-cap': 'off',
        'no-duplicate-imports': 'off',
        'one-var': 'off',
        'sort-imports': 'off',
        'sort-keys': 'off',
        'sort-vars': 'off',
        'no-ternary': 'off',
        'id-length': 'off',
        'no-warning-comments': 'off',
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'enumMember',
            format: ['PascalCase'],
          },
        ],
      },
    },
    {
      files: sources,
      extends: [...angular.configs.tsAll],
      processor: angular.processInlineTemplates,
      rules: {
        '@angular-eslint/component-selector': [
          'error',
          {
            prefix: 'app',
            style: 'kebab-case',
            type: 'element',
          },
        ],
        '@angular-eslint/directive-selector': [
          'error',
          {
            prefix: 'app',
            style: 'camelCase',
            type: 'attribute',
          },
        ],
        '@angular-eslint/prefer-on-push-component-change-detection': 'off',
        '@angular-eslint/prefer-signals': 'off',
        '@angular-eslint/prefer-output-emitter-ref': 'off',
        '@angular-eslint/no-forward-ref': 'off',
      },
    },
    {
      languageOptions: {
        globals: globals.builtin,
      },
      extends: [unicorn.configs.all],
      rules: {
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/prefer-global-this': 'off',
        'unicorn/no-null': 'off',
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
    {
      files: templates,
      extends: [...angular.configs.templateAll],
      rules: {
        '@angular-eslint/template/prefer-control-flow': 'off',
        '@angular-eslint/template/i18n': 'off',
      },
    },
    {
      ignores: ignored || DEFAULT_IGNORED_FILES,
    },
  );
};
