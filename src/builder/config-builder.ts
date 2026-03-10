import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';

import { createAngularConfigBlock } from '../angular/index.js';
import {
  AngularConfigOptions,
  ConfigBlock,
  IGNORED,
  IgnoredOptions,
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
import { getOptionalArrayOrThrow } from '../utils/get-optional-array-or-throw.js';
import { getOptionalBooleanOrThrow } from '../utils/get-optional-boolean-or-throw.js';
import { getOptionalObjectOrThrow } from '../utils/get-optional-object-or-throw.js';
import { getOptionalStringOrThrow } from '../utils/get-optional-string-or-throw.js';
import { appendCrossConfigFilesToIgnores } from './append-cross-config-files-to-ignores.js';

class ESLintConfigBuilder {
  private configBlocks: ConfigBlock = {};

  addTypeScriptConfig(options: TypeScriptConfigOptions): this {
    return this.addConfigBlock({
      block: createTypeScriptConfigBlock({
        shouldResolveAppRootDir: getOptionalBooleanOrThrow({
          key: 'shouldResolveAppRootDir',
          obj: options,
        }),
        sources: getOptionalArrayOrThrow({ key: 'sources', obj: options }),
        tsconfigRootDir: getOptionalStringOrThrow({
          key: 'tsconfigRootDir',
          obj: options,
        }),
      }),
    });
  }

  addTypeScriptTestsConfig(options: TypeScriptTestConfigOptions): this {
    return this.addConfigBlock({
      block: createTypeScriptTestsConfigBlock({
        shouldResolveAppRootDir: getOptionalBooleanOrThrow({
          key: 'shouldResolveAppRootDir',
          obj: options,
        }),
        sources: getOptionalArrayOrThrow({ key: 'sources', obj: options }),
        tsconfigRootDir: getOptionalStringOrThrow({
          key: 'tsconfigRootDir',
          obj: options,
        }),
      }),
    });
  }

  addAngularConfig(options: AngularConfigOptions): this {
    return this.addConfigBlock({
      block: createAngularConfigBlock({
        ignored: getOptionalArrayOrThrow({ key: 'ignored', obj: options }),
        jsons: getOptionalArrayOrThrow({ key: 'jsons', obj: options }),
        prefix: getOptionalStringOrThrow({ key: 'prefix', obj: options }),
        shouldResolveAppRootDir: getOptionalBooleanOrThrow({
          key: 'shouldResolveAppRootDir',
          obj: options,
        }),
        sources: getOptionalArrayOrThrow({ key: 'sources', obj: options }),
        templates: getOptionalArrayOrThrow({
          key: 'templates',
          obj: options,
        }),
        tests: getOptionalArrayOrThrow({ key: 'tests', obj: options }),
        tsconfigRootDir: getOptionalStringOrThrow({
          key: 'tsconfigRootDir',
          obj: options,
        }),
      }),
    });
  }

  addJsonConfig(options: JsonConfigOptions): this {
    return this.addConfigBlock({
      block: createJsonConfigBlock({
        jsons: getOptionalArrayOrThrow({ key: 'jsons', obj: options }),
      }),
    });
  }

  addNxConfig(options: NxConfigOptions): this {
    return this.addConfigBlock({
      block: createNxConfigBlock({
        rulesConfig: getOptionalObjectOrThrow({
          key: 'rulesConfig',
          obj: options,
        }) as NxConfigOptions['rulesConfig'],
        sources: getOptionalArrayOrThrow({ key: 'sources', obj: options }),
      }),
    });
  }

  addIgnored(options: IgnoredOptions): this {
    return this.addConfigBlock({
      block: {
        [IGNORED]: [
          {
            ignores: getOptionalArrayOrThrow({
              key: 'ignored',
              obj: options,
            }),
          },
        ],
      },
    });
  }

  build(): Linter.Config[] {
    this.configBlocks = appendCrossConfigFilesToIgnores({
      configBlock: this.configBlocks,
    });

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

  private addConfigBlock({ block }: { block: ConfigBlock }): this {
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
