import {
  ConfigKey,
  IGNORED,
  JSONS,
  NX,
  SOURCES,
  TEMPLATES,
  TESTS,
} from '../interfaces.js';

export const isConfigKey = (value: unknown): value is ConfigKey =>
  typeof value === 'symbol' &&
  (value === SOURCES ||
    value === TESTS ||
    value === TEMPLATES ||
    value === JSONS ||
    value === NX ||
    value === IGNORED);
