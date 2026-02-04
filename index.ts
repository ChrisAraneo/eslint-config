import { createConfigBuilder } from './src/builder.js';

/**
 * Builder for incrementally constructing ESLint configurations.
 * Allows adding different config blocks and building the final configuration.
 *
 * @example
 * ```typescript
 * const config = createConfigBuilder()
 *   .addTypeScript({ sources: ['src/**\/*.ts'] })
 *   .addJson({ jsons: ['**\/*.json'] })
 *   .addIgnored({ ignored: ['dist/**'] })
 *   .build({ order: ['typescript', 'json', 'ignored'] });
 * ```
 */
export { createConfigBuilder };
