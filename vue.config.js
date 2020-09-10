module.exports = {
  chainWebpack: config => {
    /* 生产环境配置 */
    config.when(process.env.NODE_ENV === 'production', config => {
      /* 入口文件设置 */
      config.entry('app').clear().add('./src/main-prod.js')
      /* 需要设置外链CDN的依赖包信息 */
      config.set('externals', {
        vue: 'Vue',
        echarts: 'echarts',
        axios: 'axios',
        lodash: '_',
        nprogress: 'NProgress',
        'vue-router': 'VueRouter',
        'vue-quill-editor': 'VueQuillEditor'
      })
      /* 环境判断变量设置 */
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    /* 开发环境配置 */
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
