/*
 * @Author: daieh
 * @LastEditors: daieh
 * @Description: 
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from "element-ui"

// global css
import '@/styles/index.scss'
import 'element-ui/lib/theme-chalk/index.css'
import '@/utils/prototype.js'

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
	render: h => h(App),
	router,
	store
}).$mount('#app')