const Webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = (env) => {
  const opts = {
    FEATURES: (env && env.features) || 'full', // basic or full
  }

  const suffix = opts.FEATURES === 'full' ? '_full' : ''

  const regularName = `trends${suffix}`
  const minName = `trends${suffix}.min`

  return {
    entry: {
      [regularName]: './src/index.ts',
      [minName]: './src/index.ts',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: `[name].js`,
      libraryTarget: 'umd',
      library: 'Trends',
      umdNamedDefine: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: [/node_modules/, /cypress/],
          use: [
            'awesome-typescript-loader',
            { loader: 'ifdef-loader', options: opts },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
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
