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
├── .github/
│   └── workflows/
│       ├── app-ci.yml           # Reusable CI workflow
│       ├── deploy-cloudflare.yml # Reusable deployment workflow
│       ├── deploy-all.yml       # Full deployment (manual)
│       ├── shell.yml            # Shell CI/CD
│       ├── platform.yml         # Platform CI/CD
│       ├── traffic.yml          # Traffic CI/CD
│       ├── reports.yml          # Reports CI/CD
│       └── admin.yml            # Admin CI/CD
├── apps/
│   ├── shell/          # HOST application
│   │   ├── _headers    # Cloudflare Pages headers
│   │   └── _redirects  # SPA routing config
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

## ☁️ Cloudflare Pages Deployment

This project is configured for deployment to Cloudflare Pages with multiple projects (one per micro-frontend).

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Pages                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Traffic   │    │   Reports   │    │    Admin    │     │
│  │  (Remote)   │    │  (Remote)   │    │  (Remote)   │     │
│  │ mf-traffic  │    │ mf-reports  │    │  mf-admin   │     │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘     │
│         │                  │                  │             │
│         └──────────────────┼──────────────────┘             │
│                           │                                 │
│                    ┌──────▼──────┐                         │
│                    │   Platform   │                         │
│                    │   (Shared)   │                         │
│                    │ mf-platform  │                         │
│                    └──────┬──────┘                         │
│                           │                                 │
│                    ┌──────▼──────┐                         │
│                    │    Shell    │                          │
│                    │   (Host)    │                          │
│                    │  mf-shell   │                          │
│                    └─────────────┘                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Setup

#### 1. Create Cloudflare Pages Projects

Create 5 separate Pages projects in Cloudflare Dashboard:

| Project Name | Application | Description |
|--------------|-------------|-------------|
| `mf-platform` | Platform | Shared services (QueryClient, Account) |
| `mf-traffic` | Traffic | Traffic domain remote |
| `mf-reports` | Reports | Reports domain remote |
| `mf-admin` | Admin | Admin domain remote |
| `mf-shell` | Shell | Host application |

#### 2. Configure GitHub Secrets

Add the following secrets to your GitHub repository (Settings → Secrets → Actions):

| Secret | Description |
|--------|-------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token with Pages permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare Account ID |
| `PLATFORM_REMOTE_URL` | Platform Pages URL (e.g., `https://mf-platform.pages.dev`) |
| `TRAFFIC_REMOTE_URL` | Traffic Pages URL (e.g., `https://mf-traffic.pages.dev`) |
| `REPORTS_REMOTE_URL` | Reports Pages URL (e.g., `https://mf-reports.pages.dev`) |
| `ADMIN_REMOTE_URL` | Admin Pages URL (e.g., `https://mf-admin.pages.dev`) |

#### 3. Create Cloudflare API Token

1. Go to Cloudflare Dashboard → My Profile → API Tokens
2. Create Token → Use "Edit Cloudflare Workers" template
3. Permissions: Account → Cloudflare Pages → Edit
4. Copy the token and save as `CLOUDFLARE_API_TOKEN` secret

### Deployment

#### Automatic Deployment (CI/CD)

Each application has its own workflow that triggers on changes:

- Changes to `apps/shell/**` → Deploys Shell
- Changes to `apps/platform/**` → Deploys Platform
- Changes to `apps/traffic/**` → Deploys Traffic
- Changes to `apps/reports/**` → Deploys Reports
- Changes to `apps/admin/**` → Deploys Admin

Deployment only occurs when pushing to the `main` branch.

#### Manual Full Deployment

To deploy all applications in the correct order:

1. Go to GitHub → Actions → "Deploy All to Cloudflare Pages"
2. Click "Run workflow"
3. Select which applications to deploy
4. Click "Run workflow"

**Deployment Order:**
1. Platform (no dependencies)
2. Traffic, Reports, Admin (parallel, depend on Platform)
3. Shell (depends on all remotes)

### Workflow Files

```
.github/workflows/
├── app-ci.yml              # Reusable CI workflow (lint, build)
├── deploy-cloudflare.yml   # Reusable Cloudflare deployment workflow
├── deploy-all.yml          # Full deployment workflow (manual trigger)
├── shell.yml               # Shell CI/CD
├── platform.yml            # Platform CI/CD
├── traffic.yml             # Traffic CI/CD
├── reports.yml             # Reports CI/CD
└── admin.yml               # Admin CI/CD
```

### Environment Variables

Build-time environment variables for remote URLs:

| Variable | Used By | Description |
|----------|---------|-------------|
| `PLATFORM_REMOTE_URL` | Shell, Traffic, Reports, Admin | Platform remote URL |
| `TRAFFIC_REMOTE_URL` | Shell | Traffic remote URL |
| `REPORTS_REMOTE_URL` | Shell | Reports remote URL |
| `ADMIN_REMOTE_URL` | Shell | Admin remote URL |

### CORS Configuration

Each remote application includes `_headers` file for CORS support:

```
/remoteEntry.js
  Access-Control-Allow-Origin: *
  Cache-Control: no-cache, no-store, must-revalidate
```

## 🎯 Key Rules

1. **Router**: Only shell creates router instance
2. **Frame**: Shell renders Header/Sidebar/Layout once
3. **State**: Account data shared via platform
4. **Remotes**: Export route config, don't create routers
5. **Commits**: Use Conventional Commits format
6. **Linting**: All code must pass ESLint before commit
7. **Deployment**: Platform must be deployed before other remotes
