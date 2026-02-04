import type { Linter } from 'eslint';
import { InfiniteDepthConfigWithExtends } from 'typescript-eslint';

export const SOURCES = Symbol('sources');
export const TESTS = Symbol('tests');
export const TEMPLATES = Symbol('templates');
export const JSONS = Symbol('jsons');
export const NX = Symbol('nx');
export const IGNORED = Symbol('ignored');

export interface ConfigBlock {
  [SOURCES]?: Linter.Config[] | InfiniteDepthConfigWithExtends[];
  [TESTS]?: Linter.Config[] | InfiniteDepthConfigWithExtends[];
  [TEMPLATES]?: Linter.Config[] | InfiniteDepthConfigWithExtends[];
  [JSONS]?: Linter.Config[] | InfiniteDepthConfigWithExtends[];
  [NX]?: Linter.Config[] | InfiniteDepthConfigWithExtends[];
  [IGNORED]?: Linter.Config[] | InfiniteDepthConfigWithExtends[];
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

export interface AngularSourceConfigOptions {
  prefix?: string;
  sources?: string[];
}

export interface AngularTemplateConfigOptions {
  templates?: string[];
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

export interface BuilderOptions {
  order?: string[];
}
