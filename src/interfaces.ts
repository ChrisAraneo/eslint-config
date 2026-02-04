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
