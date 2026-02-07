import { isEmpty } from 'lodash-es';

export const isNotEmpty = (value: unknown): boolean => !isEmpty(value);
