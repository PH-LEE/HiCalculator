const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = function (webpackEnv) {
  return merge(common(webpackEnv), {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      static: './build',
      hot: true,
    },
  })
}
