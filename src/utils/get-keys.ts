import { uniq } from 'lodash-es';

interface Input<T extends object> {
  obj: T;
}

export const getKeys = <T extends object>({ obj }: Input<T>): (keyof T)[] =>
  uniq([
    ...(Object.keys(obj) as (keyof T)[]),
    ...(Reflect.ownKeys(obj) as (keyof T)[]),
  ]);
