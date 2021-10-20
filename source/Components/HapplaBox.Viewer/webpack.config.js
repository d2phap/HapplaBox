
import path from 'path';
import ESLintPlugin from 'eslint-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const configs = {
  entry: {
    base: ['./src/pages/base.ts', './src/themes/base/styles/main.scss'],
    winMain: ['./src/pages/WinMain/_winMain.ts', './src/themes/default/styles/pages/winMain.scss'],
    about: ['./src/pages/about.ts', './src/themes/default/styles/pages/about.scss'],
  },
  output: {
    path: path.resolve(__dirname, './public'),
    filename: './js/[name].bundle.js',
    hashFunction: 'xxhash64',
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
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          minimize: {
            // this causes stripping off 'style' attribute
            removeStyleLinkTypeAttributes: false,
            removeRedundantAttributes: false,
          },
        },
      },
      {
        // css loader for web component
        // url() in css must be based on /public/
        test: /\.inline.scss$/,
        exclude: /node_modules/,
        use: [
          'sass-to-string',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                outputStyle: 'compressed',
              },
            },
          },
        ],
      },
      {
        test: /\.(scss|css)$/,
        exclude: [/\.inline.scss$/],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: './img/[name][ext][query]',
        },
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
      filename: './css/[name].main.css',
    }),
    new ESLintPlugin({
      cache: true,
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


export default function (env, argv) {
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
        }),
      ],
    },
  };
}
