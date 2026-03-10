import { get as getAppRootDir } from 'app-root-dir';
import type { Linter } from 'eslint';
import { chain } from 'lodash-es';

interface Input {
  config: Linter.Config;
  sources: string[];
  tsconfigRootDir?: string;
  shouldResolveAppRootDir?: boolean;
}

export const setTsconfigRootDir = (input: Input): Linter.Config =>
  chain(input)
    .thru(({ config, shouldResolveAppRootDir, sources, tsconfigRootDir }) =>
      sources.find((source) => input.config.files?.includes(source))
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
        : config,
    )
    .value();
