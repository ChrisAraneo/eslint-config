import { match } from 'ts-pattern';

interface GetOptionalArrayOrThrowInput<T extends object> {
  obj: T;
  key: keyof T;
}

export const getOptionalArrayOrThrow = <T extends object>(
  input: GetOptionalArrayOrThrowInput<T>,
): string[] | undefined =>
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
            value !== undefined && (value === null || !Array.isArray(value)),
          () => {
            throw new Error(
              `${String(input.key)} must be an array or undefined`,
            );
          },
        )
        .otherwise((value) => value as string[] | undefined),
    );
