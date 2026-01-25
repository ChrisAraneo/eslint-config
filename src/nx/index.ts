import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';
import { InfiniteDepthConfigWithExtends } from 'typescript-eslint';

import { isEmpty } from '../utils.js';
import { getNxConfigs } from './nx.js';

export default (sources: string[] = []): InfiniteDepthConfigWithExtends[] => {
  const configs: Linter.Config[] = [];

  if (!isEmpty(sources)) {
    configs.push(...getNxConfigs(sources));
  }

  return defineConfig(configs);
};
