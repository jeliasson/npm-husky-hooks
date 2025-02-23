import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import importHelpers from "eslint-plugin-import-helpers";

export default [
  js.configs.recommended, // Use ESLint's recommended JavaScript rules
  {
    files: ["**/*.ts", "**/*.tsx"], // Apply these settings to TypeScript files
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
      ...ts.configs.recommended.rules, // Use recommended TypeScript rules
      ...ts.configs.strict.rules, // Stricter TypeScript rules
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
