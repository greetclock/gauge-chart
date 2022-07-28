let webpackMerge = require('webpack-merge')
let commonConfig = require('./common.config.js')
let helpers = require('./helpers')

module.exports = webpackMerge(commonConfig(), {
  devServer: {
    contentBase: helpers.root('examples', 'developing'),
    watchContentBase: true,
    publicPath: 'http://localhost:8080/dist/',
  },
})
