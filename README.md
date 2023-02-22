### sgup-jsutil-leaflet 一个基于leaflet封装的操作地图的基类

包的使用

```javascript
1、安装
npm install sgup-jsutil-leaflet --save

2、面向对象开发
// 导入基类
import SgupJsutilLeaflet from 'sgup-jsutil-leaflet'
// 导入样式
import 'sgup-jsutil-leaflet/dist/leaflet.css'
// 配置文件
import { MarkerConfig, ClusterConfig, LeafletPopup } from './leaflet-config'

// 子类
class SgupLeafletMap extends SgupJsutilLeaflet{
    // 获取点位图标
  getMarkerConfig (markerType) {
    return MarkerConfig[markerType]
  }

  // 获取popup弹框
  getLeafletPopup (markerType) {
    return LeafletPopup[markerType]
  }
    
  // 绘制轨迹
  addTrack (trackList) {
    // 加速度列表
    var speedList = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    this.trackFeature = L.featureGroup()
    this.trackFeature.setZIndex(120)

    // 轨迹线
    const polyline = L.polyline(trackList, {
      color: '#FF00FF',
      fillColor: '#FF00FF',
      weight: 4
    })

    // 轨迹开始点位
    const startPoint = this.creatOrdinaryMarker('tractStart', {
      latitude: trackList[0][0],
      longitude: trackList[0][1],
      id: '0'
    }, new L.Icon({
      iconSize: [40 * this.rate, 40 * this.rate],
      // 图标的取图地址
      iconUrl: require('./icons/track_start.png'),
      // 图标中心点偏移量
      iconAnchor: [20, 20]
    }))

    // 轨迹结束点位
    const endPoint = this.creatOrdinaryMarker('tractEnd', {
      latitude: trackList[trackList.length - 1][0],
      longitude: trackList[trackList.length - 1][1],
      id: '1'
    }, new L.Icon({
      iconSize: [40 * this.rate, 40 * this.rate],
      // 图标的取图地址
      iconUrl: require('./icons/track_end.png'),
      // 图标中心点偏移量
      iconAnchor: [20, 20]
    }))

    // 移动的点位
    const moveMarker = L.animatedMarker(polyline.getLatLngs(), {
      speedList: speedList,
      interval: 3000,
      zIndexOffset: 130,
      icon: new L.Icon({
        iconSize: [32 * this.rate, 32 * this.rate],
        // 图标的取图地址
        iconUrl: require('./icons/track_move.png'),
        // 图标中心点偏移量
        iconAnchor: [16, 16]
      }),
      autoStart: false
    })

    this.trackFeature.addLayer(moveMarker)
    this.trackFeature.addLayer(polyline)
    this.trackFeature.addLayer(startPoint)
    this.trackFeature.addLayer(endPoint)
    this.trackFeature.addTo(this.leafletMap)
    this.leafletMap.setView(trackList[0], 17)

    return moveMarker
  }

  // 清除轨迹
  clearTrack () {
    if (this.trackFeature) {
      const bool = this.leafletMap.hasLayer(this.trackFeature)
      if (bool) {
        this.trackFeature.remove()
      }
    }
  }
    
   // 添加聚合
  addCluster (data, type) {
    const clusterOptions = ClusterConfig[type]
    var cluster = this.clusters[type] || L.markerClusterGroup({
      showCoverageOnHover: false,
      iconCreateFunction: function (cluster) {
        const count = cluster._childCount
        let bgUrl = clusterOptions['level1']
        if (count > 10 && count <= 99) {
          bgUrl = clusterOptions['level2']
        } else if (count > 99) {
          bgUrl = clusterOptions['level3']
        }
        return L.divIcon({ iconSize: [40, 40], html: `<div style="background:url('${bgUrl}') no-repeat;background-size: 100%;width:40px;height:40px;text-align:center;line-height:40px;color: #fff;">${count}</div>` })
      }
    })
    if (!this.clusters[type]) {
      this.leafletMap.addLayer(cluster)
    } else {
      this.clusters[type].clearLayers()
    }
    data.forEach(item => {
      cluster.addLayer(item)
    })
    this.clusters[type] = cluster
    return this.clusters[type]
  }

  // 清除聚合
  clearCluster (type) {
    if (!this.clusters[type]) return

    if (type && this.clusters[type]) {
      this.clusters[type].remove()
      delete this.clusters[type]
    } else {
      for (const key in this.clusters) {
        this.clusters[key] && this.clusters[key].remove()
      }
      this.clusters = {}
    }
  }
  
  // WMS图层返回的数据
  wmsCallback (data) {
    console.log('wms图层数据')
  }
    
}


// 方法使用 创建SgupLeafletMap实例对象
import SgupLeafletMap from '../../map/SgupLeafletMap'
// 地图中心点 纬度在前  必传
const mcenter = [36.78839127856239, 116.68853759765626]
// 地图底图地址 必传
const mtile = '/sgup/tile?x={x}&y={y}&z={z}&customid=midnight&type=WGS84'
// wms服务地址 非必传 默认值为null
const wmsservice = '/geoserver/qh_grid/wms'
// wms服务图层 非必传 默认值为null
const wmslayer = 'qh_grid:qh_grid_1130_84'
const MAP = new SgupLeafletMap(mcenter, mtile, wmsservice, wmslayer)
```

leaflet-config.js文件

```javascript
import Vue from 'vue'
import EventPop from './popup/EventPop.vue'

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
  'event': Vue.extend(EventPop),
}
```

方法说明

|      方法名      | 方法用途         | 参数                                        | 参数说明                                                     |      是否必须      | 使用示例                                                     |
| :--------------: | :--------------- | :------------------------------------------ | :----------------------------------------------------------- | :----------------: | :----------------------------------------------------------- |
|    createMap     | 创建地图对象     | mapId, option                               | mapId：地图容器；option：地图配置项                          |       是；否       | MAP.createMap('leaflet-wrap-map', { preferCanvas: true,  zoomControl: true, attributionControl: true}) |
|     getZoom      | 获取地图层级     | 无                                          | 无                                                           |         无         | MAP.getZoom()                                                |
|     setZoom      | 设置地图层级     | zoom                                        | zoom：地图层级，Number类型                                   |         是         | MAP.setZoom(MAP.getZoom() + 1)                               |
|    setCenter     | 设置地图中心点   | latLng                                      | latLng: 经纬度数组                                           |         是         | MAP.setCenter([36.18418, 116.162767])                        |
|    getCenter     | 获取地图中心点   | 无                                          | 无                                                           |         无         | MAP.getCenter()                                              |
|  setCenterZoom   | 设置中心点及层级 | latLng, zoom                                | latLng：中心点数组；zoom：层级                               |         是         | MAP.setCenterZoom([36.18418, 116.162767], 15)                |
|    addFeature    | 添加图层         | type                                        | type: 图层类型，String类型                                   |         是         | MAP.addFeature('event')                                      |
|    getFeature    | 获取图层         | type                                        | type: 图层类型，String类型                                   |         是         | MAP.getFeature('event')                                      |
|  removeaFeature  | 清除图层         | type                                        | type: 图层类型，String类型，不传则删除全部图层               |        ·否         | MAP.removeaFeature('event')                                  |
|   addPolyLine    | 绘制线           | latLngs, lineType, option                   | latLngs：线数组,lineType：线类型, option：线配置             |     是，是，否     | MAP.addPolyLine([[36.78839127856239, 116.68853759765626], [36.789954, 116.725273]], 'line') |
|  clearPolyLine   | 清除线           | lineType                                    | 线类型，String                                               |         是         | MAP.clearPolyLine('line')                                    |
|    addCricle     | 绘制圆形         | latLng,cricleType radius                    | latLng：中心点, cricleType: 类型，radius：半径               |     是，是，否     | MAP.addCricle([36.789954, 116.725273], 'cricle')             |
|   clearCricle    | 清除圆形         | cricleType                                  | cricleType: 类型，                                           |         是         | MAP.clearCricle('cricle')                                    |
|   addOneMarker   | 添加点位         | detail，clickEvent，showDetail              | detail：点位详情，其中要包含isCluster和markerType字段，isCluster表示是否聚合，markerType表示点位类型，clickEvent：点位点击事件，showDetail：是否显示详情 |     是，否，否     | ![image-20230210102608998](C:/Users/DEH18/AppData/Roaming/Typora/typora-user-images/image-20230210102608998.png) |
|   clearMarker    | 删除点位         | type                                        | 点位类型                                                     |         是         | MAP.clearMarker('event')                                     |
|  addAreaPolygon  | 绘制地理边界     | data, callback, showName , color, fillColor | data：网格边界数据, callback：网格的点击回调, showName ：是否显示网格标注,如果需要展示网格标注，请在网格边界数据中心添加groupName字段， color：网格边界颜色, fillColor：网格填充色 | 是，否，否，否，否 | MAP.addAreaPolygon(data, this.gridClick, true)               |
| clearAreaPolygon | 清除地理边界     | 无                                          | 无                                                           |         无         | MAP.clearAreaPolygon()                                       |
|    addHeatMap    | 绘制热力图       | data, type                                  | data：热力图数据, type：热力图类型                           |       是，是       | ![image-20230210103920891](C:/Users/DEH18/AppData/Roaming/Typora/typora-user-images/image-20230210103920891.png) |
|   clearHeatmap   | 清除热力图       | type                                        | 热力图类型                                                   |         是         | MAP.clearHeatmap('equipment')                                |
|     clearWMS     | 清除WMS图层      | 无                                          | 无                                                           |         无         | MAP.clearWMS()                                               |
|      addWMS      | 添加WMS图层      | 无                                          | 无                                                           |         无         | MAP.addWMS()                                                 |



