const path = require('path');

module.exports = () => ({
  entry: {
    'index': path.resolve('src/index.js'),
  },
  output: {
    filename: '[name].js',
    path: path.resolve('dist'),
    publicPath: '/dist/',
  },
  externals: {
    'jsmediatags': 'jsmediatags'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    }],
  },
});
