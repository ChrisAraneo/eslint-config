import angular from 'angular-eslint';
import { InfiniteDepthConfigWithExtends } from 'typescript-eslint';

import { isEmpty } from './utils.js';

export default (
  isAngularApp = false,
  sources: string[] = [],
  templates: string[] = [],
  prefix?: string,
): InfiniteDepthConfigWithExtends[] => {
  if (!isAngularApp) {
    return [];
  }

  const configs: InfiniteDepthConfigWithExtends[] = [];

  if (!isEmpty(sources)) {
    configs.push({
      ...angular.configs.tsAll,
      files: sources,
      processor: angular.processInlineTemplates,
      rules: {
        '@angular-eslint/component-selector': [
          'error',
          {
            prefix: prefix || 'app',
            style: 'kebab-case',
            type: 'element',
          },
        ],
        '@angular-eslint/directive-selector': [
          'error',
          {
            prefix: prefix || 'app',
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
      ...angular.configs.templateAll,
      files: templates,
      rules: {
        '@angular-eslint/template/i18n': 'off',
        '@angular-eslint/template/prefer-control-flow': 'off',
      },
    });
  }

  return configs;
};
