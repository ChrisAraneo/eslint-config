import { chain } from 'lodash-es';

import {
  ConfigKey,
  JSONS,
  NX,
  SOURCES,
  TEMPLATES,
  TESTS,
  type ConfigBlock,
} from '../interfaces.js';
import { getConfigValue } from './get-config-value.js';
import { appendConfigWhenDefined } from './append-config-when-defined.js';
import { createOffRulesConfig } from './create-off-rules-config.js';
import { findFirstFiles } from './find-first-files.js';
import { getConfigsToDisable } from './get-configs-to-disable.js';

export const addCrossConfigOffRules = (configBlock: ConfigBlock): ConfigBlock =>
  chain(
    ((configBlock) => [
      {
        key: SOURCES,
        configs: getConfigValue(configBlock, SOURCES),
        disableFrom: [TEMPLATES, JSONS],
      },
      {
        key: TESTS,
        configs: getConfigValue(configBlock, TESTS),
        disableFrom: [TEMPLATES, JSONS],
      },
      {
        key: TEMPLATES,
        configs: getConfigValue(configBlock, TEMPLATES),
        disableFrom: [SOURCES, TESTS, JSONS, NX],
      },
      {
        key: JSONS,
        configs: getConfigValue(configBlock, JSONS),
        disableFrom: [SOURCES, TESTS, TEMPLATES, NX],
      },
    ])(configBlock),
  )
    .map((mapping) => [
      mapping.key,
      appendConfigWhenDefined(
        mapping.configs,
        createOffRulesConfig(
          findFirstFiles(mapping.configs),
          getConfigsToDisable(configBlock, mapping.disableFrom as ConfigKey[]),
        ),
      ),
    ])
    .reduce(
      (acc, [key, configs]) => ({ ...acc, [key as ConfigKey]: configs }),
      {
        ...configBlock,
      } as ConfigBlock,
    )
    .value();
