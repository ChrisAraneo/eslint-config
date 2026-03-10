import { ConfigBlock, NxConfigRulesConfig, SOURCES } from '../interfaces.js';
import { getNxConfigs } from './nx.js';

export const createNxConfigBlock = ({
  rulesConfig,
  sources = [],
}: {
  sources?: string[];
  rulesConfig?: NxConfigRulesConfig;
} = {}): ConfigBlock => ({
  [SOURCES]: getNxConfigs({ rulesConfig, sources }),
});
