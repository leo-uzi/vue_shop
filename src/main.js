// 主文件入口
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/global.css'
import './assets/fonts/iconfont.css'
/* 配置axios导入Vue */
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
/* 为后续调用api增加请求头中的'Authorization'字段(值为token) */
axios.interceptors.request.use(config => {
  config.headers.authorization = window.sessionStorage.getItem('token')
  return config
})
/* 为Vue导入axios方法(命名为$http) */
Vue.prototype.$http = axios
Vue.config.productionTip = false
/* 主文件渲染 */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
