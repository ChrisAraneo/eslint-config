import type { Linter } from 'eslint';
import { isArray, isObject } from 'lodash-es';

import { getKeys } from './get-keys.js';

export const appendConfigWhenDefined = (
  configs: Linter.Config[],
  config: Linter.Config | unknown,
): Linter.Config[] =>
  isObject(config) && !!getKeys(config).length && !isArray(config)
    ? [...configs, config]
    : [...configs];
