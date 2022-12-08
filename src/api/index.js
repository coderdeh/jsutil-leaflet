/*
 * @Author: daieh
 * @LastEditors: daieh
 * @Description: 
 */
import request from '@/utils/request'
const { axiosSvc } = request

// 事件
export function reqEventList (params) {
  return axiosSvc({
    method: 'get',
    url: "/flowableEvent/api/eventEventInfo/v1/query",
    params
  })
}

// 设备
export function reqAllEquiment (moduleType) {
  return axiosSvc({
    method: 'get',
    url: "/social/api/deviceInfo/v1/allPage",
    params: {
      moduleType
    }
  })
}

export function reqGridPolygon (params) {
  return axiosSvc({
    method: 'get',
    url: '/gis/api/gridMap/v1/findAll',
    params
  })
}

export function reqPatrolTrackDetail () {
  return axiosSvc.get('/social/api/gridPatrolRecord/v1/84842')
}