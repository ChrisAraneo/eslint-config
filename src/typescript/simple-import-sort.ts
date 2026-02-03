import type { Linter } from 'eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { isEmpty } from 'lodash';

export const getSimpleImportSortConfigs = (
  sources: string[],
): Linter.Config[] =>
  isEmpty(sources)
    ? []
    : [
        {
          files: sources,
          plugins: { 'simple-import-sort': simpleImportSort },
          rules: {
            'simple-import-sort/exports': 'error',
            'simple-import-sort/imports': 'error',
          },
        },
      ];
