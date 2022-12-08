/*
 * @Author: daieh
 * @LastEditors: daieh
 * @Description: 
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

//修改原型对象中的push方法
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}



export const constantRouterMap = [
  {
    path: '*',
    redirect: '/',
    hidden: true
  },
  {
    path: '/',
    component: () => import("@/views/leaflet")
  }
]

export default new Router({
  mode: 'history', //后端支持可开
  base: '/',
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})