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

  return {
    entry: {
      [regularName]: './src/index.ts',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: `[name].js`,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: [/node_modules/, /cypress/],
          use: [
            {
              loader: require.resolve('awesome-typescript-loader'),
              options: {
                useBabel: true,
              },
            },
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
