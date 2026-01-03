import jsonc from 'eslint-plugin-jsonc';
import jsoncParser from 'jsonc-eslint-parser';
import { InfiniteDepthConfigWithExtends } from 'typescript-eslint';

import { isEmpty } from './utils.js';

export default (jsons: string[] = []): InfiniteDepthConfigWithExtends[] => {
  if (isEmpty(jsons)) {
    return [];
  }

  return [
    ...jsonc.configs['flat/recommended-with-jsonc'],
    {
      files: jsons,
      languageOptions: {
        parser: jsoncParser,
        parserOptions: {
          extraFileExtensions: ['.json'],
        },
      },
      rules: {
        'jsonc/no-comments': 'error',
        'jsonc/no-dupe-keys': 'error',
        'jsonc/sort-keys': 'error',
        'jsonc/valid-json-number': 'error',
      },
    },
  ];
};
