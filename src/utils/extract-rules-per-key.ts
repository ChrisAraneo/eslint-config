import type { Linter } from 'eslint';
import { chain } from 'lodash-es';

import { getKeys } from './get-keys.js';
import { mapValues } from './map-values.js';

export const extractRulesPerKey = (record: Record<string, Linter.Config[]>) =>
  mapValues(record, (configs) =>
    chain(configs)
      .flatMap((config) => getKeys(config.rules ?? {}))
      .uniq()
      .value()
      .map(String),
  );
