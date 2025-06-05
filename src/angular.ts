import angular from 'angular-eslint';
import { InfiniteDepthConfigWithExtends } from 'typescript-eslint';

export default (
  sources: string[] = [],
  templates: string[] = [],
): InfiniteDepthConfigWithExtends[] => {
  return [
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
      files: templates,
      extends: [...angular.configs.templateAll],
      rules: {
        '@angular-eslint/template/prefer-control-flow': 'off',
        '@angular-eslint/template/i18n': 'off',
      },
    },
  ];
};
