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
        'new-cap': 'off',
        'no-duplicate-imports': 'off',
        'one-var': 'off',
        'sort-imports': 'off',
        'sort-keys': 'off',
        'sort-vars': 'off',
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
        '@angular-eslint/template/i18n': 'off',
      },
    },
    {
      languageOptions: {
        globals: globals.builtin,
      },
      extends: [unicorn.configs.all],
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
      },
    },
    {
      ignores: ignored || DEFAULT_IGNORED_FILES,
    },
  );
};
