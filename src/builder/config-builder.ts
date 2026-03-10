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
import { appendCrossConfigFilesToIgnores } from './append-cross-config-files-to-ignores.js';

class ESLintConfigBuilder {
  private configBlocks: ConfigBlock = {};

  addTypeScriptConfig(options: TypeScriptConfigOptions): this {
    return this.addConfigBlock({
      block: createTypeScriptConfigBlock({
        shouldResolveAppRootDir: this.getOptionalBooleanOrThrow({
          key: 'shouldResolveAppRootDir',
          obj: options,
        }),
        sources: this.getOptionalArrayOrThrow({ key: 'sources', obj: options }),
        tsconfigRootDir: this.getOptionalStringOrThrow({
          key: 'tsconfigRootDir',
          obj: options,
        }),
      }),
    });
  }

  addTypeScriptTestsConfig(options: TypeScriptTestConfigOptions): this {
    return this.addConfigBlock({
      block: createTypeScriptTestsConfigBlock({
        shouldResolveAppRootDir: this.getOptionalBooleanOrThrow({
          key: 'shouldResolveAppRootDir',
          obj: options,
        }),
        sources: this.getOptionalArrayOrThrow({ key: 'sources', obj: options }),
        tsconfigRootDir: this.getOptionalStringOrThrow({
          key: 'tsconfigRootDir',
          obj: options,
        }),
      }),
    });
  }

  addAngularConfig(options: AngularConfigOptions): this {
    return this.addConfigBlock({
      block: createAngularConfigBlock({
        ignored: this.getOptionalArrayOrThrow({ key: 'ignored', obj: options }),
        jsons: this.getOptionalArrayOrThrow({ key: 'jsons', obj: options }),
        prefix: this.getOptionalStringOrThrow({ key: 'prefix', obj: options }),
        shouldResolveAppRootDir: this.getOptionalBooleanOrThrow({
          key: 'shouldResolveAppRootDir',
          obj: options,
        }),
        sources: this.getOptionalArrayOrThrow({ key: 'sources', obj: options }),
        templates: this.getOptionalArrayOrThrow({
          key: 'templates',
          obj: options,
        }),
        tests: this.getOptionalArrayOrThrow({ key: 'tests', obj: options }),
        tsconfigRootDir: this.getOptionalStringOrThrow({
          key: 'tsconfigRootDir',
          obj: options,
        }),
      }),
    });
  }

  addJsonConfig(options: JsonConfigOptions): this {
    return this.addConfigBlock({
      block: createJsonConfigBlock({
        jsons: this.getOptionalArrayOrThrow({ key: 'jsons', obj: options }),
      }),
    });
  }

  addNxConfig(options: NxConfigOptions): this {
    return this.addConfigBlock({
      block: createNxConfigBlock({
        rulesConfig: this.getOptionalObjectOrThrow({
          key: 'rulesConfig',
          obj: options,
        }) as NxConfigOptions['rulesConfig'],
        sources: this.getOptionalArrayOrThrow({ key: 'sources', obj: options }),
      }),
    });
  }

  addIgnored(options: IgnoredOptions): this {
    return this.addConfigBlock({
      block: {
        [IGNORED]: [
          {
            ignores: this.getOptionalArrayOrThrow({
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

  private getOptionalArrayOrThrow<T extends object>({
    key,
    obj,
  }: {
    obj: T;
    key: keyof T;
  }): string[] | undefined {
    if (!obj) {
      throw new Error(`Expected an object`);
    }

    const value = obj[key];

    if (value !== undefined && (value === null || !Array.isArray(value))) {
      throw new Error(`${String(key)} must be an array or undefined`);
    }

    return value as string[] | undefined;
  }

  private getOptionalStringOrThrow<T extends object>({
    key,
    obj,
  }: {
    obj: T;
    key: keyof T;
  }): string | undefined {
    if (!obj) {
      throw new Error(`Expected an object`);
    }

    const value = obj[key];

    if (value !== undefined && typeof value !== 'string') {
      throw new Error(`${String(key)} must be a string or undefined`);
    }

    return value as string | undefined;
  }

  private getOptionalBooleanOrThrow<T extends object>({
    key,
    obj,
  }: {
    obj: T;
    key: keyof T;
  }): boolean | undefined {
    if (!obj) {
      throw new Error(`Expected an object`);
    }

    const value = obj[key];

    if (value !== undefined && (value === null || typeof value !== 'boolean')) {
      throw new Error(`${String(key)} must be a boolean or undefined`);
    }

    return value as boolean | undefined;
  }

  private getOptionalObjectOrThrow<T extends object>({
    key,
    obj,
  }: {
    obj: T;
    key: keyof T;
  }): Record<string, unknown> | undefined {
    if (!obj) {
      throw new Error(`Expected an object`);
    }

    const value = obj[key];

    if (
      value !== undefined &&
      (value === null || typeof value !== 'object' || Array.isArray(value))
    ) {
      throw new Error(`${String(key)} must be an object or undefined`);
    }

    return value as Record<string, unknown> | undefined;
  }
}

export const configBuilder = (): ESLintConfigBuilder =>
  new ESLintConfigBuilder();
