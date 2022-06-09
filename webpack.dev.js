const { merge } = require('webpack-merge')
const common = require('./webpack.common')


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
