var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: {
    app: './build.js'
  },

  output: {
    path: __dirname + '/build',
    filename: 'virtual-template.js'
  },

  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: [path.resolve(__dirname, "node_modules")],
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'babel-preset-es2017']
        }
      }
    ]
  }
}
