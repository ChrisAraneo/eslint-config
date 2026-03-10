import { match } from 'ts-pattern';

interface Input<T extends object> {
  obj: T;
  key: keyof T;
}

export const getOptionalArrayOrThrow = <T extends object>({
  key,
  obj,
}: Input<T>): string[] | undefined =>
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
            value !== undefined && (value === null || !Array.isArray(value)),
          () => {
            throw new Error(`${String(key)} must be an array or undefined`);
          },
        )
        .otherwise((value) => value as string[] | undefined),
    );
