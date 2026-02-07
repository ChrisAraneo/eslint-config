import type { Linter } from 'eslint';
import { chain } from 'lodash-es';

import { getKeys } from './get-keys.js';

export const disableAllRules = (
  configs: Linter.Config[],
): Record<string, 'off'> =>
  configs.reduce(
    (acc, config) => ({
      ...acc,
      ...chain(getKeys(config.rules ?? {}))
        .map(String)
        .uniq()
        .keyBy()
        .mapValues(() => 'off' as const)
        .value(),
    }),
    {} as Record<string, 'off'>,
  );
