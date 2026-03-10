import { match } from 'ts-pattern';

interface GetOptionalBooleanOrThrowInput<T extends object> {
  obj: T;
  key: keyof T;
}

export const getOptionalBooleanOrThrow = <T extends object>(
  input: GetOptionalBooleanOrThrowInput<T>,
): boolean | undefined =>
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
            (value === null || typeof value !== 'boolean'),
          () => {
            throw new Error(
              `${String(input.key)} must be a boolean or undefined`,
            );
          },
        )
        .otherwise((value) => value as boolean | undefined),
    );
