#!/usr/bin/env node

/**
 * Commit Message Validator Script
 * 
 * This script checks if commit messages conform to the
 * Conventional Commits standard.
 * 
 * Usage: node scripts/commit-msg.mjs <commit-msg-file>
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Color codes
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

// Allowed commit types
const ALLOWED_TYPES = [
  'feat',     // New feature
  'fix',      // Bug fix
  'docs',     // Documentation
  'style',    // Code style (formatting, whitespace, etc.)
  'refactor', // Refactoring
  'perf',     // Performance
  'test',     // Tests
  'build',    // Build system
  'ci',       // CI/CD
  'chore',    // Other
  'revert',   // Revert
];

// Example scopes (optional)
const EXAMPLE_SCOPES = ['shell', 'platform', 'traffic', 'reports', 'admin'];

// Commit message regex pattern
// Format: type(scope)?: subject
const COMMIT_PATTERN = /^(\w+)(\([\w-]+\))?!?:\s(.+)$/;

function validateCommitMessage(message) {
  const errors = [];
  const warnings = [];
  
  // Empty message check
  if (!message || message.trim() === '') {
    errors.push('Commit message cannot be empty.');
    return { valid: false, errors, warnings };
  }
  
  // Get first line
  const firstLine = message.split('\n')[0].trim();
  
  // Pattern match
  const match = firstLine.match(COMMIT_PATTERN);
  
  if (!match) {
    errors.push('Commit message format is invalid.');
    errors.push('Expected format: <type>(<scope>): <subject>');
    errors.push(`Example: feat(shell): add new sidebar component`);
    return { valid: false, errors, warnings };
  }
  
  const [, type, scope, subject] = match;
  
  // Type check
  if (!ALLOWED_TYPES.includes(type)) {
    errors.push(`Invalid type: "${type}"`);
    errors.push(`Allowed types: ${ALLOWED_TYPES.join(', ')}`);
  }
  
  // Subject check
  if (subject.length < 3) {
    errors.push('Subject must be at least 3 characters.');
  }
  
  if (subject.endsWith('.')) {
    warnings.push('Subject should not end with a period.');
  }
  
  if (subject[0] === subject[0].toUpperCase() && /[A-Z]/.test(subject[0])) {
    warnings.push('Subject should start with lowercase.');
  }
  
  // Header length check
  if (firstLine.length > 100) {
    errors.push(`Header is too long (${firstLine.length}/100 characters).`);
  }
  
  return {
    valid: errors.length === 0,
    type,
    scope: scope ? scope.slice(1, -1) : null,
    subject,
    errors,
    warnings,
  };
}

function printHelp() {
  console.log(`
${colors.bold}Conventional Commits Format${colors.reset}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${colors.blue}Format:${colors.reset} <type>(<scope>): <subject>

${colors.blue}Types:${colors.reset}
  ${colors.green}feat${colors.reset}     - New feature
  ${colors.green}fix${colors.reset}      - Bug fix
  ${colors.green}docs${colors.reset}     - Documentation change
  ${colors.green}style${colors.reset}    - Code style change
  ${colors.green}refactor${colors.reset} - Refactoring
  ${colors.green}perf${colors.reset}     - Performance improvement
  ${colors.green}test${colors.reset}     - Adding/updating tests
  ${colors.green}build${colors.reset}    - Build system change
  ${colors.green}ci${colors.reset}       - CI/CD change
  ${colors.green}chore${colors.reset}    - Other changes
  ${colors.green}revert${colors.reset}   - Revert commit

${colors.blue}Example Scopes:${colors.reset} ${EXAMPLE_SCOPES.join(', ')}

${colors.blue}Examples:${colors.reset}
  feat(shell): add new sidebar component
  fix(platform): resolve query cache issue
  docs: update README with examples
  chore: update dependencies
`);
}

function main() {
  const args = process.argv.slice(2);
  
  // Help flag check
  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    process.exit(0);
  }
  
  // Commit message file check
  if (args.length === 0) {
    console.error(`${colors.red}Error: Commit message file not specified.${colors.reset}`);
    console.log('Usage: node scripts/commit-msg.mjs <commit-msg-file>');
    process.exit(1);
  }
  
  const commitMsgFile = resolve(args[0]);
  
  let message;
  try {
    message = readFileSync(commitMsgFile, 'utf-8').trim();
  } catch (error) {
    console.error(`${colors.red}Error: Could not read file: ${commitMsgFile}${colors.reset}`);
    process.exit(1);
  }
  
  // Clean comment lines
  const cleanMessage = message
    .split('\n')
    .filter(line => !line.startsWith('#'))
    .join('\n')
    .trim();
  
  const result = validateCommitMessage(cleanMessage);
  
  // Print results
  console.log('');
  console.log(`${colors.bold}Commit Message Validation${colors.reset}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Message: ${colors.blue}${cleanMessage.split('\n')[0]}${colors.reset}`);
  console.log('');
  
  if (result.errors.length > 0) {
    console.log(`${colors.red}${colors.bold}Errors:${colors.reset}`);
    result.errors.forEach(error => {
      console.log(`  ${colors.red}✗${colors.reset} ${error}`);
    });
    console.log('');
  }
  
  if (result.warnings.length > 0) {
    console.log(`${colors.yellow}${colors.bold}Warnings:${colors.reset}`);
    result.warnings.forEach(warning => {
      console.log(`  ${colors.yellow}⚠${colors.reset} ${warning}`);
    });
    console.log('');
  }
  
  if (result.valid) {
    console.log(`${colors.green}${colors.bold}✓ Commit message is valid!${colors.reset}`);
    if (result.type) {
      console.log(`  Type: ${result.type}`);
      if (result.scope) console.log(`  Scope: ${result.scope}`);
      console.log(`  Subject: ${result.subject}`);
    }
    process.exit(0);
  } else {
    console.log(`${colors.red}${colors.bold}✗ Commit message is invalid!${colors.reset}`);
    console.log('');
    printHelp();
    process.exit(1);
  }
}

main();
