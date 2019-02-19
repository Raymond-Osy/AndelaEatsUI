const webpack = require('webpack');
const merge = require('webpack-merge');

const webpackCommonConfig = require('./webpack.common');

module.exports = merge(webpackCommonConfig, {
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      minimize: true,
      sourceMap: true,
      historyApiFallback: true,
    }),
    new webpack.EnvironmentPlugin({ NODE_ENV: 'production' }),
  ],
});
