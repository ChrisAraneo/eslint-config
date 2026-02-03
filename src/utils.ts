import type { Linter } from 'eslint';

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
  const keys = Object.keys(configs);
  const orderedKeys = isEmpty(options?.order) ? keys : (options?.order ?? []);

  const rulesPerKey: Record<string, Set<string>> = {};
  const filesPerKey: Record<string, string[]> = {};

  for (const key of keys) {
    rulesPerKey[key] = new Set();
    const filesSet = new Set<string>();

    for (const config of configs[key] ?? []) {
      if (config.rules) {
        Object.keys(config.rules ?? {}).forEach((r) =>
          rulesPerKey[key]?.add(r),
        );
      }
      if (config.files) {
        const f = Array.isArray(config.files)
          ? config.files.flat()
          : [config.files];
        f.forEach((file) => typeof file === 'string' && filesSet.add(file));
      }
    }

    filesPerKey[key] = Array.from(filesSet);
  }

  const offRulesByFilesKey = new Map<
    string,
    { files: string[]; rules: Set<string> }
  >();

  for (const key of keys) {
    const files = filesPerKey[key];
    const filesKey = JSON.stringify([...(files ?? [])].sort());

    const otherRules = new Set<string>();
    for (const otherKey of keys) {
      if (otherKey !== key) {
        rulesPerKey[otherKey]?.forEach((r) => otherRules.add(r));
      }
    }

    if (otherRules.size === 0) continue;

    if (offRulesByFilesKey.has(filesKey)) {
      const existing = offRulesByFilesKey.get(filesKey);
      otherRules.forEach((r) => existing?.rules.add(r));
    } else {
      offRulesByFilesKey.set(filesKey, {
        files: files ?? [],
        rules: otherRules,
      });
    }
  }

  const result: Linter.Config[] = [];
  for (const key of orderedKeys) {
    result.push(...(configs[key] ?? []));
  }

  for (const { files, rules } of offRulesByFilesKey.values()) {
    const offRules: Linter.RulesRecord = {};
    rules.forEach((r) => (offRules[r] = 'off'));

    result.push({
      name: 'disable-other-rules',
      ...(files.length > 0 && { files }),
      rules: offRules,
    });
  }

  return result;
}
