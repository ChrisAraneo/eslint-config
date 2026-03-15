import type { Linter } from 'eslint';
import { cloneDeep } from 'lodash-es';

import type { ConfigBlock, ConfigKey } from '../interfaces.js';
import { isConfigKey } from './is-config-key.js';

interface Input {
  configBlock: ConfigBlock;
  key: symbol;
}

export const getConfigValue = ({ configBlock, key }: Input): Linter.Config[] =>
  isConfigKey({ value: key })
    ? cloneDeep(configBlock[key as ConfigKey] ?? [])
    : [];
