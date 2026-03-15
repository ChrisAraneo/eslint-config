import { uniq } from 'lodash-es';

import { type ConfigBlock, ConfigKey } from '../interfaces.js';
import { getConfigValue } from './get-config-value.js';
import { isConfigKey } from './is-config-key.js';

interface Input {
  configBlock: ConfigBlock;
  keys: symbol[];
}

export const getUniqueConfigFiles = ({ configBlock, keys }: Input): string[] =>
  uniq([
    ...(keys ?? [])
      .flatMap((key) =>
        isConfigKey({ value: key })
          ? getConfigValue({ configBlock, key: key as ConfigKey })
          : [],
      )
      .flatMap((config) => config?.files ?? [])
      .flat(),
  ]);
