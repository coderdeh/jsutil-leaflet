const path = require("path")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const isProd = process.env.VUE_APP_ENV === 'production'
const CompressionPlugin = require("compression-webpack-plugin")
module.exports = {
  // publicPath: process.env.VUE_APP_BASE_PATH || "/",
  publicPath: "./",
  chainWebpack (config) {
    const resolve = (dir) => path.join(__dirname, dir)
    const svgRule = config.module.rule("svg")
    svgRule.uses.clear()
    svgRule
      .test(/\.svg$/)
      .oneOf("normal")
      .exclude.add(resolve("src/icons"))
      .end()
      .use("file-loader")
      .loader("file-loader")
      .end()
      .end()
      .oneOf("sprite")
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
    config.plugin("html").tap((args) => {
      args[0].title = "Leaflet·Demo"
      return args
    })
  },
  configureWebpack: {
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            chunks: 'initial',
            minSize: 0,
            minChunks: 2,
            test: /node_modules/,
            priority: 1
          }
        },
        cacheGroups: {
          utils: {
            chunks: 'initial',
            minSize: 0,
            minChunks: 2
          }
        }
      },
      minimizer: [new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true,//console
            drop_debugger: false,
            pure_funcs: ['console.log']//移除console
          }
        }
      })]
    },
    plugins: [
      new CompressionPlugin({
        test: /\.js$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/, // 需要压缩的文件类型
        threshold: 10240, // 归档需要进行压缩的文件大小最小值，我这个是10K以上的进行压缩
        deleteOriginalAssets: false // 是否删除原文件
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    },
  },
  css: {
    extract: !!isProd,
    sourceMap: false,
    loaderOptions: {
      scss: {
        additionalData: `
          @import "~@/styles/variable.scss";
        `
      }
    }
  },
  devServer: {
    disableHostCheck: true,
    open: true,
    port: 8088,
    proxy: {
      '/tile': {
        target: 'https://qhythzhpt.citycloud.com.cn:8090',
        changeOrigin: true
      },
      // WMS服务
      '/geoserver': {
        target: `https://qhythzhpt.citycloud.com.cn:8090`,
        changeOrigin: true
      },
      [process.env.VUE_APP_BASE_URL]: {
        target: 'https://qhythzhpt.citycloud.com.cn:8090',
        // target: 'http://10.12.107.159:8090',
        changeOrigin: true,
        pathRewrite: {
          // 访问生产
          [process.env.VUE_APP_BASE_URL]: '/sgup',
        }
      },
    }
  }
}