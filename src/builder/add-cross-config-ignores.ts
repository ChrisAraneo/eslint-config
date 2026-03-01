import { chain, uniq } from 'lodash-es';

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

const isConfigKey = (value: unknown): value is ConfigKey =>
  value === SOURCES ||
  value === TESTS ||
  value === TEMPLATES ||
  value === JSONS ||
  value === NX;

export const addCrossConfigIgnores = (configBlock: ConfigBlock): ConfigBlock =>
  chain(
    ((configBlock) => [
      {
        configs: getConfigValue(configBlock, SOURCES),
        ignores: [TEMPLATES, JSONS],
        key: SOURCES,
      },
      {
        configs: getConfigValue(configBlock, TESTS),
        ignores: [TEMPLATES, JSONS],
        key: TESTS,
      },
      {
        configs: getConfigValue(configBlock, TEMPLATES),
        ignores: [SOURCES, TESTS, JSONS, NX],
        key: TEMPLATES,
      },
      {
        configs: getConfigValue(configBlock, JSONS),
        ignores: [SOURCES, TESTS, TEMPLATES, NX] as ConfigKey[],
        key: JSONS,
      },
    ])(configBlock),
  )
    .map(({ configs, key }) => [
      key,
      appendConfigWhenDefined(
        configs,
        (() => {
          return configs.map((config) => {
            const result = uniq([
              ...(config.ignores ?? []),
              ...(config.ignores ?? [])
                .flatMap((key) =>
                  isConfigKey(key)
                    ? getConfigValue(configBlock, key as ConfigKey)
                    : [],
                )
                .flatMap((config) => config?.files ?? [])
                .flat(),
            ]);

            if (result.length > 0) {
              config.ignores = result;
            }

            return config;
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
