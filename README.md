# Monorepo Micro-Frontend Example

A micro-frontend architecture example built with Rspack + Module Federation.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Shell (HOST) :3000                        │
│  ┌─────────────┬────────────────────────────────────────┐   │
│  │   Sidebar   │              Main Content              │   │
│  │             │  ┌──────────────────────────────────┐  │   │
│  │  - Home     │  │     Remote Pages (Lazy Load)     │  │   │
│  │  - Traffic  │  │                                  │  │   │
│  │  - Reports  │  │   Traffic   Reports    Admin     │  │   │
│  │  - Admin    │  │    :3002     :3003     :3004     │  │   │
│  │             │  └──────────────────────────────────┘  │   │
│  └─────────────┴────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                    Platform (REMOTE) :3001
                    - QueryClient singleton
                    - AppProviders
                    - Account hook
```

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Start all applications
pnpm dev
```

Open http://localhost:3000 in your browser.

## 🔒 Git Hooks (Lefthook)

This project uses [Lefthook](https://github.com/evilmartians/lefthook) to manage Git hooks.

### Installation

```bash
# Install dependencies (lefthook is automatically installed)
pnpm install
```

### Pre-commit Hooks

Runs automatically before each commit:

- **ESLint**: Code quality check
- **TypeScript**: Type checking
- **Format Check**: Code format validation

### Commit Message Format

This project uses the [Conventional Commits](https://www.conventionalcommits.org/) standard.

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation change
- `style`: Code style change (formatting, whitespace)
- `refactor`: Refactoring
- `perf`: Performance improvement
- `test`: Adding/updating tests
- `build`: Build system change
- `ci`: CI/CD change
- `chore`: Other changes
- `revert`: Revert commit

**Example Scopes:** `shell`, `platform`, `traffic`, `reports`, `admin`

**Examples:**
```bash
feat(shell): add new sidebar component
fix(platform): resolve query cache issue
docs: update README with examples
chore: update dependencies
```

## 🔍 Linting

```bash
# Lint the entire project
pnpm lint

# Auto-fix errors
pnpm lint:fix

# Lint a specific app only
pnpm --filter @mf/shell lint
```

### ESLint Configuration

Base config is defined at root (`.eslintrc.base.cjs`). Each app can extend this config and add its own rules.

```javascript
// apps/my-app/.eslintrc.cjs
const baseConfig = require("../../.eslintrc.base.cjs");

module.exports = {
  ...baseConfig,
  rules: {
    ...baseConfig.rules,
    // App-specific rules
    "no-console": "error",
  },
};
```

## 📦 Applications

| Application | Port | Description |
|-------------|------|-------------|
| shell       | 3000 | Main application (HOST) |
| platform    | 3001 | Shared services |
| traffic     | 3002 | Traffic analytics module |
| reports     | 3003 | Reporting module |
| admin       | 3004 | Admin panel |

## 🆕 Creating New Domain

```bash
pnpm domain:create
```

This command interactively prompts for:
1. Domain name (kebab-case)
2. Base path
3. Port
4. Navigation label

and creates a new remote.

## 🔧 Technologies

- **Bundler**: Rspack
- **Module Federation**: @module-federation/enhanced
- **Routing**: @tanstack/react-router
- **State**: @tanstack/react-query
- **Styling**: Tailwind CSS v4
- **Package Manager**: pnpm (workspaces)

## 📁 Project Structure

```
monorepo-mf-example/
├── apps/
│   ├── shell/          # HOST application
│   ├── platform/       # Core remote (providers, account)
│   ├── traffic/        # Domain remote
│   ├── reports/        # Domain remote
│   └── admin/          # Domain remote
├── scripts/
│   ├── create-domain.mjs
│   └── commit-msg.mjs  # Commit message validator
├── .eslintrc.base.cjs  # Base ESLint config
├── .eslintrc.cjs       # Root ESLint config
├── commitlint.config.cjs
├── lefthook.yml        # Git hooks configuration
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tailwind.config.ts
└── postcss.config.cjs
```

## 🎯 Key Rules

1. **Router**: Only shell creates router instance
2. **Frame**: Shell renders Header/Sidebar/Layout once
3. **State**: Account data shared via platform
4. **Remotes**: Export route config, don't create routers
5. **Commits**: Use Conventional Commits format
6. **Linting**: All code must pass ESLint before commit
