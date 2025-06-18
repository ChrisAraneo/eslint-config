import angular from 'angular-eslint';
import { InfiniteDepthConfigWithExtends } from 'typescript-eslint';
import { isEmpty } from './utils.js';

export default (
  isAngularApp: boolean = false,
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
      files: sources,
      extends: [...angular.configs.tsAll],
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
        '@angular-eslint/prefer-on-push-component-change-detection': 'off',
        '@angular-eslint/prefer-signals': 'off',
        '@angular-eslint/prefer-output-emitter-ref': 'off',
        '@angular-eslint/no-forward-ref': 'off',
      },
    });
  }

  if (!isEmpty(templates)) {
    configs.push({
      files: templates,
      extends: [...angular.configs.templateAll],
      rules: {
        '@angular-eslint/template/prefer-control-flow': 'off',
        '@angular-eslint/template/i18n': 'off',
      },
    });
  }

  return configs;
};
