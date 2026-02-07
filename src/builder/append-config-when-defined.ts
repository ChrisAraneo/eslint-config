import type { Linter } from 'eslint';
import { isObject } from 'lodash-es';

export const appendConfigWhenDefined = (
  configs: Linter.Config[],
  config: Linter.Config | unknown,
): Linter.Config[] => (isObject(config) ? [...configs, config] : configs);
