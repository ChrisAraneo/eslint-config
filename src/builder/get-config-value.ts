import type { Linter } from 'eslint';
import { cloneDeep } from 'lodash-es';

import type { ConfigBlock, ConfigKey } from '../interfaces.js';
import { isConfigKey } from './is-config-key.js';

interface GetConfigValueInput {
  configBlock: ConfigBlock;
  key: symbol;
}

export const getConfigValue = ({
  configBlock,
  key,
}: GetConfigValueInput): Linter.Config[] =>
  isConfigKey({ value: key })
    ? cloneDeep(configBlock[key as ConfigKey] ?? [])
    : [];
