let path = require('path')

let ROOT = path.resolve(__dirname, '..')

let root = path.join.bind(path, ROOT)

exports.root = root
