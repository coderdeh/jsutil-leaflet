const state = {
    // 判断32：9的屏
    is32: true,
    // 判断21：9的屏
    is21: true,
    floorArea: 0, // 智慧园区中间区域的 占地面积 参数
    allWarnCount: 0 // 智慧园区中间区域的 当前预警数 参数
}
const mutations = {
    SET_SCREEN_STATE_21(state, status) {
        state.is21 = status
    },
    SET_SCREEN_STATE_32(state, status) {
        state.is32 = status
    },
    SET_AREA_NUM(state, val){
        state.floorArea = val
    },
    SET_WARN_COUNT(state, val){
        state.allWarnCount = val
    },
}
const actions = {
    setScreenState({
        commit
    }, status) {
        commit('SET_SCREEN_STATE', status)
    },
    setAreaNum({
        commit
    }, value) {
        commit('SET_AREA_NUM', value)
    },
    setWarnCount({
        commit
    }, value) {
        commit('SET_WARN_COUNT', value)
    },
}
export default {
    state,
    mutations,
    actions
}