/**
 * ESLint Base Configuration
 * All apps can extend this config and add their own rules.
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    // React 17+ uses jsx-runtime, so React import is not required
    "react/react-in-jsx-scope": "off",
    
    // We use TypeScript instead of PropTypes
    "react/prop-types": "off",
    
    // Warning for unused variables (not error)
    "@typescript-eslint/no-unused-vars": ["warn", { 
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_" 
    }],
    
    // Warning for any type
    "@typescript-eslint/no-explicit-any": "warn",
    
    // Warning for console logs
    "no-console": ["warn", { allow: ["warn", "error"] }],
    
    // Hooks rules
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
  ignorePatterns: [
    "node_modules",
    "dist",
    "build",
    "*.config.js",
    "*.config.cjs",
    "*.config.ts",
    "*.d.ts",
    ".eslintrc.cjs",
  ],
};
