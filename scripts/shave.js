var webpack = require('webpack')
var webpackConfig = require('../webpack.config/base.js')

webpack(webpackConfig, (err, stats) => {
  if (err) {
    console.error(err.message)
  }
  process.stdout.write(`${stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
    entrypoints: false
  })}`)
  console.log('\r\n')
})