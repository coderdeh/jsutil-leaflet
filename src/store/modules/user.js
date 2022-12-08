import storage from 'store'
import {getToken} from '@/utils/api.js';
const state = {
  accessToken: true
}
const mutations = {
  SET_TOKEN(state, token) {
      state.accessToken = token
      storage.set('accessToken', token)
  },
  REMOVE_TOKEN(state) {
    state.accessToken = ''
    storage.remove('accessToken')
  }
}
const actions = {
  setToken({commit}, token) {
    commit('SET_TOKEN', token)
  },
  // 此处根据三中心的接口  获取token等信息
  getToken({commit}, code) {
    const client_id = '752b96b792164c5cbca981b72dfc1ab1'
    const client_secret = '9a9ff1e9e1b24d8da13e3ace6528a504'
    return new Promise((resolve, reject) => {
      getToken(client_id, client_secret, code).then(res => {
        if(res.access_token) {
          commit('SET_TOKEN', res.access_token)
        }
        resolve(res)
      })
    }).catch(err => {
      console.log(err);
    })
  }
}
export default {
  state,
  mutations,
  actions
}