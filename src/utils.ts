import type { Linter } from 'eslint';

import { chain } from './utils/chain/chain.js';
import { getKeys } from './utils/get-keys.js';
import { isEmpty } from './utils/is-empty.js';
import { mapValues } from './utils/map-values.js';

interface KeyConfig {
  files: string[];
  filesKey: string;
  key: string;
  otherRules: string[];
}

const extractRulesPerKey = (configs: Record<string, Linter.Config[]>) =>
  mapValues(configs, (configArray) =>
    chain(configArray)
      .flatMap((config) => getKeys(config.rules ?? {}))
      .uniq()
      .value()
      .map(String),
  );

const extractFilesPerKey = (
  configs: Record<string, Linter.Config[]>,
): Record<string, string[]> =>
  mapValues(configs, (configArray) =>
    chain(configArray)
      .flatMap((config) => config.files ?? [])
      .flatten()
      .filter((f): f is string => typeof f === 'string')
      .uniq()
      .value(),
  );

const createOffRulesPerFilePattern = (
  keys: string[],
  rulesPerKey: Record<string, string[]>,
  filesPerKey: Record<string, string[]>,
): Map<string, Record<string, 'off'>> => {
  const keyConfigs = chain(keys)
    .map(
      (key): KeyConfig => ({
        files: filesPerKey[key] ?? [],
        filesKey: JSON.stringify([...(filesPerKey[key] ?? [])].sort()),
        key,
        otherRules: chain(keys)
          .filter((k): k is string => k !== key)
          .flatMap((k) => rulesPerKey[k] ?? [])
          .uniq()
          .value(),
      }),
    )
    .filter((config): config is KeyConfig => config.otherRules.length > 0)
    .value();

  const grouped = chain(keyConfigs)
    .groupBy('filesKey')
    .values<KeyConfig[]>()
    .value();

  const offRulesMap = new Map<string, Record<string, 'off'>>();

  for (const group of grouped) {
    const filesKey = group[0]?.filesKey ?? '';
    const rules = chain(group)
      .flatMap((g) => g.otherRules)
      .uniq()
      .keyBy()
      .mapValues(() => 'off' as const)
      .value();
    offRulesMap.set(filesKey, rules);
  }

  return offRulesMap;
};

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
