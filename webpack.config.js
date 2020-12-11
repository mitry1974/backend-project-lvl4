const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,
  devtool: 'source-map',
  entry: path.join(__dirname, 'client', 'index.js'),
  output: {
    path: path.join(__dirname, 'dist', 'public'),
    filename: 'main.js',
    publicPath: '/assets/',
  },
  devServer: {
    publicPath: '/assets/',
    host: 'localhost',
    port: 5001,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
        }, {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: () => [autoprefixer],
            },
          },
        }],
      },
    ],
  },
};
