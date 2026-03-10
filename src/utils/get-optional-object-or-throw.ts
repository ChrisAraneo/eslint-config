import { match } from 'ts-pattern';

interface GetOptionalObjectOrThrowInput<T extends object> {
  obj: T;
  key: keyof T;
}

export const getOptionalObjectOrThrow = <T extends object>(
  input: GetOptionalObjectOrThrowInput<T>,
): Record<string, unknown> | undefined =>
  match(input.obj)
    .when(
      (obj) => !obj,
      () => {
        throw new Error(`Expected an object`);
      },
    )
    .otherwise((obj) =>
      match(obj[input.key])
        .when(
          (value) =>
            value !== undefined &&
            (value === null ||
              typeof value !== 'object' ||
              Array.isArray(value)),
          () => {
            throw new Error(
              `${String(input.key)} must be an object or undefined`,
            );
          },
        )
        .otherwise((value) => value as Record<string, unknown> | undefined),
    );
