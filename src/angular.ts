import angular from 'angular-eslint';
import { InfiniteDepthConfigWithExtends } from 'typescript-eslint';

import createJsonConfigs from './json.js';
import { createTypeScriptConfigs } from './typescript.js';
import { isNotEmpty } from './utils.js';

export default (
  prefix = 'app',
  sources: string[] = [],
  templates: string[] = [],
  jsons: string[] = [],
  ignored?: string[],
): InfiniteDepthConfigWithExtends[] => {
  const configs: InfiniteDepthConfigWithExtends[] = [];

  if (isNotEmpty(sources)) {
    configs.push(...createTypeScriptConfigs(sources));

    configs.push(
      ...angular.configs.tsAll.map((config) => ({
        ...config,
        files: sources,
      })),
      {
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
      },
    );
  }

  if (isNotEmpty(templates)) {
    configs.push(
      ...angular.configs.templateAll.map((config) => ({
        ...config,
        files: templates,
      })),
      {
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
      },
    );
  }

  if (isNotEmpty(jsons)) {
    configs.push({
      ...createJsonConfigs(jsons),
    });
  }

  if (isNotEmpty(ignored)) {
    configs.push({
      ignores: ignored,
    });
  }

  return configs;
};
