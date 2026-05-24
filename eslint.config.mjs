import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  {
    ignores: [
      "husky-hooks.config.cjs",
      "husky-hooks.config.default.cjs",
      "prettier.config.js",
      "lib/*"
    ],
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        require: "readonly",
        __dirname: "readonly",
        module: "readonly",
        exports: "readonly",
        Buffer: "readonly",
        setTimeout: "readonly",
        fetch: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": ts,
    },
    rules: {
      ...ts.configs.recommended.rules,
      ...ts.configs.strict.rules,
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: ["src/__tests__/**/*.ts"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        jest: "readonly",
      },
    },
  },
  prettier,
];
