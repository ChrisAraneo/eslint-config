import { match } from 'ts-pattern';

interface Input<T extends object> {
  obj: T;
  key: keyof T;
}

export const getOptionalObjectOrThrow = <T extends object>({
  key,
  obj,
}: Input<T>): Record<string, unknown> | undefined =>
  match(obj)
    .when(
      (obj) => !obj,
      () => {
        throw new Error(`Expected an object`);
      },
    )
    .otherwise((obj) =>
      match(obj[key])
        .when(
          (value) =>
            value !== undefined &&
            (value === null ||
              typeof value !== 'object' ||
              Array.isArray(value)),
          () => {
            throw new Error(`${String(key)} must be an object or undefined`);
          },
        )
        .otherwise((value) => value as Record<string, unknown> | undefined),
    );
