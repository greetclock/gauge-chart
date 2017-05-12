let webpackMerge = require('webpack-merge')
let commonConfig = require('./common.config.js')
let helpers = require('./helpers')
let DefinePlugin = require('webpack/lib/DefinePlugin')

const ENV = 'development'
process.env.ENV = ENV

module.exports = webpackMerge(commonConfig({ env: ENV }), {
  devServer: {
    contentBase: helpers.root('examples', 'developing'),
    watchContentBase: true,
    publicPath: 'http://localhost:8080/dist/',
  },
  plugins: [
    new DefinePlugin({
      ENV: `'${ENV}'`,
    }),
  ],
})
