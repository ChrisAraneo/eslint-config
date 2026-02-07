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

  const filesKeyToLastIndex = new Map<string, number>();

  for (let i = allConfigs.length - 1; i >= 0; i--) {
    const config = allConfigs[i];
    const files = config?.files ?? [];
    const filesKey = JSON.stringify([...files].sort());

    if (!filesKeyToLastIndex.has(filesKey) && files.length > 0) {
      filesKeyToLastIndex.set(filesKey, i);
    }
  }

  for (const [filesKey, offRules] of offRulesMap) {
    const lastIndex = filesKeyToLastIndex.get(filesKey);
    if (lastIndex !== undefined) {
      const config = allConfigs[lastIndex];
      if (config) {
        config.rules = {
          ...config.rules,
          ...offRules,
        };
      }
    }
  }

  return allConfigs;
};
