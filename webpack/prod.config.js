let webpackMerge = require('webpack-merge')
let path = require('path')
let commonConfig = require('./common.config.js')
let TypedocWebpackPlugin = require('typedoc-webpack-plugin')
let UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin')

module.exports = webpackMerge(commonConfig(), {
  plugins: [
    new TypedocWebpackPlugin({}, path.resolve(__dirname, '../src')),
    new UglifyJsPlugin({}),
  ],
})
