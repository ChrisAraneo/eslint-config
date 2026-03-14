import { isString, isUndefined } from 'lodash-es';
import { match } from 'ts-pattern';

import { isNotObject } from './is-not-object.js';
import { throwError } from './throw-error.js';

interface Input<T extends object> {
  obj: T;
  key: keyof T;
}

export const getOptionalStringOrThrow = <T extends object>({
  key,
  obj,
}: Input<T>): string | undefined =>
  match(obj)
    .when(isNotObject, throwError(`Expected an object`))
    .otherwise((obj) =>
      match(obj[key])
        .when(
          (value) => !isUndefined(value) && !isString(value),
          throwError(`${String(key)} must be a string or undefined`),
        )
        .otherwise((value) => value as string | undefined),
    );
