const { ModuleFederationPlugin } = require("@module-federation/enhanced/rspack");
const rspack = require("@rspack/core");
const path = require("path");

const isProduction = process.env.NODE_ENV === "production";

// Remote URLs - environment variables for production, localhost for development
const PLATFORM_URL = process.env.PLATFORM_REMOTE_URL || "http://localhost:3001";
const TRAFFIC_URL = process.env.TRAFFIC_REMOTE_URL || "http://localhost:3002";
const REPORTS_URL = process.env.REPORTS_REMOTE_URL || "http://localhost:3003";
const ADMIN_URL = process.env.ADMIN_REMOTE_URL || "http://localhost:3004";

/** @type {import('@rspack/core').Configuration} */
module.exports = {
  entry: "./src/main.tsx",
  mode: isProduction ? "production" : "development",
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  output: {
    publicPath: isProduction ? "/" : "auto",
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
        // _redirects removed - Cloudflare Pages automatically handles SPA routing
        // Static files are served automatically, unmatched routes go to root
      ],
    }),
    new ModuleFederationPlugin({
      name: "shell",
      dts: false,
      remotes: {
        platform: `platform@${PLATFORM_URL}/remoteEntry.js`,
        traffic: `traffic@${TRAFFIC_URL}/remoteEntry.js`,
        reports: `reports@${REPORTS_URL}/remoteEntry.js`,
        admin: `admin@${ADMIN_URL}/remoteEntry.js`,
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

