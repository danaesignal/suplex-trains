const path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/server.js',
  output: {
    filename: 'server.bundle.js',
    path: path.resolve(__dirname, 'build')
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      { test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};