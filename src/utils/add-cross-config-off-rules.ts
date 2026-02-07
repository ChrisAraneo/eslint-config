import type { Linter } from 'eslint';
import { cloneDeep, isEmpty, uniq } from 'lodash-es';

import {
  ConfigBlock,
  JSONS,
  NX,
  SOURCES,
  TEMPLATES,
  TESTS,
} from '../interfaces.js';
import { getKeys } from './get-keys.js';

const getOffRules = (config: Linter.Config): Record<string, 'off'> => {
  const rules: string[] = [];

  rules.push(...(getKeys((config as unknown as any).rules).map(String) ?? {}));

  const keys = uniq(rules);

  const result: Record<string, 'off'> = {};

  keys.forEach((key) => {
    result[key] = 'off';
  });

  return result;
};

const pushOffRulesConfig = (
  previousConfigBlock: ConfigBlock,
  currentConfigBlock: ConfigBlock,
  configsToDisable: Linter.Config[],
  key: keyof ConfigBlock,
) => {
  const files = previousConfigBlock[key]?.length
    ? previousConfigBlock[key]?.[0]?.files
    : undefined;

  if (isEmpty(files)) {
    return currentConfigBlock;
  }

  currentConfigBlock[SOURCES] = [
    ...(previousConfigBlock[SOURCES] ?? []),
    {
      files,
      name: 'off-rules',
      rules: configsToDisable.reduce(
        (acc, config) => ({ ...acc, ...getOffRules(config) }),
        {} as Record<string, 'off'>,
      ),
    } as unknown as Linter.Config,
  ];

  return currentConfigBlock;
};

export const addCrossConfigOffRules = (configBlock: ConfigBlock) => {
  const sources = configBlock[SOURCES] ?? [];
  const tests = configBlock[TESTS] ?? [];
  const templates = configBlock[TEMPLATES] ?? [];
  const jsons = configBlock[JSONS] ?? [];
  const nx = configBlock[NX] ?? [];

  const updatedConfigBlock = cloneDeep(configBlock);

  pushOffRulesConfig(
    configBlock,
    updatedConfigBlock,
    [...templates, ...jsons],
    SOURCES,
  );
  pushOffRulesConfig(
    configBlock,
    updatedConfigBlock,
    [...templates, ...jsons],
    TESTS,
  );
  pushOffRulesConfig(
    configBlock,
    updatedConfigBlock,
    [...sources, ...tests, ...jsons, ...nx],
    TEMPLATES,
  );
  pushOffRulesConfig(
    configBlock,
    updatedConfigBlock,
    [...sources, ...tests, ...templates, ...nx],
    JSONS,
  );

  return updatedConfigBlock;
};
