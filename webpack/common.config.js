// let path = require('path')
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin

let helpers = require('./helpers')

module.exports = function() {
  // let isProd = options.env === 'production'

  return {
    entry: './src/index.ts',
    output: {
      path: helpers.root('dist'),
      filename: 'bundle.js',
      library: 'GaugeChart',
      libraryTarget: 'umd2',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'awesome-typescript-loader',
          options: {
            configFileName: 'tsconfig.json',
          },
          exclude: [/\.(spec|e2e)\.ts$/],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.css'],
    },
    plugins: [new CheckerPlugin()],
  }
}
