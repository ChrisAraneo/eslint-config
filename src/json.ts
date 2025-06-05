import jsonc from 'eslint-plugin-jsonc';
import jsoncParser from 'jsonc-eslint-parser';
import { InfiniteDepthConfigWithExtends } from 'typescript-eslint';

export default (jsons: string[] = []): InfiniteDepthConfigWithExtends[] => {
  return [
    ...jsonc.configs['flat/recommended-with-jsonc'],
    {
      files: jsons,
      languageOptions: {
        parser: jsoncParser,
      },
      rules: {
        'jsonc/no-comments': 'error',
        'jsonc/sort-keys': 'error',
        'jsonc/valid-json-number': 'error',
        'jsonc/no-dupe-keys': 'error',
      },
    },
  ];
};
