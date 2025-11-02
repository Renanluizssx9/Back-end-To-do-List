import plugin from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import globals from "globals";

export default [
  {
    ignores: ["node_modules", "dist", ".next", "build"],
  },
  {
    files: ["**/*.{ts,tsx,js}"],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": plugin,
    },
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];
