import type { Linter } from 'eslint';

export const isEmpty = (value: unknown): boolean => {
  if (value == null) {
    return true;
  }
  if (Array.isArray(value) || typeof value === 'string') {
    return value.length === 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return false;
};

export const isNotEmpty = (value: unknown): boolean => !isEmpty(value);

export const getKeys = <T extends object>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
};

export const mapValues = <T extends object, U>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T, object: T) => U,
): Record<keyof T, U> => {
  const result = {} as Record<keyof T, U>;

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = fn(obj[key], key, obj);
    }
  }

  return result;
};

class ChainWrapper<T> {
  private _value: T;

  constructor(value: T) {
    this._value = value;
  }

  map<U>(
    fn: (item: T extends (infer R)[] ? R : never) => U,
  ): ChainWrapper<U[]> {
    const arr = this._value as unknown[];

    return new ChainWrapper(arr.map(fn as (item: unknown) => U));
  }

  flatMap<U>(
    fn: (item: T extends (infer R)[] ? R : never) => U[],
  ): ChainWrapper<U[]> {
    const arr = this._value as unknown[];

    return new ChainWrapper(arr.flatMap(fn as (item: unknown) => U[]));
  }

  filter<U extends T extends (infer R)[] ? R : never>(
    fn: (item: T extends (infer R)[] ? R : never) => item is U,
  ): ChainWrapper<U[]>;

  filter(
    fn: (item: T extends (infer R)[] ? R : never) => boolean,
  ): ChainWrapper<T>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filter(fn: (item: any) => boolean): ChainWrapper<any> {
    const arr = this._value as unknown[];

    return new ChainWrapper(arr.filter(fn));
  }

  uniq(): ChainWrapper<T> {
    const arr = this._value as unknown[];

    return new ChainWrapper([...new Set(arr)]) as ChainWrapper<T>;
  }

  flatten(): ChainWrapper<T extends (infer R)[][] ? R[] : T> {
    const arr = this._value as unknown[];

    return new ChainWrapper(arr.flat()) as ChainWrapper<
      T extends (infer R)[][] ? R[] : T
    >;
  }

  concat<U>(
    other: U[],
  ): ChainWrapper<T extends unknown[] ? [...T, ...U[]] : never> {
    const arr = this._value as unknown[];

    return new ChainWrapper([...arr, ...other]) as ChainWrapper<
      T extends unknown[] ? [...T, ...U[]] : never
    >;
  }

  groupBy<K extends string>(
    key: K,
  ): ChainWrapper<Record<string, (T extends (infer R)[] ? R : never)[]>> {
    const arr = this._value as Record<string, unknown>[];
    const grouped: Record<string, unknown[]> = {};

    for (const item of arr) {
      const groupKey = String(item[key]);

      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }

      grouped[groupKey].push(item);
    }

    return new ChainWrapper(grouped) as ChainWrapper<
      Record<string, (T extends (infer R)[] ? R : never)[]>
    >;
  }

  values<V = T extends Record<string, infer U> ? U : never>(): ChainWrapper<
    V[]
  > {
    const obj = this._value as Record<string, V>;

    return new ChainWrapper(Object.values(obj)) as ChainWrapper<V[]>;
  }

  keyBy(): ChainWrapper<Record<string, T extends (infer R)[] ? R : never>> {
    const arr = this._value as unknown[];
    const result: Record<string, unknown> = {};

    for (const item of arr) {
      result[String(item)] = item;
    }

    return new ChainWrapper(result) as ChainWrapper<
      Record<string, T extends (infer R)[] ? R : never>
    >;
  }

  mapValues<U>(fn: (value: unknown) => U): ChainWrapper<Record<string, U>> {
    const obj = this._value as Record<string, unknown>;
    const result: Record<string, U> = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = fn(obj[key]);
      }
    }

    return new ChainWrapper(result);
  }

  value(): T {
    return this._value;
  }
}

export const chain = <T>(value: T): ChainWrapper<T> => {
  return new ChainWrapper(value);
};

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

interface KeyConfig {
  files: string[];
  filesKey: string;
  key: string;
  otherRules: string[];
}

const createOffRulesConfigs = (
  keys: string[],
  rulesPerKey: Record<string, string[]>,
  filesPerKey: Record<string, string[]>,
): Linter.Config[] => {
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

  return chain(grouped)
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
};

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
