import { ConfigBlock, JSONS } from '../interfaces.js';
import { getJsoncConfigs } from './jsonc.js';

export const createJsonConfigBlock = (jsons: string[] = []): ConfigBlock => ({
  [JSONS]: getJsoncConfigs(jsons),
});
