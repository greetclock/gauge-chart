let webpackMerge = require('webpack-merge')
let commonConfig = require('./common.config.js')
let TypedocWebpackPlugin = require('typedoc-webpack-plugin')
let DefinePlugin = require('webpack/lib/DefinePlugin')

const ENV = 'production'
process.env.ENV = ENV
process.env.NODE_ENV = ENV

module.exports = webpackMerge(commonConfig({ env: ENV }), {
  plugins: [
    new TypedocWebpackPlugin({
      out: '../docs',
    }),
    new DefinePlugin({
      ENV: `'${ENV}'`,
    }),
  ],
})
