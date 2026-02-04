import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';
import type { InfiniteDepthConfigWithExtends } from 'typescript-eslint';

import { getAngularSourcesConfigs } from './angular/angular-eslint.js';
import { getAngularTemplatesConfigs } from './angular/angular-eslint-template.js';
import {
  AngularSourceConfigOptions,
  AngularTemplateConfigOptions,
  BuilderOptions,
  IgnoredConfigOptions,
  JsonConfigOptions,
  NxConfigOptions,
  TypeScriptConfigOptions,
  TypeScriptTestConfigOptions,
} from './interfaces.js';
import { getJsoncConfigs } from './json/jsonc.js';
import { getNxConfigs } from './nx/nx.js';
import {
  createTypeScriptConfigs,
  createTypeScriptTestsConfigs,
} from './typescript/index.js';
import { addCrossConfigOffRules } from './utils.js';

export interface ConfigBlocks {
  typescript?: Linter.Config[];
  typescriptTests?: Linter.Config[];
  angularSources?: Linter.Config[];
  angularTemplates?: Linter.Config[];
  json?: Linter.Config[];
  nx?: InfiniteDepthConfigWithExtends[];
  ignored?: Linter.Config[];
  [key: string]: Linter.Config[] | InfiniteDepthConfigWithExtends[] | undefined;
}

export class ESLintConfigBuilder {
  private configBlocks: ConfigBlocks = {};

  addTypeScript(options: TypeScriptConfigOptions): this {
    const { shouldResolveAppRootDir, sources = [], tsconfigRootDir } = options;
    this.configBlocks.typescript = createTypeScriptConfigs(
      sources,
      tsconfigRootDir,
      shouldResolveAppRootDir,
    );
    return this;
  }

  addTypeScriptTests(options: TypeScriptTestConfigOptions): this {
    const { sources = [], tsconfigRootDir } = options;
    this.configBlocks.typescriptTests = createTypeScriptTestsConfigs(
      sources,
      tsconfigRootDir,
    );
    return this;
  }

  addAngularSources(options: AngularSourceConfigOptions): this {
    const { prefix = 'app', sources = [] } = options;
    this.configBlocks.angularSources = getAngularSourcesConfigs(
      prefix,
      sources,
    );
    return this;
  }

  addAngularTemplates(options: AngularTemplateConfigOptions): this {
    const { templates = [] } = options;
    this.configBlocks.angularTemplates = getAngularTemplatesConfigs(templates);
    return this;
  }

  addJson(options: JsonConfigOptions): this {
    const { jsons = [] } = options;
    this.configBlocks.json = getJsoncConfigs(jsons);
    return this;
  }

  addNx(options: NxConfigOptions): this {
    const { sources = [] } = options;
    this.configBlocks.nx = getNxConfigs(sources);
    return this;
  }

  addIgnored(options: IgnoredConfigOptions): this {
    const { ignored } = options;
    this.configBlocks.ignored = ignored
      ? [
          {
            ignores: ignored,
          },
        ]
      : [];
    return this;
  }

  addCustom(key: string, configs: Linter.Config[]): this {
    this.configBlocks[key] = configs;
    return this;
  }

  build(options?: BuilderOptions): InfiniteDepthConfigWithExtends[] {
    const configsWithValues: Record<string, Linter.Config[]> = {};

    for (const [key, value] of Object.entries(this.configBlocks)) {
      if (value && value.length > 0) {
        configsWithValues[key] = value as Linter.Config[];
      }
    }

    return defineConfig(
      addCrossConfigOffRules(configsWithValues, { order: options?.order }),
    );
  }

  reset(): this {
    this.configBlocks = {};
    return this;
  }
}

export const createConfigBuilder = (): ESLintConfigBuilder =>
  new ESLintConfigBuilder();
