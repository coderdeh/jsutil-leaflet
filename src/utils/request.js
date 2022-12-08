/*
 * @Author: daieh
 * @LastEditors: daieh
 * @Description: 
 */
import * as qs from "qs"
import axios from "axios"

function decorateService (service) {
	// 请求拦截
	service.interceptors.request.use(
		// 请求配置
		(config) => {
			if (!config.headers) {
				config.headers = {}
			} else if (config.data && Object.prototype.toString.call(config.data) === "[object Object]") {
				config.data = qs.stringify(config.data)
			}
			// 设置token
			config.headers["accessToken"] = "20d29f28-9482-4919-b059-ea1fd06224f2"
			return config
		},
		(error) => {
			// 做一些请求错误处理
			Promise.reject(error)
		}
	)

	// 响应拦截器
	service.interceptors.response.use(
		// 响应成功处理, 状态: 200
		(response) => {
			const result = response.data
			return result
		},
		// 响应失败处理, 状态: !200
		(error) => {
			console.log(error.message)
			return Promise.reject(error)
		}
	)
}

const servicesOptions = {
	axiosSvc: {
		timeout: 1000 * 20,
		baseURL: process.env.VUE_APP_BASE_URL,
	},
}

function getServices (options) {
	const res = {}
	Object.keys(options).forEach((svcName) => {
		res[svcName] = axios.create(options[svcName])
		decorateService(res[svcName])
	})
	return res
}

export default getServices(servicesOptions)
