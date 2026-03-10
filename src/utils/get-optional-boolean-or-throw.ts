import { match } from 'ts-pattern';

interface Input<T extends object> {
  obj: T;
  key: keyof T;
}

export const getOptionalBooleanOrThrow = <T extends object>({
  key,
  obj,
}: Input<T>): boolean | undefined =>
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
            (value === null || typeof value !== 'boolean'),
          () => {
            throw new Error(`${String(key)} must be a boolean or undefined`);
          },
        )
        .otherwise((value) => value as boolean | undefined),
    );
