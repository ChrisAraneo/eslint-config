import type { Linter } from 'eslint';

export const findFirstFiles = (
  configs: Linter.Config[],
): Linter.Config['files'] | undefined =>
  configs.find((config) => config?.files?.length)?.files ?? undefined;
