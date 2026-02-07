import { chain } from 'lodash-es';

interface KeyConfig {
  files: string[];
  filesKey: string;
  key: string;
  otherRules: string[];
}

type OffRules = Record<string, 'off'>;

const getKeyConfigs = (
  keys: string[],
  rulesPerKey: Record<string, string[]>,
  filesPerKey: Record<string, string[]>,
): KeyConfig[] =>
  chain(keys)
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
    .filter((config): config is KeyConfig => !!config.otherRules.length)
    .value();

export const createOffRulesPerFilePattern = (
  keys: string[],
  rulesPerKey: Record<string, string[]>,
  filesPerKey: Record<string, string[]>,
): Map<string, OffRules> =>
  chain(getKeyConfigs(keys, rulesPerKey, filesPerKey))
    .groupBy('filesKey')
    .mapValues((group) =>
      chain(group)
        .flatMap((g) => g.otherRules)
        .uniq()
        .keyBy()
        .mapValues(() => 'off' as const)
        .value(),
    )
    .entries()
    .reduce(
      (map, [filesKey, rules]) => map.set(filesKey, rules),
      new Map<string, OffRules>(),
    )
    .value();
