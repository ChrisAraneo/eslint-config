import { isEmpty } from './is-empty.js';

export const isNotEmpty = (value: unknown): boolean => !isEmpty(value);
