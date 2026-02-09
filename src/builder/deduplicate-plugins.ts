import type { Linter } from 'eslint';

export const deduplicatePlugins = (
  configs: Linter.Config[],
): Linter.Config[] => {
  const allPlugins: NonNullable<Linter.Config['plugins']> = {};

  const configsWithoutPlugins = configs.map((config) => {
    if (config.plugins) {
      Object.assign(allPlugins, config.plugins);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { plugins, ...rest } = config;

      return rest as Linter.Config;
    }

    return config;
  });

  return Object.keys(allPlugins).length > 0
    ? [{ plugins: allPlugins }, ...configsWithoutPlugins]
    : configsWithoutPlugins;
};
