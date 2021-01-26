const path = require('path')
const { merge } = require('webpack-merge')
const Webpack = require('webpack')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    hot: true,
    port: 9000,
    contentBase: path.join(__dirname, './src/demo'),
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
})
