const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const pkJson = require('./package.json');

const copyright = () => `
  ${pkJson.displayName} v${pkJson.version}
  ----------------------------------------
  Copyright (c) ${new Date().getFullYear()} ${pkJson.author}.
  Homepage: ${pkJson.homepage}
  Released under the ${pkJson.license} License.

  Full license information can be found at:
  https://github.com/d2phap/HapplaBox/blob/main/LICENSE.
`;


const configs = {
  entry: {
    base: ['./src/pages/base.ts', './src/themes/base/styles/main.scss'],
    viewer: ['./src/pages/viewer.ts', './src/themes/default/styles/pages/viewer.scss'],
    about: ['./src/pages/about.ts', './src/themes/default/styles/pages/about.scss'],
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, './public/dist'),
    filename: '[name]/[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|svg|webp)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              context: path.resolve(__dirname, 'src/'),
              outputPath: 'base/img/',
              publicPath: '../base/img',
              useRelativePaths: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]/[name].main.css',
    }),
    new webpack.BannerPlugin(copyright),
    new ESLintPlugin({
      cache: true,
      eslintPath: require.resolve('eslint'),
      resolvePluginsRelativeTo: __dirname,
      ignore: true,
      useEslintrc: true,
      extensions: ['ts', 'js'],
    }),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, './dist')],
    }),
  ],
};


module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    ...configs,
    devtool: 'source-map',
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            sourceMap: true,
            compress: isProduction,
          },
          extractComments: {
            filename: 'LICENSE.txt',
            banner: copyright,
          },
        }),
      ],
    },
  };
}
