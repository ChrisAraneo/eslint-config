import { isObject, isUndefined } from 'lodash-es';
import { match } from 'ts-pattern';

import { isNotObject } from './is-not-object.js';
import { throwError } from './throw-error.js';

interface Input<T extends object> {
  obj: T;
  key: keyof T;
}

export const getOptionalObjectOrThrow = <T extends object>({
  key,
  obj,
}: Input<T>): Record<string, unknown> | undefined =>
  match(obj)
    .when(isNotObject, throwError(`Expected an object`))
    .otherwise((obj) =>
      match(obj[key])
        .when(
          (value) => !isUndefined(value) && !isObject(value),
          throwError(`${String(key)} must be an object or undefined`),
        )
        .otherwise((value) => value as Record<string, unknown> | undefined),
    );
