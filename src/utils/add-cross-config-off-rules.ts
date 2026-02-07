import type { Linter } from 'eslint';
import { chain, isEmpty } from 'lodash-es';

import { createOffRulesPerFilePattern } from './create-off-rules-per-file-pattern.js';
import { extractFilesPerKey } from './extract-files-per-key.js';
import { extractRulesPerKey } from './extract-rules-per-key.js';
import { getKeys } from './get-keys.js';

export const addCrossConfigOffRules = (
  configs: Record<string, Linter.Config[]>,
  options?: { order?: string[] },
): Linter.Config[] => {
  const keys = getKeys(configs);
  const orderedKeys = isEmpty(options?.order) ? keys : (options?.order ?? keys);

  const rulesPerKey = extractRulesPerKey(configs);
  const filesPerKey = extractFilesPerKey(configs);
  const offRulesMap = createOffRulesPerFilePattern(
    keys,
    rulesPerKey,
    filesPerKey,
  );

  const allConfigs = chain(orderedKeys)
    .flatMap((key) => configs[key] ?? [])
    .value();

  const filesKeyToLastIndex = chain(allConfigs)
    .map((config, index) => ({
      config,
      files: config?.files ?? [],
      index,
    }))
    .reverse()
    .filter(({ files }) => files.length > 0)
    .keyBy(({ files }) => JSON.stringify([...files].sort()))
    .mapValues(({ index }) => index)
    .value();

  return allConfigs.map((config, index) => {
    const files = config?.files ?? [];
    const filesKey = JSON.stringify([...files].sort());
    const isLastWithThisFilesKey = filesKeyToLastIndex[filesKey] === index;
    const offRules = offRulesMap.get(filesKey);

    return isLastWithThisFilesKey && offRules
      ? { ...config, rules: { ...config.rules, ...offRules } }
      : config;
  });
};
