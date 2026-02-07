import type { Linter } from 'eslint';
import { isEmpty } from 'lodash-es';

import { disableAllRules } from './disable-all-rules.js';
import { findFirstFiles } from './find-first-files.js';

export const createOffRulesConfig = (
  files: Linter.Config['files'],
  configsToDisable: Linter.Config[],
): Linter.Config | null =>
  isEmpty(files) || isEmpty(configsToDisable)
    ? null
    : ({
        files: findFirstFiles(configsToDisable),
        name: 'off-rules',
        rules: disableAllRules(configsToDisable),
      } as unknown as Linter.Config);
