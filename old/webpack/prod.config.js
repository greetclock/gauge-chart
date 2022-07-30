let webpackMerge = require('webpack-merge')
let commonConfig = require('./common.config.js')
let UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = webpackMerge(commonConfig(), {
  plugins: [new UglifyJsPlugin({})],
})
