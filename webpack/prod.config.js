let webpackMerge = require('webpack-merge')
let commonConfig = require('./common.config.js')
let TypedocWebpackPlugin = require('typedoc-webpack-plugin')
let DefinePlugin = require('webpack/lib/DefinePlugin')
let UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin')
let CopyWebpackPlugin = require('copy-webpack-plugin')

const ENV = process.env.ENV || 'production'
process.env.ENV = ENV

module.exports = webpackMerge(commonConfig({ env: ENV }), {
  plugins: [
    new TypedocWebpackPlugin({
      out: '../docs',
    }),
    new DefinePlugin({
      ENV: `'${ENV}'`,
    }),
    new UglifyJsPlugin({
    }),
    new CopyWebpackPlugin([{
      from: 'src/gauge.d.ts',
      to: 'index.d.ts',
    }]),
  ],
})
