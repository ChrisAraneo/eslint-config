import type { Linter } from 'eslint';
import { cloneDeep } from 'lodash-es';

import type { ConfigBlock, ConfigKey } from '../interfaces.js';
import { isConfigKey } from './is-config-key.js';

export const getConfigValue = ({
  configBlock,
  key,
}: {
  configBlock: ConfigBlock;
  key: symbol;
}): Linter.Config[] =>
  isConfigKey({ value: key })
    ? cloneDeep(configBlock[key as ConfigKey] ?? [])
    : [];
