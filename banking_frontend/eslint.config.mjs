/* eslint.config.mjs */
import typescript from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const browserGlobals = {
  React: 'readable',
  window: 'readable',
  document: 'readable',
  navigator: 'readable',
  localStorage: 'readable',
  fetch: 'readable',
  URLSearchParams: 'readable',
  console: 'readable',
  setTimeout: 'readable',
};

export default [
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      globals: browserGlobals,
    },
    plugins: {
      '@typescript-eslint': typescript,
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
    ignores: ["node_modules/**", "dist/**", "build/**"]
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      globals: browserGlobals,
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": "warn",
    }
  },
  // Global override to turn off a rule that would require react-hooks plugin which is not installed
  {
    rules: {
      "react-hooks/exhaustive-deps": "off",
    }
  }
];