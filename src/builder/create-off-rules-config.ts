import type { Linter } from 'eslint';
import { isEmpty } from 'lodash-es';
import { match } from 'ts-pattern';

import { disableAllRules } from './disable-all-rules.js';
import { findFirstFiles } from './find-first-files.js';

export const createOffRulesConfig = (
  files: Linter.Config['files'],
  configsToDisable: Linter.Config[],
): Linter.Config | null =>
  match(isEmpty(files) || isEmpty(configsToDisable))
    .with(true, () => null)
    .otherwise(
      () =>
        ({
          files: findFirstFiles(configsToDisable),
          name: 'off-rules',
          rules: disableAllRules(configsToDisable),
        }) as unknown as Linter.Config,
    );
