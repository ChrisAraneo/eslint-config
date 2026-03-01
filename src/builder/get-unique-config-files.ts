import { uniq } from 'lodash-es';

import { type ConfigBlock, ConfigKey } from '../interfaces.js';
import { getConfigValue } from './get-config-value.js';
import { isConfigKey } from './is-config-key.js';

export const getUniqueConfigFiles = (
  configBlock: ConfigBlock,
  keys: symbol[],
): string[] =>
  uniq([
    ...(keys ?? [])
      .flatMap((key) =>
        isConfigKey(key) ? getConfigValue(configBlock, key as ConfigKey) : [],
      )
      .flatMap((config) => config?.files ?? [])
      .flat(),
  ]);
