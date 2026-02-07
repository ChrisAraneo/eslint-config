import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';

import { createAngularConfigBlock } from '../angular/index.js';
import {
  AngularConfigOptions,
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
} from '../interfaces.js';
import { createJsonConfigBlock } from '../json/index.js';
import { createNxConfigBlock } from '../nx/index.js';
import {
  createTypeScriptConfigBlock,
  createTypeScriptTestsConfigBlock,
} from '../typescript/index.js';
import { addCrossConfigOffRules } from './add-cross-config-off-rules.js';

class ESLintConfigBuilder {
  private configBlocks: ConfigBlock = {};

  addTypeScriptConfig(options: TypeScriptConfigOptions): this {
    const { shouldResolveAppRootDir, sources = [], tsconfigRootDir } = options;

    return this.addConfigBlock(
      createTypeScriptConfigBlock(
        sources,
        tsconfigRootDir,
        shouldResolveAppRootDir,
      ),
    );
  }

  addTypeScriptTestsConfig(options: TypeScriptTestConfigOptions): this {
    const { sources = [], tsconfigRootDir } = options;

    return this.addConfigBlock(
      createTypeScriptTestsConfigBlock(sources, tsconfigRootDir),
    );
  }

  addAngularConfig(options: AngularConfigOptions): this {
    const {
      ignored,
      jsons = [],
      prefix = 'app',
      sources = [],
      templates = [],
      tests = [],
    } = options;

    return this.addConfigBlock(
      createAngularConfigBlock(
        prefix,
        sources,
        tests,
        templates,
        jsons,
        ignored,
      ),
    );
  }

  addJsonConfig(options: JsonConfigOptions): this {
    const { jsons = [] } = options;

    return this.addConfigBlock(createJsonConfigBlock(jsons));
  }

  addNxConfig(options: NxConfigOptions): this {
    const { sources = [] } = options;

    return this.addConfigBlock(createNxConfigBlock(sources));
  }

  addIgnoredConfig(options: IgnoredConfigOptions): this {
    const { ignored } = options;
    return this.addConfigBlock({
      [IGNORED]: [
        {
          ignores: ignored,
        },
      ],
    });
  }

  build(): Linter.Config[] {
    this.configBlocks = addCrossConfigOffRules(this.configBlocks);

    return defineConfig([
      ...(this.configBlocks[SOURCES] ?? []),
      ...(this.configBlocks[TESTS] ?? []),
      ...(this.configBlocks[TEMPLATES] ?? []),
      ...(this.configBlocks[JSONS] ?? []),
      ...(this.configBlocks[NX] ?? []),
      ...(this.configBlocks[IGNORED] ?? []),
    ]);
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

export const configBuilder = (): ESLintConfigBuilder =>
  new ESLintConfigBuilder();
