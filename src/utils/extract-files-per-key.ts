import type { Linter } from 'eslint';
import { chain, isString } from 'lodash-es';

import { mapValues } from './map-values.js';

export const extractFilesPerKey = (
  record: Record<string, Linter.Config[]>,
): Record<string, string[]> =>
  mapValues(record, (configs) =>
    chain(configs)
      .flatMap((config) => config.files ?? [])
      .flatten()
      .filter((file): file is string => isString(file))
      .uniq()
      .value(),
  );
