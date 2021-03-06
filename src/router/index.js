// 主路由
import Vue from 'vue'
import VueRouter from 'vue-router'
/* 路由懒加载 */
/* import Login from '../components/login.vue' */
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/login.vue')
/* import Home from '../components/home.vue' */
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/home.vue')
/* import Welcome from '../components/welcome' */
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/welcome')
/* import Users from '../components/users/users' */
const Users = () => import(/* webpackChunkName: "User_Right_Roles" */ '../components/users/users')
/* import Rights from '../components/rights/rights' */
const Rights = () => import(/* webpackChunkName: "User_Right_Roles" */ '../components/rights/rights')
/* import Roles from '../components/rights/roles' */
const Roles = () => import(/* webpackChunkName: "User_Right_Roles" */ '../components/rights/roles')
/* import Cate from '../components/goods/cate' */
const Cate = () => import(/* webpackChunkName: "Cate_Param" */ '../components/goods/cate')
/* import Param from '../components/goods/param' */
const Param = () => import(/* webpackChunkName: "Cate_Param" */ '../components/goods/param')
/* import List from '../components/goods/list' */
const List = () => import(/* webpackChunkName: "List_Add" */ '../components/goods/list')
/* import Add from '../components/goods/add' */
const Add = () => import(/* webpackChunkName: "List_Add" */ '../components/goods/add')
/* import Order from '../components/order/order' */
const Order = () => import(/* webpackChunkName: "Order_Report" */ '../components/order/order')
/* import Report from '../components/report/report' */
const Report = () => import(/* webpackChunkName: "Order_Report" */ '../components/report/report')
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      redirect: '/welcome',
      component: Home,
      /* welcome子路由 */
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Param },
        { path: '/goods', component: List },
        { path: '/goods/add', component: Add },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report }
      ]
    }
  ]
})
/* 设置路由导航守卫来控制访问权限 */
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
