import type { Linter } from 'eslint';
import { cloneDeep } from 'lodash-es';

import type { ConfigBlock } from '../interfaces.js';
import { isConfigKey } from './is-config-key.js';

export const getConfigValue = (
  configBlock: ConfigBlock,
  key: symbol,
): Linter.Config[] =>
  isConfigKey(key) ? cloneDeep(configBlock[key] ?? []) : [];
