/**
 * Reports Domain ESLint Configuration
 * Extends base config and adds reports domain-specific rules.
 */
const baseConfig = require("../../.eslintrc.base.cjs");

module.exports = {
  ...baseConfig,
  root: true,
  rules: {
    ...baseConfig.rules,
    
    // Reports domain specific rules
    
    // Allow some console usage for reporting
    "no-console": ["warn", { allow: ["warn", "error", "info", "table"] }],
  },
};
