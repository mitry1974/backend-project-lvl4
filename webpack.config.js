const path = require('path');
const autoprefixer = require('autoprefixer');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  mode,
  devtool: 'source-map',
  entry: path.join(__dirname, 'client', 'index.js'),
  output: {
    path: path.join(__dirname, 'dist', 'public'),
    publicPath: '/assets/',
  },
  devServer: {
    host: '192.168.0.20',
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
            plugins: () => [autoprefixer],
          },
        }],
      },
    ],
  },
};
