import nx from '@nx/eslint-plugin';
import type { Linter } from 'eslint';
import { isEmpty } from 'lodash-es';
import { match } from 'ts-pattern';

import { NxConfigRulesConfig } from '../interfaces.js';

interface Input {
  sources?: string[];
  rulesConfig?: NxConfigRulesConfig;
}

const getRuleConfig = ({ option }: { option: unknown }) =>
  isEmpty(option) ? 'off' : ['error', option];

export const getNxConfigs = ({
  rulesConfig = {},
  sources = [],
}: Input = {}): Linter.Config[] =>
  match(sources?.length ?? 0)
    .with(0, () => [])
    .otherwise(
      () =>
        [
          ...nx.configs['flat/base'],
          {
            files: sources,
            rules: {
              '@nx/dependency-checks': getRuleConfig({
                option: rulesConfig?.dependencyChecks,
              }),
              '@nx/enforce-module-boundaries': getRuleConfig({
                option: rulesConfig?.enforceModuleBoundaries,
              }),
              '@nx/nx-plugin-checks': getRuleConfig({
                option: rulesConfig?.nxPluginChecks,
              }),
            },
          },
        ] as Linter.Config[],
    );
