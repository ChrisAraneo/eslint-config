import { defineConfig } from 'eslint/config';
import { InfiniteDepthConfigWithExtends } from 'typescript-eslint';

import { getNxConfigs } from './nx.js';

export default (sources: string[] = []): InfiniteDepthConfigWithExtends[] =>
  defineConfig(getNxConfigs(sources));
