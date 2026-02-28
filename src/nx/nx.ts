import nx from '@nx/eslint-plugin';
import type { Linter } from 'eslint';
import { isEmpty } from 'lodash';
import { NxConfigRulesConfig } from 'src/interfaces.js';
import { match } from 'ts-pattern';

const getRuleConfig = (option: unknown) =>
  isEmpty(option) ? 'off' : ['error', option];

export const getNxConfigs = (
  sources?: string[],
  rulesConfig?: NxConfigRulesConfig,
): Linter.Config[] =>
  match(sources?.length ?? 0)
    .with(0, () => [])
    .otherwise(
      () =>
        [
          ...nx.configs['flat/base'],
          {
            files: sources,
            rules: {
              '@nx/dependency-checks': getRuleConfig(
                rulesConfig?.dependencyChecks,
              ),
              '@nx/enforce-module-boundaries': getRuleConfig(
                rulesConfig?.enforceModuleBoundaries,
              ),
              '@nx/nx-plugin-checks': getRuleConfig(
                rulesConfig?.nxPluginChecks,
              ),
            },
          },
        ] as Linter.Config[],
    );
