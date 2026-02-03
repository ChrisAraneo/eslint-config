import type { Linter } from 'eslint';
import { chain, mapValues, keys as getKeys } from 'lodash';

export function isEmpty(value: unknown): boolean {
  return (Array.isArray(value) && value.length === 0) || !Array.isArray(value);
}

export function isNotEmpty(value: unknown): boolean {
  return !isEmpty(value);
}

export function addCrossConfigOffRules(
  configs: Record<string, Linter.Config[]>,
  options?: { order?: string[] },
): Linter.Config[] {
  const keys = getKeys(configs);
  const orderedKeys = isEmpty(options?.order) ? keys : (options?.order ?? keys);

  const rulesPerKey = mapValues(configs, (configArray) =>
    chain(configArray)
      .flatMap((config) => getKeys(config.rules ?? {}))
      .uniq()
      .value(),
  );

  const filesPerKey = mapValues(configs, (configArray) =>
    chain(configArray)
      .flatMap((config) => config.files ?? [])
      .flatten()
      .filter((f): f is string => typeof f === 'string')
      .uniq()
      .value(),
  );

  const offRulesConfigs = chain(keys)
    .map((key) => ({
      key,
      files: filesPerKey[key] ?? [],
      filesKey: JSON.stringify([...(filesPerKey[key] ?? [])].sort()),
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

  return chain(orderedKeys)
    .flatMap((key) => configs[key] ?? [])
    .concat(offRulesConfigs)
    .value();
}
