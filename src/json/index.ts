import { defineConfig } from 'eslint/config';

import { isEmpty } from '../utils.js';
import { getJsoncConfig } from './jsonc.js';

export default (jsons: string[] = []) => {
  if (isEmpty(jsons)) {
    return [];
  }

  return defineConfig(getJsoncConfig(jsons));
};
