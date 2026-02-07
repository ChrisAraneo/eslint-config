import type { Linter } from 'eslint';

export const SOURCES = Symbol('sources');
export const TESTS = Symbol('tests');
export const TEMPLATES = Symbol('templates');
export const JSONS = Symbol('jsons');
export const NX = Symbol('nx');
export const IGNORED = Symbol('ignored');

export type ConfigKey =
  | typeof SOURCES
  | typeof TESTS
  | typeof TEMPLATES
  | typeof JSONS
  | typeof NX;

export interface ConfigBlock {
  [SOURCES]?: Linter.Config[];
  [TESTS]?: Linter.Config[];
  [TEMPLATES]?: Linter.Config[];
  [JSONS]?: Linter.Config[];
  [NX]?: Linter.Config[];
  [IGNORED]?: Linter.Config[];
}

export interface TypeScriptConfigOptions {
  sources?: string[];
  tsconfigRootDir?: string;
  shouldResolveAppRootDir?: boolean;
}

export interface TypeScriptTestConfigOptions {
  sources?: string[];
  tsconfigRootDir?: string;
}

export interface AngularConfigOptions {
  prefix?: string;
  sources?: string[];
  tests?: string[];
  templates?: string[];
  jsons?: string[];
  ignored?: string[];
}

export interface JsonConfigOptions {
  jsons?: string[];
}

export interface NxConfigOptions {
  sources?: string[];
}

export interface IgnoredConfigOptions {
  ignored?: string[];
}
