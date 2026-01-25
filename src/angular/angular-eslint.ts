import angular from 'angular-eslint';
import type { Linter } from 'eslint';

export const getAngularSourcesConfigs = (
  prefix: string,
  sources: string[],
): Linter.Config[] =>
  angular.configs.tsAll.map(
    (config) =>
      ({
        ...config,
        files: sources,
        languageOptions: {
          ...config.languageOptions,
          parserOptions: {
            allowAutomaticSingleRunInference: true,
            projectService: true,
          },
        },
        ...(config.plugins && { plugins: config.plugins }),
        processor: config.processor,
        rules: {
          ...config.rules,
          '@angular-eslint/component-selector': [
            'error',
            {
              prefix,
              style: 'kebab-case',
              type: 'element',
            },
          ],
          '@angular-eslint/directive-selector': [
            'error',
            {
              prefix,
              style: 'camelCase',
              type: 'attribute',
            },
          ],
          '@angular-eslint/no-forward-ref': 'off',
          '@angular-eslint/prefer-on-push-component-change-detection': 'off',
          '@angular-eslint/prefer-output-emitter-ref': 'off',
          '@angular-eslint/prefer-signals': 'off',
        },
      }) as Linter.Config,
  );
