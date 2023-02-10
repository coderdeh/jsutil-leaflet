import SgupJsutilLeaflet from 'sgup-jsutil-leaflet'
import 'sgup-jsutil-leaflet/dist/leaflet.css'
// marker配置
import { MarkerConfig, ClusterConfig, LeafletPopup } from './leaflet-config'

class SgupLeafletMap extends SgupJsutilLeaflet {
  // 获取点位图标
  getMarkerConfig (markerType) {
    return MarkerConfig[markerType]
  }

  // 获取popup弹框
  getLeafletPopup (markerType) {
    return LeafletPopup[markerType]
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

  wmsCallback (data) {
    console.log('wms图层数据')
  }


}

export default SgupLeafletMap