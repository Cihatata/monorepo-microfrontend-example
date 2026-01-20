#!/usr/bin/env node
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const appsDir = path.join(rootDir, "apps");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

function toPascalCase(str) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

function toTitleCase(str) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getUsedPorts() {
  const ports = [3000, 3001, 3002, 3003, 3004]; // Default ports
  const apps = fs.readdirSync(appsDir);
  
  apps.forEach((app) => {
    const rspackConfigPath = path.join(appsDir, app, "rspack.config.js");
    if (fs.existsSync(rspackConfigPath)) {
      const content = fs.readFileSync(rspackConfigPath, "utf-8");
      const portMatch = content.match(/port:\s*(\d+)/);
      if (portMatch) {
        ports.push(parseInt(portMatch[1], 10));
      }
    }
  });
  
  return [...new Set(ports)];
}

function getNextAvailablePort() {
  const usedPorts = getUsedPorts();
  let port = 3005;
  while (usedPorts.includes(port)) {
    port++;
  }
  return port;
}

async function main() {
  console.log("\n🚀 New Domain Remote Creator\n");

  // Prompt for domain name
  const domainNameRaw = await question("Domain name (kebab-case): ");
  const domainName = toKebabCase(domainNameRaw.trim());
  
  if (!domainName) {
    console.error("❌ Domain name is required!");
    rl.close();
    process.exit(1);
  }

  const domainDir = path.join(appsDir, domainName);
  if (fs.existsSync(domainDir)) {
    console.error(`❌ "${domainName}" already exists!`);
    rl.close();
    process.exit(1);
  }

  // Prompt for base path
  const defaultBasePath = `/${domainName}`;
  const basePathInput = await question(`Base path (default: ${defaultBasePath}): `);
  const basePath = basePathInput.trim() || defaultBasePath;

  // Prompt for port
  const defaultPort = getNextAvailablePort();
  const portInput = await question(`Port (default: ${defaultPort}): `);
  const port = parseInt(portInput.trim(), 10) || defaultPort;

  // Prompt for nav label
  const defaultNavLabel = toTitleCase(domainName);
  const navLabelInput = await question(`Navigation label (default: ${defaultNavLabel}): `);
  const navLabel = navLabelInput.trim() || defaultNavLabel;

  console.log("\n📦 Creating domain...\n");

  const pascalName = toPascalCase(domainName);
  const routeId = `${domainName}-home`;

  // Create directory structure
  fs.mkdirSync(path.join(domainDir, "src", "pages"), { recursive: true });
  fs.mkdirSync(path.join(domainDir, "src", "types"), { recursive: true });

  // Create package.json
  const packageJson = {
    name: `@mf/${domainName}`,
    version: "1.0.0",
    private: true,
    scripts: {
      dev: "rspack serve",
      build: "rspack build",
      lint: "eslint src --ext .ts,.tsx",
      "lint:fix": "eslint src --ext .ts,.tsx --fix",
    },
    dependencies: {
      "@tanstack/react-query": "^5.17.0",
      "@tanstack/react-router": "^1.94.0",
      react: "18.2.0",
      "react-dom": "18.2.0",
    },
    devDependencies: {
      "@module-federation/enhanced": "^0.8.0",
      "@rspack/cli": "^1.1.0",
      "@rspack/core": "^1.1.0",
      "@tailwindcss/postcss": "^4.0.0",
      "@types/react": "^18.2.0",
      "@types/react-dom": "^18.2.0",
      autoprefixer: "^10.4.16",
      "css-loader": "^7.1.2",
      postcss: "^8.4.32",
      "postcss-loader": "^8.1.0",
      tailwindcss: "^4.0.0",
      typescript: "^5.3.0",
    },
  };
  fs.writeFileSync(
    path.join(domainDir, "package.json"),
    JSON.stringify(packageJson, null, 2)
  );

  // Create tsconfig.json
  const tsconfig = {
    extends: "../../tsconfig.base.json",
    compilerOptions: {
      baseUrl: ".",
      paths: {
        "@/*": ["./src/*"],
      },
    },
    include: ["src/**/*", "rspack.config.js"],
    exclude: ["node_modules", "dist"],
  };
  fs.writeFileSync(
    path.join(domainDir, "tsconfig.json"),
    JSON.stringify(tsconfig, null, 2)
  );

  // Create rspack.config.js
  const rspackConfig = `const { ModuleFederationPlugin } = require("@module-federation/enhanced/rspack");
const rspack = require("@rspack/core");
const path = require("path");

/** @type {import('@rspack/core').Configuration} */
module.exports = {
  entry: "./src/main.tsx",
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  devServer: {
    port: ${port},
    historyApiFallback: true,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  output: {
    publicPath: "auto",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\\.(tsx?|jsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
                tsx: true,
              },
              transform: {
                react: {
                  runtime: "automatic",
                },
              },
            },
          },
        },
      },
      {
        test: /\\.css$/,
        use: [
          rspack.CssExtractRspackPlugin.loader,
          "css-loader",
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new rspack.CssExtractRspackPlugin(),
    new rspack.HtmlRspackPlugin({
      template: "./src/index.html",
    }),
    new ModuleFederationPlugin({
      name: "${domainName.replace(/-/g, "_")}",
      filename: "remoteEntry.js",
      remotes: {
        platform: "platform@http://localhost:3001/remoteEntry.js",
      },
      exposes: {
        "./routes": "./src/routes.ts",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: false,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: false,
        },
        "@tanstack/react-query": {
          singleton: true,
          requiredVersion: false,
        },
        "@tanstack/react-router": {
          singleton: true,
          requiredVersion: false,
        },
      },
    }),
  ],
};
`;
  fs.writeFileSync(path.join(domainDir, "rspack.config.js"), rspackConfig);

  // Create index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${pascalName} Remote</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;
  fs.writeFileSync(path.join(domainDir, "src", "index.html"), indexHtml);

  // Create main.tsx
  fs.writeFileSync(
    path.join(domainDir, "src", "main.tsx"),
    'import("./bootstrap");\n'
  );

  // Create bootstrap.tsx
  const bootstrapTsx = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { ${pascalName}Home } from "./pages/${pascalName}Home";

const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

const root = createRoot(container);
root.render(
  <StrictMode>
    <div className="min-h-screen bg-slate-100 p-8">
      <${pascalName}Home />
    </div>
  </StrictMode>
);
`;
  fs.writeFileSync(path.join(domainDir, "src", "bootstrap.tsx"), bootstrapTsx);

  // Create styles.css
  fs.writeFileSync(
    path.join(domainDir, "src", "styles.css"),
    '@import "tailwindcss";\n'
  );

  // Create routes.ts
  const routesTs = `import { ${pascalName}Home } from "./pages/${pascalName}Home";

export interface RouteConfig {
  id: string;
  path: string;
  component: React.ComponentType;
  nav: {
    label: string;
    order?: number;
  };
}

export const routes: RouteConfig[] = [
  {
    id: "${routeId}",
    path: "${basePath}",
    component: ${pascalName}Home,
    nav: {
      label: "${navLabel}",
      order: 10,
    },
  },
];
`;
  fs.writeFileSync(path.join(domainDir, "src", "routes.ts"), routesTs);

  // Create page component
  const pageTsx = `import { useAccount } from "platform/account";

export function ${pascalName}Home() {
  const { data: account, isLoading } = useAccount();

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-slate-800">
            ${navLabel}
          </h1>
          {isLoading ? (
            <div className="w-32 h-6 bg-slate-200 animate-pulse rounded" />
          ) : (
            <span className="text-sm text-slate-500">
              Welcome, <span className="font-medium text-slate-700">{account?.name}</span>
            </span>
          )}
        </div>
        <p className="text-slate-600">
          Welcome to the ${navLabel} module.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          🚀 ${pascalName} Module
        </h2>
        <p className="text-slate-600">
          This module was created with <code className="bg-slate-100 px-2 py-1 rounded text-sm">pnpm domain:create</code> command.
        </p>
      </div>
    </div>
  );
}
`;
  fs.writeFileSync(
    path.join(domainDir, "src", "pages", `${pascalName}Home.tsx`),
    pageTsx
  );

  // Create type definitions
  const remotesDts = `declare module "platform/account" {
  export interface Account {
    id: string;
    name: string;
    email: string;
  }

  export function useAccount(): {
    data: Account | undefined;
    isLoading: boolean;
    error: Error | null;
  };

  export function prefetchAccount(): Promise<void>;
}
`;
  fs.writeFileSync(
    path.join(domainDir, "src", "types", "remotes.d.ts"),
    remotesDts
  );

  // Create .eslintrc.cjs for the domain
  const eslintConfig = `/**
 * ${pascalName} Domain ESLint Configuration
 * Extends base config and adds ${domainName} domain-specific rules.
 */
const baseConfig = require("../../.eslintrc.base.cjs");

module.exports = {
  ...baseConfig,
  root: true,
  rules: {
    ...baseConfig.rules,
    
    // ${pascalName} domain specific rules
    // Add domain-specific rules here
  },
};
`;
  fs.writeFileSync(path.join(domainDir, ".eslintrc.cjs"), eslintConfig);
  console.log("✅ ESLint config created");

  // Create postcss.config.cjs for the domain
  const postcssConfig = `module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
`;
  fs.writeFileSync(path.join(domainDir, "postcss.config.cjs"), postcssConfig);

  // Update shell rspack.config.js
  const shellRspackPath = path.join(appsDir, "shell", "rspack.config.js");
  if (fs.existsSync(shellRspackPath)) {
    let shellRspackConfig = fs.readFileSync(shellRspackPath, "utf-8");
    
    // Add new remote
    const remoteName = domainName.replace(/-/g, "_");
    const newRemote = `        ${remoteName}: "${remoteName}@http://localhost:${port}/remoteEntry.js",`;
    
    // Find remotes object and add the new remote
    shellRspackConfig = shellRspackConfig.replace(
      /(remotes:\s*\{[\s\S]*?)(^\s*\},)/m,
      `$1${newRemote}\n$2`
    );
    
    fs.writeFileSync(shellRspackPath, shellRspackConfig);
    console.log("✅ Shell rspack.config.js updated");
  }

  // Update shell remote-manifest.tsx
  const manifestPath = path.join(appsDir, "shell", "src", "remote-manifest.tsx");
  if (fs.existsSync(manifestPath)) {
    let manifest = fs.readFileSync(manifestPath, "utf-8");
    
    const remoteName = domainName.replace(/-/g, "_");
    
    // Add new route config
    const newRouteConfig = `
// ${pascalName} remote routes
const ${remoteName}Routes: RouteConfig[] = [
  {
    id: "${routeId}",
    path: "${basePath}",
    component: lazy(() =>
      import("${remoteName}/routes").then((m) => ({
        default: m.routes.find((r: RouteConfig) => r.id === "${routeId}")?.component
          ? () => {
              const Component = m.routes.find((r: RouteConfig) => r.id === "${routeId}")!.component;
              return <Component />;
            }
          : () => <div>Not Found</div>,
      }))
    ),
    nav: { label: "${navLabel}", order: 10 },
  },
];
`;
    
    // Insert before remoteManifests array
    manifest = manifest.replace(
      /(export const remoteManifests)/,
      `${newRouteConfig}\n$1`
    );
    
    // Add to remoteManifests array
    manifest = manifest.replace(
      /(export const remoteManifests: RemoteManifest\[\] = \[[\s\S]*?)(^\];)/m,
      `$1  { name: "${remoteName}", routes: ${remoteName}Routes },\n$2`
    );
    
    fs.writeFileSync(manifestPath, manifest);
    console.log("✅ Shell remote-manifest.tsx updated");
  }

  // Update shell App.tsx to add the new route
  const appPath = path.join(appsDir, "shell", "src", "App.tsx");
  if (fs.existsSync(appPath)) {
    let appContent = fs.readFileSync(appPath, "utf-8");
    
    const remoteName = domainName.replace(/-/g, "_");
    
    // Add lazy import
    const newLazyImport = `
const ${pascalName}Page = lazy(() =>
  import("${remoteName}/routes").then((m) => {
    const route = m.routes.find((r: { id: string }) => r.id === "${routeId}");
    return { default: route?.component ?? (() => <div>Failed to load</div>) };
  })
);
`;
    
    // Insert after AdminPage lazy import
    appContent = appContent.replace(
      /(const AdminPage = lazy\(\(\)[\s\S]*?\);\n)/,
      `$1${newLazyImport}`
    );
    
    // Add new route definition
    const newRouteDefinition = `
const ${remoteName}Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "${basePath}",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <${pascalName}Page />
    </Suspense>
  ),
});
`;
    
    // Insert after adminRoute definition
    appContent = appContent.replace(
      /(const adminRoute = createRoute\({[\s\S]*?\}\);)/,
      `$1${newRouteDefinition}`
    );
    
    // Add to route tree
    appContent = appContent.replace(
      /(const routeTree = rootRoute\.addChildren\(\[[\s\S]*?)(adminRoute,)/,
      `$1$2\n  ${remoteName}Route,`
    );
    
    fs.writeFileSync(appPath, appContent);
    console.log("✅ Shell App.tsx updated");
  }

  // Update shell type definitions
  const shellTypeDefsPath = path.join(appsDir, "shell", "src", "types", "remotes.d.ts");
  if (fs.existsSync(shellTypeDefsPath)) {
    let typeDefs = fs.readFileSync(shellTypeDefsPath, "utf-8");
    
    const remoteName = domainName.replace(/-/g, "_");
    
    const newTypeDef = `
declare module "${remoteName}/routes" {
  import { ComponentType, LazyExoticComponent } from "react";
  export interface RouteConfig {
    id: string;
    path: string;
    component: ComponentType;
    nav: {
      label: string;
      order?: number;
    };
  }
  export const routes: RouteConfig[];
}
`;
    
    typeDefs += newTypeDef;
    fs.writeFileSync(shellTypeDefsPath, typeDefs);
    console.log("✅ Shell type definitions updated");
  }

  console.log(`\n✨ "${domainName}" domain created successfully!\n`);
  console.log(`📁 Location: apps/${domainName}`);
  console.log(`🌐 Port: ${port}`);
  console.log(`🔗 Path: ${basePath}`);
  console.log(`📋 Navigation: ${navLabel}\n`);
  console.log("Next steps:");
  console.log("  1. pnpm install");
  console.log("  2. pnpm dev\n");

  rl.close();
}

main().catch((err) => {
  console.error("❌ Error:", err);
  rl.close();
  process.exit(1);
});
