import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';

import { createAngularConfigBlock } from './angular/index.js';
import {
  AngularConfigOptions,
  BuilderOptions,
  ConfigBlock,
  IGNORED,
  IgnoredConfigOptions,
  JsonConfigOptions,
  JSONS,
  NX,
  NxConfigOptions,
  SOURCES,
  TEMPLATES,
  TESTS,
  TypeScriptConfigOptions,
  TypeScriptTestConfigOptions,
} from './interfaces.js';
import { createJsonConfigBlock } from './json/index.js';
import { createNxConfigBlock } from './nx/index.js';
import {
  createTypeScriptConfigBlock,
  createTypeScriptTestsConfigBlock,
} from './typescript/index.js';
import { addCrossConfigOffRules } from './utils.js';

export class ESLintConfigBuilder {
  private configBlocks: ConfigBlock = {};

  addTypeScript(options: TypeScriptConfigOptions): this {
    const { shouldResolveAppRootDir, sources = [], tsconfigRootDir } = options;

    this.configBlocks = {
      ...this.configBlocks,
      ...createTypeScriptConfigBlock(
        sources,
        tsconfigRootDir,
        shouldResolveAppRootDir,
      ),
    };

    return this;
  }

  addTypeScriptTests(options: TypeScriptTestConfigOptions): this {
    return this.addConfigBlock(
      createTypeScriptTestsConfigBlock(
        options?.sources,
        options?.tsconfigRootDir,
      ),
    );
  }

  addAngularConfigs(options: AngularConfigOptions): this {
    return this.addConfigBlock(
      createAngularConfigBlock(
        options?.prefix,
        options?.sources,
        options?.templates,
        options?.jsons,
        options?.ignored,
      ),
    );
  }

  addJson(options: JsonConfigOptions): this {
    return this.addConfigBlock(createJsonConfigBlock(options?.jsons));
  }

  addNx(options: NxConfigOptions): this {
    return this.addConfigBlock(createNxConfigBlock(options?.sources));
  }

  addIgnored(options: IgnoredConfigOptions): this {
    return this.addConfigBlock({
      [IGNORED]: [
        {
          ignores: options?.ignored,
        },
      ],
    });
  }

  build(options?: BuilderOptions): Linter.Config[] {
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

  private addConfigBlock(block: ConfigBlock): this {
    this.configBlocks[SOURCES] = [
      ...(this.configBlocks[SOURCES] ?? []),
      ...(block[SOURCES] ?? []),
    ];
    this.configBlocks[TESTS] = [
      ...(this.configBlocks[TESTS] ?? []),
      ...(block[TESTS] ?? []),
    ];
    this.configBlocks[TEMPLATES] = [
      ...(this.configBlocks[TEMPLATES] ?? []),
      ...(block[TEMPLATES] ?? []),
    ];
    this.configBlocks[JSONS] = [
      ...(this.configBlocks[JSONS] ?? []),
      ...(block[JSONS] ?? []),
    ];
    this.configBlocks[NX] = [
      ...(this.configBlocks[NX] ?? []),
      ...(block[NX] ?? []),
    ];
    this.configBlocks[IGNORED] = [
      ...(this.configBlocks[IGNORED] ?? []),
      ...(block[IGNORED] ?? []),
    ];

    return this;
  }
}

export const createConfigBuilder = (): ESLintConfigBuilder =>
  new ESLintConfigBuilder();
