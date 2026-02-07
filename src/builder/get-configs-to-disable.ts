import type { Linter } from 'eslint';
import { chain } from 'lodash-es';

import type { ConfigBlock, ConfigKey } from '../interfaces.js';
import { getConfigValue } from './get-config-value.js';

export const getConfigsToDisable = (
  configBlock: ConfigBlock,
  keys: ConfigKey[],
): Linter.Config[] =>
  chain(keys)
    .flatMap((key) => getConfigValue(configBlock, key))
    .value();
