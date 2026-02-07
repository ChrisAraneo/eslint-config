import { chain } from 'lodash-es';

interface KeyConfig {
  files: string[];
  filesKey: string;
  key: string;
  otherRules: string[];
}

type OffRules = Record<string, 'off'>;

export const createOffRulesPerFilePattern = (
  keys: string[],
  rulesPerKey: Record<string, string[]>,
  filesPerKey: Record<string, string[]>,
): Map<string, OffRules> => {
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

  const grouped = chain(keyConfigs).groupBy('filesKey').values().value();

  const offRulesMap = new Map<string, OffRules>();

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
