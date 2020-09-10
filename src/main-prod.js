// 主文件入口
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/global.css'
import './assets/fonts/iconfont.css'
/* 导入树状表格 */
import tableTree from 'vue-table-with-tree-grid'
/* 导入富文本编辑器 */
import VueQuillEditor from 'vue-quill-editor'
/* 导入nprogress进度条插件 */
import NProgress from 'nprogress'
/* 配置axios导入Vue */
import axios from 'axios'
axios.defaults.baseURL = 'http://www.ysqorz.top:8888/api/private/v1/'
/* 为后续调用api增加请求头中的'Authorization'字段(值为token) */
/* 请求拦截器 */
axios.interceptors.request.use(config => {
  config.headers.authorization = window.sessionStorage.getItem('token')
  NProgress.start()
  return config
})
/* 响应拦截器 */
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
/* 为Vue导入axios方法(命名为$http) */
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('table-tree', tableTree)
Vue.use(VueQuillEditor)
/* 日期过滤器 */
Vue.filter('format', value => {
  const now = new Date(value)
  const y = (now.getFullYear() + '')
  const M = (now.getMonth() + 1 + '').padStart(2, '0')
  const d = (now.getDate() + '').padStart(2, '0')
  const h = (now.getHours() + '').padStart(2, '0')
  const m = (now.getMinutes() + '').padStart(2, '0')
  const s = (now.getSeconds() + '').padStart(2, '0')
  return `${y}-${M}-${d} ${h}:${m}:${s}`
})
/* 主文件渲染 */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
// 'http://api.zreai.com:606/api/private/v1/'
