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
    return this.addConfigBlock(
      createTypeScriptConfigBlock(
        this.getOptionalArrayOrThrow(options, 'sources'),
        this.getOptionalStringOrThrow(options, 'tsconfigRootDir'),
        this.getOptionalBooleanOrThrow(options, 'shouldResolveAppRootDir'),
      ),
    );
  }

  addTypeScriptTestsConfig(options: TypeScriptTestConfigOptions): this {
    return this.addConfigBlock(
      createTypeScriptTestsConfigBlock(
        this.getOptionalArrayOrThrow(options, 'sources'),
        this.getOptionalStringOrThrow(options, 'tsconfigRootDir'),
        this.getOptionalBooleanOrThrow(options, 'shouldResolveAppRootDir'),
      ),
    );
  }

  addAngularConfig(options: AngularConfigOptions): this {
    return this.addConfigBlock(
      createAngularConfigBlock(
        this.getOptionalStringOrThrow(options, 'prefix'),
        this.getOptionalArrayOrThrow(options, 'sources'),
        this.getOptionalArrayOrThrow(options, 'tests'),
        this.getOptionalArrayOrThrow(options, 'templates'),
        this.getOptionalArrayOrThrow(options, 'jsons'),
        this.getOptionalArrayOrThrow(options, 'ignored'),
        this.getOptionalStringOrThrow(options, 'tsconfigRootDir'),
        this.getOptionalBooleanOrThrow(options, 'shouldResolveAppRootDir'),
      ),
    );
  }

  addJsonConfig(options: JsonConfigOptions): this {
    return this.addConfigBlock(
      createJsonConfigBlock(this.getOptionalArrayOrThrow(options, 'jsons')),
    );
  }

  addNxConfig(options: NxConfigOptions): this {
    return this.addConfigBlock(
      createNxConfigBlock(
        this.getOptionalArrayOrThrow(options, 'sources'),
        this.getOptionalObjectOrThrow(options, 'rulesConfig'),
      ),
    );
  }

  addIgnored(options: IgnoredOptions): this {
    return this.addConfigBlock({
      [IGNORED]: [
        {
          ignores: this.getOptionalArrayOrThrow(options, 'ignored'),
        },
      ],
    });
  }

  build(): Linter.Config[] {
    this.configBlocks = appendCrossConfigFilesToIgnores(this.configBlocks);

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

  private getOptionalArrayOrThrow<T extends object>(
    obj: T,
    key: keyof T,
  ): string[] | undefined {
    if (!obj) {
      throw new Error(`Expected an object`);
    }

    const value = obj[key];

    if (value !== undefined && (value === null || !Array.isArray(value))) {
      throw new Error(`${String(key)} must be an array or undefined`);
    }

    return value as string[] | undefined;
  }

  private getOptionalStringOrThrow<T extends object>(
    obj: T,
    key: keyof T,
  ): string | undefined {
    if (!obj) {
      throw new Error(`Expected an object`);
    }

    const value = obj[key];

    if (value !== undefined && typeof value !== 'string') {
      throw new Error(`${String(key)} must be a string or undefined`);
    }

    return value as string | undefined;
  }

  private getOptionalBooleanOrThrow<T extends object>(
    obj: T,
    key: keyof T,
  ): boolean | undefined {
    if (!obj) {
      throw new Error(`Expected an object`);
    }

    const value = obj[key];

    if (value !== undefined && (value === null || typeof value !== 'boolean')) {
      throw new Error(`${String(key)} must be a boolean or undefined`);
    }

    return value as boolean | undefined;
  }

  private getOptionalObjectOrThrow<T extends object>(
    obj: T,
    key: keyof T,
  ): Record<string, unknown> | undefined {
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
