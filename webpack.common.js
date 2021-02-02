const Webpack = require('webpack')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = (env) => {
  const opts = {
    FEATURES: (env && env.features) || 'full', // basic or full
  }

  const suffix = opts.FEATURES === 'full' ? '_full' : ''

  return {
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: `./trends${suffix}.js`,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [{ loader: 'ifdef-loader', options: opts }],
        },
      ],
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
}
