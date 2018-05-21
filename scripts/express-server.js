const express = require('express')
const app = new express()
const middleware = require('webpack-dev-middleware')

const webpack = require('webpack')
const webpackConfig = require('../webpack.config/base')
const compiler = webpack(webpackConfig)

app.use(middleware(compiler, {
  stats: {
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
    entrypoints: false
  },
}))
  
app.listen(3000, () => console.log('Example app listening on port 3000!'))