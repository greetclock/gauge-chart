// let path = require('path')
let ExtractTextPlugin = require('extract-text-webpack-plugin')
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin

let helpers = require('./helpers')

module.exports = function () {
  // let isProd = options.env === 'production'

  return {
    entry: './src/index.ts',
    output: {
      path: helpers.root('dist'),
      filename: 'bundle.js',
      library: 'MyLib',
      libraryTarget: 'umd2',
    },
    module: {
      rules: [{
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: 'tsconfig.json',
        },
        exclude: [/\.(spec|e2e)\.ts$/],
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader',
        }),
      }],
    },
    resolve: {
      extensions: ['.ts', '.js', '.css'],
    },
    plugins: [
      new ExtractTextPlugin('styles.css'),
      new CheckerPlugin(),
    ],
  }
}
