const Webpack = require('webpack')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './index.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: true,
    }),
    new Webpack.DefinePlugin({
      'process.env.PACKAGE_VERSION': JSON.stringify(
        process.env.npm_package_version
      ),
    }),
  ],
}
