const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// const webpack = require('webpack')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  entry: {
    main: [
      // 'webpack-hot-middleware/client?path=/__webpack_hmr&noInfo=true&reload=true',
      path.resolve(__dirname, '../src/index.js')
    ]
    // client: [
    //   'webpack-hot-middleware/client?path=/__webpack_hmr&noInfo=true&reload=true'
    // ]
  },
  output: {
    path: path.resolve(__dirname, '../dist/'),
    filename: '[name].[hash].bundle.js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    publicPath: './'
  },
  resolve: {
    extensions: ['.json', '.js', '.vue'],
    alias: {
      components: path.resolve(__dirname, '../src/components')
    }
  },
  mode: 'production',
  // mode: 'development',
  // devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }, {
        test: /.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'eslint-loader',
            options: {
              formatter: require('eslint-friendly-formatter')
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new UglifyJsPlugin(),
    new HtmlWebpackPlugin({
      // filename: 'index.html',
      filename: path.resolve(__dirname, '../dist/index.html'),
      template: path.resolve(__dirname, '../src/template.html'),
      excludeChunks: ['client']
    }),
    new CleanWebpackPlugin([path.resolve(__dirname, '../dist/*')], {
      root: process.cwd()
    })
    // new webpack.HotModuleReplacementPlugin()
    // new BundleAnalyzerPlugin()
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: {
          // minChunks: 1,
          // priority: -20,
          // reuseExistingChunk: true,
          // name: 'common',
          // chunks: 'all'
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
}
