const { ModuleFederationPlugin } = require("@module-federation/enhanced/rspack");
const rspack = require("@rspack/core");
const path = require("path");

const isProduction = process.env.NODE_ENV === "production";

// Remote URLs - environment variables for production, localhost for development
const PLATFORM_URL = process.env.PLATFORM_REMOTE_URL || "http://localhost:3001";

// Production URL for this remote - used for chunk loading
const REPORTS_PUBLIC_URL = process.env.REPORTS_PUBLIC_URL || "https://mf-reports.pages.dev";

/** @type {import('@rspack/core').Configuration} */
module.exports = {
  entry: "./src/main.tsx",
  mode: isProduction ? "production" : "development",
  devServer: {
    port: 3003,
    historyApiFallback: true,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  output: {
    publicPath: isProduction ? `${REPORTS_PUBLIC_URL}/` : "auto",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
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
        test: /\.css$/,
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
    // Copy Cloudflare Pages config files
    new rspack.CopyRspackPlugin({
      patterns: [
        { from: "_headers", to: ".", noErrorOnMissing: true },
        { from: "_redirects", to: ".", noErrorOnMissing: true },
      ],
    }),
    new ModuleFederationPlugin({
      name: "reports",
      dts: false,
      filename: "remoteEntry.js",
      remotes: {
        platform: `platform@${PLATFORM_URL}/remoteEntry.js`,
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

