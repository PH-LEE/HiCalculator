const { merge } = require('webpack-merge')
const common = require('./webpack.common')

module.exports =function(webpackEnv){
return merge(common(webpackEnv), {
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: '/public/index.html',
    }),
  ]
})
} 
