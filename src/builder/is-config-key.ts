import {
  IGNORED,
  JSONS,
  NX,
  SOURCES,
  TEMPLATES,
  TESTS,
} from '../interfaces.js';

export const isConfigKey = ({ value }: { value: unknown }): boolean =>
  typeof value === 'symbol' &&
  (value === SOURCES ||
    value === TESTS ||
    value === TEMPLATES ||
    value === JSONS ||
    value === NX ||
    value === IGNORED);
