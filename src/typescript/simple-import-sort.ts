import type { Linter } from 'eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export const getSimpleImportSortConfig = (
  sources: string[],
): Linter.Config => ({
  files: sources,
  plugins: { 'simple-import-sort': simpleImportSort },
  rules: {
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
  },
});
