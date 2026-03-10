import { match } from 'ts-pattern';

interface GetOptionalStringOrThrowInput<T extends object> {
  obj: T;
  key: keyof T;
}

export const getOptionalStringOrThrow = <T extends object>(
  input: GetOptionalStringOrThrowInput<T>,
): string | undefined =>
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
          (value) => value !== undefined && typeof value !== 'string',
          () => {
            throw new Error(
              `${String(input.key)} must be a string or undefined`,
            );
          },
        )
        .otherwise((value) => value as string | undefined),
    );
