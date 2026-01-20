/**
 * Shell App ESLint Configuration
 * Extends base config and adds shell-specific rules.
 */
const baseConfig = require("../../.eslintrc.base.cjs");

module.exports = {
  ...baseConfig,
  root: true,
  rules: {
    ...baseConfig.rules,
    
    // Shell specific rules
    // Stricter rules since this is the host app
    
    // Console logs are forbidden in shell (only warn and error allowed)
    "no-console": ["error", { allow: ["warn", "error"] }],
    
    // Any type is forbidden in shell
    "@typescript-eslint/no-explicit-any": "error",
  },
  ignorePatterns: [
    ...baseConfig.ignorePatterns,
  ],
};
