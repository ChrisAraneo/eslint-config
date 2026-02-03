import { defineConfig } from 'eslint/config';

import { getJsoncConfigs } from './jsonc.js';

export default (jsons: string[] = []) => defineConfig(getJsoncConfigs(jsons));
