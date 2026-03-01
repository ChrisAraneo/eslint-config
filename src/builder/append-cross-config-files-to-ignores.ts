import { chain, cloneDeep, isEmpty } from 'lodash-es';

import {
  type ConfigBlock,
  ConfigKey,
  JSONS,
  NX,
  SOURCES,
  TEMPLATES,
  TESTS,
} from '../interfaces.js';
import { getConfigValue } from './get-config-value.js';
import { getUniqueConfigFiles } from './get-unique-config-files.js';

export const appendCrossConfigFilesToIgnores = (
  configBlock: ConfigBlock,
): ConfigBlock =>
  chain([
    {
      ignores: [TEMPLATES, JSONS],
      key: SOURCES,
    },
    {
      ignores: [TEMPLATES, JSONS],
      key: TESTS,
    },
    {
      ignores: [SOURCES, TESTS, JSONS, NX],
      key: TEMPLATES,
    },
    {
      ignores: [SOURCES, TESTS, TEMPLATES, NX],
      key: JSONS,
    },
  ])
    .map(({ ignores, key }) => [
      key,
      (getConfigValue(configBlock, key as ConfigKey) ?? []).map((config) => {
        const currentIgnores: string[] = config.ignores ?? [];
        const updatedIgnores = [
          ...currentIgnores,
          ...getUniqueConfigFiles(configBlock, ignores),
        ];

        return cloneDeep(
          isEmpty(updatedIgnores)
            ? config
            : { ...config, ignores: updatedIgnores },
        );
      }),
    ])
    .reduce(
      (acc, [key, configs]) => ({ ...acc, [key as ConfigKey]: configs }),
      {
        ...configBlock,
      } as ConfigBlock,
    )
    .value();
