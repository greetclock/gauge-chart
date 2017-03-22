let webpackMerge = require('webpack-merge')
let commonConfig = require('./common.config.js')
let TypedocWebpackPlugin = require('typedoc-webpack-plugin')

const ENV = 'production'
process.env.ENV = ENV
process.env.NODE_ENV = ENV

module.exports = webpackMerge(commonConfig({ env: ENV }), {
  plugins: [
    new TypedocWebpackPlugin({
      out: '../docs',
    }),
  ],
})
