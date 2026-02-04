import { ConfigBlock, SOURCES } from '../interfaces.js';
import { getNxConfigs } from './nx.js';

export const createNxConfigBlock = (sources: string[] = []): ConfigBlock => ({
  [SOURCES]: getNxConfigs(sources),
});
