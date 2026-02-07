import type { Linter } from 'eslint';
import { cloneDeep } from 'lodash-es';

import type { ConfigBlock, ConfigKey } from '../interfaces.js';

export const getConfigValue = (
  configBlock: ConfigBlock,
  key: ConfigKey,
): Linter.Config[] => cloneDeep(configBlock[key] ?? []);
