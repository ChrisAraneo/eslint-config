import type { Linter } from 'eslint';
import { chain, isEmpty, keys as getKeys, mapValues } from 'lodash';

export const isNotEmpty = (value: unknown): boolean => !isEmpty(value);

const extractRulesPerKey = (
  configs: Record<string, Linter.Config[]>,
): Record<string, string[]> =>
  mapValues(configs, (configArray) =>
    chain(configArray)
      .flatMap((config) => getKeys(config.rules ?? {}))
      .uniq()
      .value(),
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

const createOffRulesConfigs = (
  keys: string[],
  rulesPerKey: Record<string, string[]>,
  filesPerKey: Record<string, string[]>,
): Linter.Config[] =>
  chain(keys)
    .map((key) => ({
      files: filesPerKey[key] ?? [],
      filesKey: JSON.stringify([...(filesPerKey[key] ?? [])].sort()),
      key,
      otherRules: chain(keys)
        .filter((k) => k !== key)
        .flatMap((k) => rulesPerKey[k] ?? [])
        .uniq()
        .value(),
    }))
    .filter(({ otherRules }) => otherRules.length > 0)
    .groupBy('filesKey')
    .values()
    .map((group) => ({
      files: group[0]?.files ?? [],
      rules: chain(group)
        .flatMap((g) => g.otherRules)
        .uniq()
        .keyBy()
        .mapValues(() => 'off' as const)
        .value(),
    }))
    .map(({ files, rules }) => ({
      name: 'disable-other-rules' as const,
      ...(files.length > 0 && { files }),
      rules,
    }))
    .value();

export const addCrossConfigOffRules = (
  configs: Record<string, Linter.Config[]>,
  options?: { order?: string[] },
): Linter.Config[] => {
  const keys = getKeys(configs);
  const orderedKeys = isEmpty(options?.order) ? keys : (options?.order ?? keys);

  const rulesPerKey = extractRulesPerKey(configs);
  const filesPerKey = extractFilesPerKey(configs);
  const offRulesConfigs = createOffRulesConfigs(keys, rulesPerKey, filesPerKey);

  return chain(orderedKeys)
    .flatMap((key) => configs[key] ?? [])
    .concat(offRulesConfigs)
    .value();
};
