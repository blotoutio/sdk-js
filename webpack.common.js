const Webpack = require('webpack')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './index.js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new Webpack.DefinePlugin({
      'process.env.PACKAGE_VERSION': JSON.stringify(process.env.npm_package_version)
    })
  ]
}
