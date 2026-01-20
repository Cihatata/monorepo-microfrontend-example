/**
 * Admin Domain ESLint Configuration
 * Extends base config and adds admin domain-specific rules.
 */
const baseConfig = require("../../.eslintrc.base.cjs");

module.exports = {
  ...baseConfig,
  root: true,
  rules: {
    ...baseConfig.rules,
    
    // Admin domain specific rules
    // Stricter security rules for admin panel
    
    // Console logs are forbidden in admin
    "no-console": ["error", { allow: ["warn", "error"] }],
    
    // Eval usage is forbidden (security)
    "no-eval": "error",
    
    // Any type is forbidden
    "@typescript-eslint/no-explicit-any": "error",
  },
};
