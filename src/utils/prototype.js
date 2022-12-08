/*
 * @Author: daieh
 * @LastEditors: daieh
 * @Description: 
 */
import Vue from 'vue'

// event Bus
var eventBus = new Vue()
Vue.prototype.$EventBus = eventBus

// 全局颜色变量
Vue.prototype.primaryColor = '#1ad7ff'

// 注册全局组件
const requireComponent = require.context(
  // 其组件目录的相对路径
  '@/components',
  // 是否查询其子目录
  true,
  // 匹配基础组件文件名的正则表达式
  /Base[A-Z]\w+\.js$/
)
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = upperFirst(
    camelCase(fileName.split('/').pop().replace(/\.\w+$/, ''))
  )
  Vue.component(
    componentName,
    componentConfig.default || componentConfig
  )
})