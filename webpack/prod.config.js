let webpackMerge = require('webpack-merge')
let commonConfig = require('./common.config.js')
let UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin')

module.exports = webpackMerge(commonConfig(), {
  plugins: [new UglifyJsPlugin({})],
})
