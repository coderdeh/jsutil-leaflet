/*
 * @Author: daieh
 * @LastEditors: daieh
 * @Description: 
 */
import Vue from 'vue'
import EventPop from './popup/EventPop.vue'

const EventPopup = Vue.extend(EventPop)

// marker
export const MarkerConfig = {
  event: {
    defaultIcon: require('@/assets/gis/event_default.png'),
    activeIcon: require('@/assets/gis/event_active.png'),
    defaultSize: [34, 42],
    activeSize: [40, 50]
  },
  equipment: {
    defaultIcon: require('@/assets/gis/equipment_default.png'),
    activeIcon: require('@/assets/gis/equipment_default.png'),
    defaultSize: [34, 42],
    activeSize: [40, 50]
  }
}

// 聚合
export const ClusterConfig = {
  equipment: {
    level1: require('@/assets/gis/equipment_0.png'),
    level2: require('@/assets/gis/equipment_1.png'),
    level3: require('@/assets/gis/equipment_2.png')
  }
}

// 弹框
export const LeafletPopup = {
  EventPopup,
}