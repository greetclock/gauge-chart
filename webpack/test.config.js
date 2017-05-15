let webpackMerge = require('webpack-merge')
let path = require('path')
let commonConfig = require('./common.config.js')
let helpers = require('./helpers')
let DefinePlugin = require('webpack/lib/DefinePlugin')

const ENV = 'test'
process.env.ENV = ENV
process.env.NODE_ENV = ENV

module.exports = function () {
  return webpackMerge(commonConfig({ env: ENV }), {
    plugins: [
      new DefinePlugin({
        ENV: `'${ENV}'`,
      }),
    ],
    module: {
      rules: [{
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      }, {
        test: /\.spec.ts$/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            query: {
              // use inline sourcemaps for "karma-remap-coverage" reporter
              sourceMap: false,
              inlineSourceMap: true,
              compilerOptions: {

                // Remove TypeScript helpers to be injected
                // below by DefinePlugin
                removeComments: true,
              },
            },
          },
        ],
        exclude: [/\.e2e\.ts$/, /node_modules/],
      }, {
        enforce: 'post',
        test: /\.(js|ts)$/,
        loader: 'istanbul-instrumenter-loader',
        include: helpers.root('src'),
        exclude: [
          /\.(e2e|spec)\.ts$/,
          /node_modules/,
        ],
      }],
    },

    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      extensions: ['.ts', '.js'],
    },

    devtool: 'inline-source-map',

    performance: {
      hints: false,
    },

    node: {
      global: true,
      process: false,
      crypto: 'empty',
      module: false,
      clearImmediate: false,
      setImmediate: false,
    },
  })
}
