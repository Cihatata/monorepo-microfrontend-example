/**
 * Commitlint Configuration
 * Uses Conventional Commits standard.
 * 
 * Format: <type>(<scope>): <subject>
 * 
 * Types:
 *   - feat:     New feature
 *   - fix:      Bug fix
 *   - docs:     Documentation only changes
 *   - style:    Changes that do not affect the meaning of the code (whitespace, formatting, etc.)
 *   - refactor: Code change that neither fixes a bug nor adds a feature
 *   - perf:     Performance improvement
 *   - test:     Adding or updating tests
 *   - build:    Changes that affect the build system or external dependencies
 *   - ci:       Changes to CI configuration files and scripts
 *   - chore:    Other changes (doesn't modify src or test files)
 *   - revert:   Reverts a previous commit
 * 
 * Scope (optional):
 *   - shell, platform, traffic, reports, admin, etc.
 * 
 * Examples:
 *   - feat(shell): add new sidebar component
 *   - fix(platform): resolve query cache issue
 *   - docs: update README
 *   - chore: update dependencies
 */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Type is required
    "type-empty": [2, "never"],
    
    // Type must be lowercase
    "type-case": [2, "always", "lower-case"],
    
    // Allowed types
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
      ],
    ],
    
    // Subject is required
    "subject-empty": [2, "never"],
    
    // Subject must not end with a period
    "subject-full-stop": [2, "never", "."],
    
    // Subject must start with lowercase
    "subject-case": [2, "always", "lower-case"],
    
    // Header maximum 100 characters
    "header-max-length": [2, "always", 100],
    
    // Scope must be lowercase
    "scope-case": [2, "always", "lower-case"],
  },
};
