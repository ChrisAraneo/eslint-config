import { uniq } from 'lodash-es';

export const getKeys = <T extends object>(obj: T): (keyof T)[] =>
  uniq([
    ...(Object.keys(obj) as (keyof T)[]),
    ...(Reflect.ownKeys(obj) as (keyof T)[]),
  ]);
