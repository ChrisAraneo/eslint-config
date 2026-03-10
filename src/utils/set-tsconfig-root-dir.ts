import { get as getAppRootDir } from 'app-root-dir';
import type { Linter } from 'eslint';

export const setTsconfigRootDir = ({
  config,
  shouldResolveAppRootDir,
  sources,
  tsconfigRootDir,
}: {
  config: Linter.Config;
  sources: string[];
  tsconfigRootDir?: string;
  shouldResolveAppRootDir?: boolean;
}): Linter.Config =>
  sources.find((source) => config.files?.includes(source))
    ? {
        ...config,
        languageOptions: {
          ...config.languageOptions,
          parserOptions: {
            ...((config?.languageOptions ?? {})?.parserOptions ?? {}),
            ...{
              ...(tsconfigRootDir && !shouldResolveAppRootDir
                ? { tsconfigRootDir }
                : {}),
              ...(shouldResolveAppRootDir
                ? { tsconfigRootDir: getAppRootDir() }
                : {}),
            },
          },
        },
      }
    : config;
