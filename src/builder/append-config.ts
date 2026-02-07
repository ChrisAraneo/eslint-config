import type { Linter } from 'eslint';

export const appendConfig = (
  configs: Linter.Config[],
  config: Linter.Config | null,
): Linter.Config[] => (config ? [...configs, config] : configs);
