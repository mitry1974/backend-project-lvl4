import webpack from 'webpack';
import path from 'path';
import autoprefixer from 'autoprefixer';
import { dirname  } from 'path';
import { fileURLToPath  } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const mode = process.env.NODE_ENV || 'development';

export default {
  mode,
  devtool: 'source-map',
  entry: path.join(__dirname, 'client', 'index.js'),
  output: {
    path: path.join(__dirname, 'dist', 'public'),
    filename: 'main.js',
    publicPath: '/assets/',
  },
  devServer: {
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
            plugins: () => [autoprefixer],
          },
        }],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ],
};
