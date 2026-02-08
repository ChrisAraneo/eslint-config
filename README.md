<h1 align="center">@chris.araneo/eslint-config</h1>

<p align="center">
  <img src="https://avatars.githubusercontent.com/u/6019716" alt="Official @eslint GitHub user avatar" width="256px" height="256px"/>
  <br>
  <a href="https://github.com/ChrisAraneo/eslint-config/blob/master/package.json"><img src="https://img.shields.io/badge/version-v0.0.106-blue" alt="version"></a>
  <a href="https://github.com/ChrisAraneo/eslint-config/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="@chris.araneo/eslint-config is released under the MIT license."></a>
  <a href="https://github.com/ChrisAraneo/eslint-config/actions/workflows/ci.yml"><img alt="GitHub CI Status" src="https://img.shields.io/github/actions/workflow/status/ChrisAraneo/eslint-config/ci.yml?label=CI&logo=GitHub"></a>
  <br>
  <br>
  <em>Simple ESLint configuration builder for TypeScript, Angular, JSON, and Nx</em>
  <br>
</p>

## Installation

```bash
npm install --save-dev @chris.araneo/eslint-config
```

## Quick Start

Create an `eslint.config.mjs` file in your project root:

```javascript
import { configBuilder } from '@chris.araneo/eslint-config';

export default configBuilder()
  .addTypeScriptConfig({
    sources: ['src/**/*.ts'],
  })
  .addIgnored({
    ignored: ['dist/**', 'node_modules/**'],
  })
  .build();
```

## Included Plugins

This configuration includes the following ESLint plugins:

- `**typescript-eslint**`: TypeScript-specific linting rules
- `**angular-eslint**`: Angular-specific linting rules
- `**@nx/eslint-plugin**`: Nx workspace linting rules
- `**eslint-plugin-jsonc**`: JSON and JSONC linting
- `**eslint-plugin-perfectionist**`: Sorting and organizing imports, objects, etc.
- `**eslint-plugin-simple-import-sort**`: Simple import sorting
- `**eslint-plugin-unicorn**`: Various awesome ESLint rules

## Usage

### TypeScript Configuration

Add TypeScript linting for your source files:

```javascript
configBuilder()
  .addTypeScriptConfig({
    sources: ['src/**/*.ts'],
    tsconfigRootDir: import.meta.dirname,
    shouldResolveAppRootDir: false,
  })
  .build();
```

- `sources` (optional): Array of glob patterns for TypeScript files (default: `[]`)
- `tsconfigRootDir` (optional): Root directory for TypeScript configuration
- `shouldResolveAppRootDir` (optional): Whether to resolve the app root directory (default: `false`)

### TypeScript Tests Configuration

Add specific linting rules for test files:

```javascript
configBuilder()
  .addTypeScriptTestsConfig({
    sources: ['**/*.spec.ts', '**/*.test.ts'],
    tsconfigRootDir: import.meta.dirname,
  })
  .build();
```

- `sources` (optional): Array of glob patterns for test files (default: `[]`)
- `tsconfigRootDir` (optional): Root directory for TypeScript configuration

### Angular Configuration

Add Angular-specific linting rules:

```javascript
configBuilder()
  .addAngularConfig({
    prefix: 'app',
    sources: ['src/**/*.ts'],
    tests: ['**/*.spec.ts'],
    templates: ['**/*.html'],
    jsons: ['**/*.json'],
    ignored: ['**/generated/**'],
  })
  .build();
```

- `prefix` (optional): Angular component selector prefix (default: `'app'`)
- `sources` (optional): Array of glob patterns for Angular TypeScript files (default: `[]`)
- `tests` (optional): Array of glob patterns for Angular test files (default: `[]`)
- `templates` (optional): Array of glob patterns for Angular HTML templates (default: `[]`)
- `jsons` (optional): Array of glob patterns for JSON files (default: `[]`)
- `ignored` (optional): Array of glob patterns for files to ignore (default: `[]`)

### JSON Configuration

Add linting for JSON files:

```javascript
configBuilder()
  .addJsonConfig({
    jsons: ['**/*.json', 'tsconfig.json'],
  })
  .build();
```

- `jsons` (optional): Array of glob patterns for JSON files (default: `[]`)

### Nx Configuration

Add Nx-specific linting rules for monorepos:

```javascript
configBuilder()
  .addNxConfig({
    sources: ['apps/**/*', 'libs/**/*'],
  })
  .build();
```

- `sources` (optional): Array of glob patterns for Nx workspace files (default: `[]`)

### Ignored Files

Specify files and directories to ignore:

```javascript
configBuilder()
  .addIgnored({
    ignored: ['dist/**', 'coverage/**', 'node_modules/**'],
  })
  .build();
```

- `ignored` (optional): Array of glob patterns for files to ignore (default: `[]`)

## Example

Here's a comprehensive example for an Angular + Nx monorepo:

```javascript
import { configBuilder } from '@chris.araneo/eslint-config';

export default configBuilder()
  .addAngularConfig({
    prefix: 'app',
    sources: ['src/**/*.ts', 'apps/**/*.ts', 'libs/**/*.ts'],
    tests: ['**/*.spec.ts'],
    templates: ['**/*.html'],
  })
  .addNxConfig({
    sources: ['apps/**/*', 'libs/**/*'],
  })
  .addIgnoredConfig({
    ignored: ['dist/**', 'coverage/**', 'node_modules/**', '.angular/**'],
  })
  .build();
```

## API Reference

### `configBuilder()`

Creates a new instance of the `ESLintConfigBuilder`.

### `ESLintConfigBuilder`

#### Methods

- `addTypeScript(options)`: Add TypeScript configuration
- `addTypeScriptTests(options)`: Add TypeScript test configuration
- `addAngularConfigs(options)`: Add Angular configuration
- `addJson(options)`: Add JSON configuration
- `addNx(options)`: Add Nx configuration
- `addIgnored(options)`: Add ignored files configuration
- `build(options?)`: Build and return the final ESLint configuration
- `reset()`: Reset the builder to its initial state

All `add*` methods return `this` for method chaining.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Krzysztof Pająk (Chris Araneo) - chris.araneo@gmail.com
