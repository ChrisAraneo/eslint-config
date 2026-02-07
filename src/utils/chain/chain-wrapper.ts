export class ChainWrapper<T> {
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
