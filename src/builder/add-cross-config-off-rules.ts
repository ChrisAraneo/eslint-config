import { cloneDeep } from 'lodash-es';

import {
  ConfigBlock,
  JSONS,
  NX,
  SOURCES,
  TEMPLATES,
  TESTS,
} from '../interfaces.js';
import { appendConfig } from './append-config.js';
import { createOffRulesConfig } from './create-off-rules-config.js';
import { findFirstFiles } from './find-first-files.js';

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
    [JSONS]: appendConfig(
      jsons,
      createOffRulesConfig(findFirstFiles(jsons), [
        ...sources,
        ...tests,
        ...templates,
        ...nx,
      ]),
    ),
    [SOURCES]: appendConfig(
      sources,
      createOffRulesConfig(findFirstFiles(sources), [...templates, ...jsons]),
    ),
    [TEMPLATES]: appendConfig(
      templates,
      createOffRulesConfig(findFirstFiles(templates), [
        ...sources,
        ...tests,
        ...jsons,
        ...nx,
      ]),
    ),
    [TESTS]: appendConfig(
      tests,
      createOffRulesConfig(findFirstFiles(tests), [...templates, ...jsons]),
    ),
  };
};
