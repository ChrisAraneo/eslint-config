import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import eslintPluginJsonc from 'eslint-plugin-jsonc';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import jsoncParser from 'jsonc-eslint-parser';

export default (jsonFiles, sourceFiles, htmlFiles) => {
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
        '@typescript-eslint/no-extraneous-class': 'off',
      },
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
      ignores: [
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
