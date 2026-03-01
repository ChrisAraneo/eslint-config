import { chain } from 'lodash-es';

import {
  type ConfigBlock,
  ConfigKey,
  JSONS,
  NX,
  SOURCES,
  TEMPLATES,
  TESTS,
} from '../interfaces.js';
import { appendConfigWhenDefined } from './append-config-when-defined.js';
import { getConfigValue } from './get-config-value.js';

export const addCrossConfigIgnores = (configBlock: ConfigBlock): ConfigBlock =>
  chain(
    ((configBlock) => [
      {
        configs: getConfigValue(configBlock, SOURCES),
        ignoreFrom: [TEMPLATES, JSONS],
        key: SOURCES,
      },
      {
        configs: getConfigValue(configBlock, TESTS),
        ignoreFrom: [TEMPLATES, JSONS],
        key: TESTS,
      },
      {
        configs: getConfigValue(configBlock, TEMPLATES),
        ignoreFrom: [SOURCES, TESTS, JSONS, NX],
        key: TEMPLATES,
      },
      {
        configs: getConfigValue(configBlock, JSONS),
        ignoreFrom: [SOURCES, TESTS, TEMPLATES, NX],
        key: JSONS,
      },
    ])(configBlock),
  )
    .map((mapping) => [
      mapping.key,
      appendConfigWhenDefined(
        mapping.configs,
        (() => {
          return mapping.configs.map((config) => {
            return {
              ...config,
              ignores: [
                ...(config.ignores ?? []),
                ...((
                  mapping.ignoreFrom.flatMap((ignoreKey) =>
                    getConfigValue(configBlock, ignoreKey as ConfigKey),
                  ) as unknown as { files?: string[] }
                )?.files ?? []),
              ],
            };
          });
        })(),
      ),
    ])
    .reduce(
      (acc, [key, configs]) => ({ ...acc, [key as ConfigKey]: configs }),
      {
        ...configBlock,
      } as ConfigBlock,
    )
    .value();
