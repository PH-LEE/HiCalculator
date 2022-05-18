const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = function (webpackEnv) {
  const isEnvDev = !!webpackEnv.development
  const isEnvPrd = !!webpackEnv.production

  return {
    entry: '/src/index.tsx',
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: '/public/index.html',
        publicPath: isEnvDev ? 'auto' : 'build',
      }),
    ],
    output: {
      path: isEnvPrd ? path.resolve(__dirname, 'build') : undefined,
      filename: isEnvPrd
        ? 'static/js/[name].[contenthash:8].js'
        : isEnvDev && 'static/js/[name].bundle.js',
      publicPath: '/',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          use: {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript',
              ],
              plugins: [
                [
                  'babel-plugin-styled-components',
                  {
                    minify: isEnvPrd,
                    displayName: isEnvDev,
                    pure: isEnvPrd,
                  },
                ],
              ],
            },
          },
        },
      ],
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.ts', '.tsx', '.js', '...'],
    },
    optimization: {
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  }
}
