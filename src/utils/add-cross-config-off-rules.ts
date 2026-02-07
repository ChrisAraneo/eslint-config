import type { Linter } from 'eslint';
import { chain, cloneDeep, isEmpty } from 'lodash-es';

import {
  ConfigBlock,
  JSONS,
  NX,
  SOURCES,
  TEMPLATES,
  TESTS,
} from '../interfaces.js';
import { getKeys } from './get-keys.js';

const getOffRules = (config: Linter.Config): Record<string, 'off'> =>
  chain(getKeys(config.rules ?? {}))
    .map(String)
    .uniq()
    .keyBy()
    .mapValues(() => 'off' as const)
    .value();

const mergeOffRules = (configs: Linter.Config[]): Record<string, 'off'> =>
  configs.reduce(
    (acc, config) => ({ ...acc, ...getOffRules(config) }),
    {} as Record<string, 'off'>,
  );

const createOffRulesConfig = (
  files: Linter.Config['files'],
  configsToDisable: Linter.Config[],
): Linter.Config | null =>
  isEmpty(files)
    ? null
    : ({
        files:
          configsToDisable.find((config) => config?.files?.length)?.files ?? [],
        name: 'off-rules',
        rules: mergeOffRules(configsToDisable),
      } as unknown as Linter.Config);

const getFiles = (configs: Linter.Config[]): Linter.Config['files'] =>
  configs.find((config) => config?.files?.length)?.files ?? [];

const addOffRulesConfig = (
  configs: Linter.Config[],
  offRulesConfig: Linter.Config | null,
): Linter.Config[] => (offRulesConfig ? [...configs, offRulesConfig] : configs);

export const addCrossConfigOffRules = (
  configBlock: ConfigBlock,
): ConfigBlock => {
  const sources = cloneDeep(configBlock[SOURCES] ?? []);
  const tests = cloneDeep(configBlock[TESTS] ?? []);
  const templates = cloneDeep(configBlock[TEMPLATES] ?? []);
  const jsons = cloneDeep(configBlock[JSONS] ?? []);
  const nx = cloneDeep(configBlock[NX] ?? []);

  return {
    ...configBlock,
    [JSONS]: addOffRulesConfig(
      jsons,
      createOffRulesConfig(getFiles(jsons), [
        ...sources,
        ...tests,
        ...templates,
        ...nx,
      ]),
    ),
    [SOURCES]: addOffRulesConfig(
      sources,
      createOffRulesConfig(getFiles(sources), [...templates, ...jsons]),
    ),
    [TEMPLATES]: addOffRulesConfig(
      templates,
      createOffRulesConfig(getFiles(templates), [
        ...sources,
        ...tests,
        ...jsons,
        ...nx,
      ]),
    ),
    [TESTS]: addOffRulesConfig(
      tests,
      createOffRulesConfig(getFiles(tests), [...templates, ...jsons]),
    ),
  };
};
