import { isObject } from 'lodash-es';

export const isNotObject = (value: unknown): boolean => !isObject(value);
