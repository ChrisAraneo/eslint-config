import angular from 'angular-eslint';
import { InfiniteDepthConfigWithExtends } from 'typescript-eslint';

import { isEmpty } from './utils.js';

export default (
  isAngularApp = false,
  sources: string[] = [],
  templates: string[] = [],
  prefix = 'app',
): InfiniteDepthConfigWithExtends[] => {
  if (!isAngularApp) {
    return [];
  }

  const configs: InfiniteDepthConfigWithExtends[] = [];

  if (!isEmpty(sources)) {
    configs.push({
      extends: [...angular.configs.tsAll],
      files: sources,
      languageOptions: {
        parserOptions: {
          allowAutomaticSingleRunInference: true,
          projectService: true,
        },
      },
      processor: angular.processInlineTemplates,
      rules: {
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
    });
  }

  if (!isEmpty(templates)) {
    configs.push({
      extends: [...angular.configs.templateAll],
      files: templates,
      languageOptions: {
        parserOptions: {
          allowAutomaticSingleRunInference: true,
          projectService: true,
        },
      },
      rules: {
        '@angular-eslint/template/i18n': 'off',
        '@angular-eslint/template/prefer-control-flow': 'off',
      },
    });
  }

  return configs;
};
