import { ConfigBlock, NxConfigRulesConfig, SOURCES } from '../interfaces.js';
import { getNxConfigs } from './nx.js';

export const createNxConfigBlock = (
  sources: string[] = [],
  rulesConfig?: NxConfigRulesConfig,
): ConfigBlock => ({
  [SOURCES]: getNxConfigs(sources, rulesConfig),
});
