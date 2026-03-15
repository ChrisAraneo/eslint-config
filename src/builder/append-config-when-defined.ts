import type { Linter } from 'eslint';
import { isArray, isObject } from 'lodash-es';
import { match } from 'ts-pattern';

import { getKeys } from '../utils/get-keys.js';

interface Input {
  config: Linter.Config | unknown;
  configs: Linter.Config[] | undefined;
}

export const appendConfigWhenDefined = ({
  config,
  configs,
}: Input): Linter.Config[] =>
  match(
    isObject(config) &&
      !!getKeys({ obj: config as object }).length &&
      !isArray(config),
  )
    .with(true, () => [...(configs ?? []), config])
    .otherwise(() => [...(configs ?? [])]) as unknown[] as Linter.Config[];
