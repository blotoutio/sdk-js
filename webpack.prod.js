const { merge } = require('webpack-merge')
const Webpack = require('webpack')
const common = require('./webpack.common.js')

const prod = () => {
  return {
    mode: 'production',
    plugins: [
      new Webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ],
  }
}

module.exports = (env) => {
  return merge(common(env), prod())
}
