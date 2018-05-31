const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()

const webpack = require('webpack')
const webpackConfig = require('../config/webpack.config.dev')
const compiler = webpack(webpackConfig)
// const devMiddleware = require("./src/devMiddleware")
// const hotMiddleware = require('./src/hotMiddleware')
// app.use(devMiddleware(compiler, {
//   stats: {
//     colors: true,
//     modules: false,
//     children: false,
//     chunks: false,
//     chunkModules: false,
//     entrypoints: false
//   }}))
// app.use(hotMiddleware(compiler, {
//   heartbeat: 2000
// }))

const middleware = require('koa-webpack')
app.use(middleware({
  compiler: compiler,
  dev: {
    stats: {
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
      entrypoints: false
    },
    publicPath: '/',
    serverSideRender: true
  },
  hot: {
  }
}))

function normalizeAssets(assets) {
  return Array.isArray(assets) ? assets : [assets]
}


const renderToString = require('react-dom/server').renderToString
const MyPage = require('../lib/server')
const React = require('react')
const template = require('art-template')

router.get('/b', (ctx) => {
  const message = renderToString(React.createElement(MyPage, null))
  
  ctx.body = template(process.cwd() + '/src/template.html', {
    message: message
  })
})

router.get('/a', (ctx) => {
  const assetsByChunkName = ctx.state.webpackStats.toJson().assetsByChunkName
  
  ctx.body = `
<html>
  <head>
    <title>My App</title>
		${normalizeAssets(assetsByChunkName.main)
    .filter(path => path.endsWith('.css'))
    .map(path => `<link rel="stylesheet" href="${path}" />`)
    .join('\n')}
  </head>
  <body>
    <div id="root"></div>
    ${normalizeAssets(assetsByChunkName.vendors)
    .filter(path => path.endsWith('.js'))
    .map(path => `<script src="${path}"></script>`)
    .join('\n')}
    ${normalizeAssets(assetsByChunkName.main)
    .filter(path => path.endsWith('.js'))
    .map(path => `<script src="${path}"></script>`)
    .join('\n')}
  </body>
</html>
  `
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:3000/')
})