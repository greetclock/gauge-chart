let webpackMerge = require('webpack-merge')
let path = require('path')
let commonConfig = require('./common.config.js')
let TypedocWebpackPlugin = require('typedoc-webpack-plugin')
let DefinePlugin = require('webpack/lib/DefinePlugin')
let UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin')

const ENV = process.env.ENV || 'production'
process.env.ENV = ENV

module.exports = webpackMerge(commonConfig({ env: ENV }), {
  plugins: [
    new TypedocWebpackPlugin({ }, path.resolve(__dirname, '../src')),
    new DefinePlugin({
      ENV: `'${ENV}'`,
    }),
    new UglifyJsPlugin({
    }),
  ],
})
