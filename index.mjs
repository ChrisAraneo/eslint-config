import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import eslintPluginJsonc from 'eslint-plugin-jsonc';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import jsoncParser from 'jsonc-eslint-parser';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

export default (jsonFiles, sourceFiles, htmlFiles, ignoredFiles) => {
  return tseslint.config(
    ...eslintPluginJsonc.configs['flat/recommended-with-jsonc'],
    {
      files: jsonFiles,
      languageOptions: {
        parser: jsoncParser,
      },
    },
    {
      files: sourceFiles,
      extends: [eslint.configs.all, ...tseslint.configs.all],
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        },
      },
      rules: {
        'new-cap': 'off',
        'sort-imports': 'off',
        'sort-keys': 'off',
        '@typescript-eslint/init-declarations': 'off',
        '@typescript-eslint/parameter-properties': 'off',
        '@typescript-eslint/explicit-member-accessibility': [
          'error',
          {
            accessibility: 'no-public',
          },
        ],
        '@typescript-eslint/no-extraneous-class': 'off',
      },
    },
    {
      files: sourceFiles,
      extends: [...angular.configs.tsAll],
      processor: angular.processInlineTemplates,
      rules: {
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'app',
            style: 'camelCase',
          },
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'app',
            style: 'kebab-case',
          },
        ],
        '@angular-eslint/template/prefer-control-flow': 'off',
      },
    },
    {
      languageOptions: {
        globals: globals.builtin,
      },
      extends: [eslintPluginUnicorn.configs.all],
    },
    {
      files: sourceFiles,
      plugins: {
        'simple-import-sort': simpleImportSort,
      },
      rules: {
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
      },
    },
    {
      files: htmlFiles,
      extends: [...angular.configs.templateAll],
    },
    {
      ignores: ignoredFiles || [
        'node_modules/',
        'reports/',
        '.stryker-tmp/',
        '.angular',
        'package.json',
        'package-lock.json',
      ],
    },
  );
};
