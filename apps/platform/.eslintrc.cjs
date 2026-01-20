/**
 * Platform App ESLint Configuration
 * Extends base config and adds platform-specific rules.
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const baseConfig = require("../../.eslintrc.base.cjs");

module.exports = {
  ...baseConfig,
  root: true,
  rules: {
    ...baseConfig.rules,
    
    // Platform specific rules
    // Stricter rules since it provides shared services
    
    // Console logs are forbidden in platform
    "no-console": ["error", { allow: ["warn", "error"] }],
    
    // Any type is forbidden in platform (must be type-safe)
    "@typescript-eslint/no-explicit-any": "error",
    
    // Error for unused variables (because of exported modules)
    "@typescript-eslint/no-unused-vars": ["error", { 
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_" 
    }],
  },
};
