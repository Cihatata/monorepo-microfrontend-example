const { ModuleFederationPlugin } = require("@module-federation/enhanced/rspack");
const rspack = require("@rspack/core");
const path = require("path");

/** @type {import('@rspack/core').Configuration} */
module.exports = {
  entry: "./src/main.tsx",
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  devServer: {
    port: 3001,
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
      name: "platform",
      dts: false,
      filename: "remoteEntry.js",
      exposes: {
        "./AppProviders": "./src/AppProviders.tsx",
        "./queryClient": "./src/queryClient.ts",
        "./account": "./src/account.ts",
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

