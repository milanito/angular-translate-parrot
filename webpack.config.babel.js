// webpack.config.js

import webpack from 'webpack';
import path from 'path';

const BUILD_DIR = path.resolve(path.join(__dirname, 'dist'));
const APP_DIR = path.resolve(path.join(__dirname, 'src'));

export default {
  devtool: 'source-map',
  entry: path.join(APP_DIR + '/angular-translate-loader-parrot.js'),
  output: {
    path: BUILD_DIR,
    filename: 'angular-translate-loader-parrot.js',
    library: 'translateParrotLoader',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      options: {
        presets: [
          'es2015',
          'stage-2'
        ],
        plugins: [
          'add-module-exports',
          'angularjs-annotate'
        ]
      }
    }]
  },
  resolve: {
    alias: {
      angular: path.resolve(path.join(__dirname, 'node_modules', 'angular'))
    }
  }
};
