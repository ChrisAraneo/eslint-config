import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import angular from "angular-eslint";
import eslintPluginJsonc from "eslint-plugin-jsonc";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import jsoncParser from "jsonc-eslint-parser";

tseslint.config(
  ...eslintPluginJsonc.configs["flat/recommended-with-jsonc"],
  {
    files: ["src/**/*.json", "public/**/*.json"],
    languageOptions: {
      parser: jsoncParser,
    },
  },
  {
    files: ["src/**/*.{ts,js,mjs,cjs}"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      "@typescript-eslint/no-extraneous-class": "off",
    },
  },
  {
    files: ["src/**/*.{ts,js,mjs,cjs}"],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  {
    files: ["src/**/*.html"],
    extends: [...angular.configs.templateAll],
    rules: {},
  },
  {
    ignores: [
      "node_modules/",
      "reports/",
      ".stryker-tmp/",
      ".angular",
      "package.json",
      "package-lock.json",
    ],
  }
);
