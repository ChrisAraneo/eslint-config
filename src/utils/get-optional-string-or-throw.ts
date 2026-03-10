import { match } from 'ts-pattern';

interface Input<T extends object> {
  obj: T;
  key: keyof T;
}

export const getOptionalStringOrThrow = <T extends object>({
  key,
  obj,
}: Input<T>): string | undefined =>
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
          (value) => value !== undefined && typeof value !== 'string',
          () => {
            throw new Error(`${String(key)} must be a string or undefined`);
          },
        )
        .otherwise((value) => value as string | undefined),
    );
