# @chris.araneo/eslint-config

A flexible and composable ESLint configuration builder for TypeScript, Angular, JSON, and Nx projects.

## Installation

```bash
npm install --save-dev @chris.araneo/eslint-config
```

## Quick Start

Create an `eslint.config.mjs` file in your project root:

```javascript
import { createConfigBuilder } from '@chris.araneo/eslint-config';

export default createConfigBuilder()
  .addTypeScript({
    sources: ['src/**/*.ts'],
  })
  .addIgnored({
    ignored: ['dist/**', 'node_modules/**'],
  })
  .build();
```

## Usage

### TypeScript Configuration

Add TypeScript linting for your source files:

```javascript
createConfigBuilder()
  .addTypeScript({
    sources: ['src/**/*.ts'],
    tsconfigRootDir: import.meta.dirname,
    shouldResolveAppRootDir: false,
  })
  .build();
```

**Options:**
- `sources` (optional): Array of glob patterns for TypeScript files (default: `[]`)
- `tsconfigRootDir` (optional): Root directory for TypeScript configuration
- `shouldResolveAppRootDir` (optional): Whether to resolve the app root directory (default: `false`)

### TypeScript Tests Configuration

Add specific linting rules for test files:

```javascript
createConfigBuilder()
  .addTypeScriptTests({
    sources: ['**/*.spec.ts', '**/*.test.ts'],
    tsconfigRootDir: import.meta.dirname,
  })
  .build();
```

**Options:**
- `sources` (optional): Array of glob patterns for test files (default: `[]`)
- `tsconfigRootDir` (optional): Root directory for TypeScript configuration

### Angular Configuration

Add Angular-specific linting rules:

```javascript
createConfigBuilder()
  .addAngularConfigs({
    prefix: 'app',
    sources: ['src/**/*.ts'],
  })
  .build();
```

**Options:**
- `prefix` (optional): Angular component selector prefix (default: `'app'`)
- `sources` (optional): Array of glob patterns for Angular files (default: `[]`)

### JSON Configuration

Add linting for JSON files:

```javascript
createConfigBuilder()
  .addJson({
    jsons: ['**/*.json', 'tsconfig.json'],
  })
  .build();
```

**Options:**
- `jsons` (optional): Array of glob patterns for JSON files (default: `[]`)

### Nx Configuration

Add Nx-specific linting rules for monorepos:

```javascript
createConfigBuilder()
  .addNx({
    sources: ['apps/**/*', 'libs/**/*'],
  })
  .build();
```

**Options:**
- `sources` (optional): Array of glob patterns for Nx workspace files (default: `[]`)

### Ignored Files

Specify files and directories to ignore:

```javascript
createConfigBuilder()
  .addIgnored({
    ignored: ['dist/**', 'coverage/**', 'node_modules/**'],
  })
  .build();
```

**Options:**
- `ignored` (optional): Array of glob patterns for files to ignore (default: `[]`)

## Example

Here's a comprehensive example for an Angular + Nx monorepo:

```javascript
import { createConfigBuilder } from '@chris.araneo/eslint-config';

export default createConfigBuilder()
  .addTypeScript({
    sources: ['src/**/*.ts', 'apps/**/*.ts', 'libs/**/*.ts'],
    tsconfigRootDir: import.meta.dirname,
  })
  .addTypeScriptTests({
    sources: ['**/*.spec.ts', '**/*.test.ts'],
    tsconfigRootDir: import.meta.dirname,
  })
  .addAngularConfigs({
    prefix: 'app',
    sources: ['src/**/*.ts', 'apps/**/*.ts', 'libs/**/*.ts'],
  })
  .addJson({
    jsons: ['**/*.json'],
  })
  .addNx({
    sources: ['apps/**/*', 'libs/**/*'],
  })
  .addIgnored({
    ignored: ['dist/**', 'coverage/**', 'node_modules/**', '.angular/**'],
  })
  .build({
    order: ['typescript', 'tests', 'angular', 'json', 'nx', 'ignored'],
  });
```

## Build Options

The `build()` method accepts optional configuration:

```javascript
.build({
  order: ['typescript', 'json', 'ignored']
})
```

**Options:**
- `order` (optional): Array specifying the order of configuration blocks

## Included Plugins

This configuration includes the following ESLint plugins:

- **typescript-eslint**: TypeScript-specific linting rules
- **angular-eslint**: Angular-specific linting rules
- **@nx/eslint-plugin**: Nx workspace linting rules
- **eslint-plugin-jsonc**: JSON and JSONC linting
- **eslint-plugin-perfectionist**: Sorting and organizing imports, objects, etc.
- **eslint-plugin-simple-import-sort**: Simple import sorting
- **eslint-plugin-unicorn**: Various awesome ESLint rules

## API Reference

### `createConfigBuilder()`

Creates a new instance of the ESLint configuration builder.

**Returns:** `ESLintConfigBuilder`

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

MIT © [Krzysztof Pająk (Chris Araneo)](mailto:chris.araneo@gmail.com)
