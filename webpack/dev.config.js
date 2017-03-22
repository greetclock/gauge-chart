let webpackMerge = require('webpack-merge')
let commonConfig = require('./common.config.js')
let helpers = require('./helpers')

const ENV = 'development'
process.env.ENV = ENV
process.env.NODE_ENV = ENV

module.exports = webpackMerge(commonConfig({ env: ENV }), {
  devServer: {
    contentBase: helpers.root('examples', 'developing'),
    watchContentBase: true,
    publicPath: 'http://localhost:8080/dist/',
  },
})
