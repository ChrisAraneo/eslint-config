import jsonc from 'eslint-plugin-jsonc';
import jsoncParser from 'jsonc-eslint-parser';
import { InfiniteDepthConfigWithExtends } from 'typescript-eslint';

import { isEmpty } from './utils.js';

export default (
  jsons: string[] = [],
  ignored: string[] = [],
): InfiniteDepthConfigWithExtends[] => {
  if (isEmpty(jsons)) {
    return [];
  }

  const configs: InfiniteDepthConfigWithExtends[] = [
    ...jsonc.configs['flat/recommended-with-jsonc'],
    {
      files: jsons,
      languageOptions: {
        parser: jsoncParser,
      },
      rules: {
        'jsonc/no-comments': 'error',
        'jsonc/no-dupe-keys': 'error',
        'jsonc/sort-keys': 'error',
        'jsonc/valid-json-number': 'error',
      },
    },
  ];

  if (!isEmpty(ignored)) {
    configs.push({
      ignores: ignored,
    });
  }

  return configs;
};
