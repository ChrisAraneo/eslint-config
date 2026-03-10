import { DepConstraint } from '@nx/eslint-plugin/src/utils/runtime-lint-utils.js';
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
  | typeof NX
  | typeof IGNORED;

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
  shouldResolveAppRootDir?: boolean;
}

export interface AngularConfigOptions {
  prefix?: string;
  sources?: string[];
  tests?: string[];
  templates?: string[];
  jsons?: string[];
  ignored?: string[];
  tsconfigRootDir?: string;
  shouldResolveAppRootDir?: boolean;
}

export interface JsonConfigOptions {
  jsons?: string[];
}

export interface NxConfigOptions {
  sources?: string[];
  rulesConfig?: NxConfigRulesConfig;
}

export interface NxConfigRulesConfig {
  dependencyChecks?: DependencyChecksRuleConfig;
  enforceModuleBoundaries?: EnforceModuleBoundariesRuleConfig;
  nxPluginChecks?: NxPluginChecksRuleConfig;
}

export interface IgnoredOptions {
  ignored?: string[];
}

export interface EnforceModuleBoundariesRuleConfig {
  allow: string[];
  buildTargets: string[];
  depConstraints: DepConstraint[];
  enforceBuildableLibDependency: boolean;
  allowCircularSelfDependency: boolean;
  ignoredCircularDependencies: [string, string][];
  checkDynamicDependenciesExceptions: string[];
  banTransitiveDependencies: boolean;
  checkNestedExternalImports: boolean;
}

export interface DependencyChecksRuleConfig {
  buildTargets?: string[];
  checkMissingDependencies?: boolean;
  checkObsoleteDependencies?: boolean;
  checkVersionMismatches?: boolean;
  ignoredDependencies?: string[];
  ignoredFiles?: string[];
  includeTransitiveDependencies?: boolean;
  useLocalPathsForWorkspaceDependencies?: boolean;
  peerDepsVersionStrategy?: 'installed' | 'workspace';
  runtimeHelpers?: string[];
}

export interface NxPluginChecksRuleConfig {
  generatorsJson?: string;
  executorsJson?: string;
  migrationsJson?: string;
  packageJson?: string;
  allowedVersionStrings?: string[];
  tsConfig?: string;
}
