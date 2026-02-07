import type { Config } from 'jest';

const config: Config = {
  collectCoverageFrom: [
    'src/**/*.ts',
    'index.ts',
    '!src/**/*.d.ts',
    '!**/__tests__/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  preset: 'ts-jest/presets/default-esm',
  roots: ['<rootDir>'],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts', '**/?(*.)+(spec|test).ts'],
  transformIgnorePatterns: ['node_modules/(?!(lodash-es)/)'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          allowUnreachableCode: false,
          alwaysStrict: true,
          esModuleInterop: true,
          lib: ['es2020', 'dom'],
          module: 'NodeNext',
          moduleResolution: 'nodenext',
          noImplicitAny: true,
          noImplicitReturns: true,
          noUncheckedIndexedAccess: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          skipLibCheck: true,
          strictNullChecks: true,
          target: 'es2020',
        },
        useESM: true,
      },
    ],
  },
};

export default config;
