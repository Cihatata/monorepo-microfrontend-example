/**
 * Traffic Domain ESLint Configuration
 * Extends base config and adds traffic domain-specific rules.
 */
const baseConfig = require("../../.eslintrc.base.cjs");

module.exports = {
  ...baseConfig,
  root: true,
  rules: {
    ...baseConfig.rules,
    
    // Traffic domain specific rules
    // More relaxed since it's a domain remote
    
    // Console logs allowed for development (warn)
    "no-console": ["warn", { allow: ["warn", "error", "info"] }],
    
    // Allow any usage in service files (temporary)
    // TODO: Make all services type-safe
    "@typescript-eslint/no-explicit-any": "warn",
  },
};
