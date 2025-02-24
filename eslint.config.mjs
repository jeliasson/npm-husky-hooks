import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import importHelpers from "eslint-plugin-import-helpers";

export default [
  js.configs.recommended,
  {
    ignores: [
      "husky-hooks.config.js",
      "husky-hooks.config.default.js",
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
    },
    plugins: {
      "@typescript-eslint": ts,
      "import-helpers": importHelpers,
    },
    rules: {
      ...ts.configs.recommended.rules,
      ...ts.configs.strict.rules,
      "import-helpers/order-imports": [
        "warn",
        {
          newlinesBetween: "always",
          groups: [
            "module",
            "absolute",
            ["/^..*/config/", "/^..*/types/"],
            "/^..*/cli/",
            ["/^..*/commands/", "/^..*/hooks/"],
            "/^@/",
            ["parent", "sibling", "index"],
          ],
          alphabetize: { order: "asc", ignoreCase: true },
        },
      ],
    },
  },
  prettier, // Use Prettier formatting
];
