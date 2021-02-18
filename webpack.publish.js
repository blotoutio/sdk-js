const path = require('path')
const { merge } = require('webpack-merge')
const Webpack = require('webpack')
const common = require('./webpack.common.js')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const publish = () => {
  return {
    mode: 'production',
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src/*'),
            flatten: true,
          },
        ],
      }),
      new Webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ],
  }
}

module.exports = (env) => {
  return merge(common(env), publish())
}
