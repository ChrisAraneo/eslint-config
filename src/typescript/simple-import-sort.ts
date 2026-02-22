import type { Linter } from 'eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { match } from 'ts-pattern';

export const getSimpleImportSortConfigs = (
  sources?: string[],
): Linter.Config[] =>
  match(sources?.length ?? 0)
    .with(0, () => [])
    .otherwise(() => [
      {
        files: sources,
        plugins: { 'simple-import-sort': simpleImportSort },
        rules: {
          'simple-import-sort/exports': 'error',
          'simple-import-sort/imports': 'error',
        },
      },
    ]);
