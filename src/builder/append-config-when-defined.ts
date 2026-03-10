import type { Linter } from 'eslint';
import { isArray, isObject } from 'lodash-es';
import { match } from 'ts-pattern';

import { getKeys } from './get-keys.js';

export const appendConfigWhenDefined = ({
  config,
  configs,
}: {
  configs: Linter.Config[] | undefined;
  config: Linter.Config | unknown;
}): Linter.Config[] =>
  match(
    isObject(config) &&
      !!getKeys({ obj: config as object }).length &&
      !isArray(config),
  )
    .with(true, () => [...(configs ?? []), config])
    .otherwise(() => [...(configs ?? [])]) as unknown[] as Linter.Config[];
