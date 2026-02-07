import { getKeys } from './get-keys.js';

export const mapValues = <T extends object, U>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T, object: T) => U,
): Record<keyof T, U> =>
  getKeys(obj).reduce(
    (result, key) => {
      result[key] = fn(obj[key], key, obj);

      return result;
    },
    {} as Record<keyof T, U>,
  );
