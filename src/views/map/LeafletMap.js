/*
 * @Author: daieh
 * @LastEditors: daieh
 * @Description: 
 */
import L from 'leaflet'
// leaflet样式
import 'leaflet/dist/leaflet.css'
// 热力图
import 'leaflet.heat'
// 聚合
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

import './trackPlay'

// 解决不同坐标系点位偏移
import { pointCorrection } from '@shzl/shzl-leaflet'
pointCorrection(L)

import { getFeatureInfo } from './func'

// 扩展L.Marker
L.Marker.include({
  getExtData () {
    return this.options.extData
  }
})

// 中心点
const LEAFLETCENTER = [36.78839127856239, 116.68853759765626]
const rate = (document.body.clientHeight || document.documentElement.clientHeight) / 1080

// marker配置
import { MarkerConfig, ClusterConfig, LeafletPopup } from './config'

class LeafletMap {
  // 初始化地图默认参数
  defaultOptions = {
    center: L.latLng(LEAFLETCENTER[0], LEAFLETCENTER[1]),
    zoom: 11,
    maxZoom: 18,
    minZoom: 10,
    // 默认的放大缩小插件
    zoomControl: false,
    // 点击地图时是否关闭弹窗
    closePopupOnClick: true,
    // 是否使用canvas渲染
    preferCanvas: true,
    // 是否添加leaflet版权信息
    attributionControl: true,
    // 是否通过双击放大地图
    doubleClickZoom: true,
    // 地图是否可以进行拖拽
    dragging: true,
    // 是否通过鼠标滚轮进行缩放
    scrollWheelZoom: true,
  }

  // 地图实例
  leafletMap = null

  // WMS图层
  wmsLayer = null
  isAddWms = false

  // 图层收集器
  featureCollectors = {}

  // 点位集合
  markers = {}

  // 聚合
  clusters = {}

  // 轨迹
  trackFeature = null

  // 创建地图对象
  createMap (mapId, option = {}) {
    this.leafletMap = L.map(mapId, Object.assign(option, this.defaultOptions))
    this.loadTileLayers()

    // 双击事件
    this.leafletMap.on('dblclick', e => {
      console.log('dblclick', e.target.options)
    })

    // 右击事件
    this.leafletMap.on('contextmenu', e => {
      console.log('contextmenu', e.target.options)
    })

    this.initWMS()
  }

  // 初始化WMS图层
  initWMS () {
    this.wmsLayer = L.tileLayer.wms('/geoserver/qh_grid/wms', {
      layers: 'qh_grid:qh_grid_1130_84',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      zIndex: 9999,
      opacity: 1
    })
    this.leafletMap.on('click', e => {
      if (!this.isAddWms) return
      getFeatureInfo(e, this.leafletMap, (data) => {
        console.log('WMS图层数据', data)
      })
    })
  }

  // 添加wms
  addWMS () {
    this.isAddWms = true
    const feature = this.getFeature('wms') || this.addFeature('wms')
    this.wmsLayer.addTo(feature)
  }

  // 清除wms
  clearWMS () {
    this.isAddWms = false
    this.removeaFeature('wms')
  }


  // 加载地图服务  瓦片图层  leaflet中创建图层的方法是异步方法 GaoDe.Normal.Map
  async loadTileLayers () {
    const tile = await L.tileLayer.chinaProvider('/sgup/tile?x={x}&y={y}&z={z}&customid=midnight&type=WGS84', {
      custom: true
    })
    this.leafletMap.addLayer(tile)
  }

  // 地图层级
  setZoom (zoom) {
    this.leafletMap.setZoom(zoom)
  }

  // 获取层级
  getZoom () {
    return this.leafletMap.getZoom()
  }

  // 地图中心点
  setCenter (latLng) {
    // this.leafletMap.panTo(L.latLng(latLng[0], latLng[1]))
    this.leafletMap.flyTo(latLng)
  }

  // 层级及中心点
  setCenterZoom (latLng, zoom) {
    this.leafletMap.setView(latLng, zoom)
  }

  // 获取图层
  getFeature (type) {
    return this.featureCollectors[type]
  }

  // 添加图层
  addFeature (type) {
    const feature = L.featureGroup()
    this.removeaFeature(type)
    this.featureCollectors[type] = feature.addTo(this.leafletMap)
    return feature
  }

  // 清除图层
  removeaFeature (type = null) {
    if (!type) {
      Object.keys(this.featureCollectors).forEach(key => {
        this.featureCollectors[key].remove()
        delete this.featureCollectors[key]
        delete this.markers[key]
      })
    } else if (this.featureCollectors[type]) {
      this.featureCollectors[type].remove()
      delete this.featureCollectors[type]
      delete this.markers[type]
    }
  }

  // 绘制线
  addPolyLine (latLngs, option = {}) {
    const polyLineOptions = Object.assign({
      color: '#ff0000',
      fillColor: '#ff00ff',
      weigth: 4
    }, option)

    const polyLine = L.polyline(latLngs, polyLineOptions).addTo(this.leafletMap)
    this.leafletMap.fitBounds(polyLine.getBounds())
  }

  // 绘制圆形
  addCricle (latLng, radius = 5000) {
    const circle = L.circle(L.latLng(latLng), {
      color: 'rgba(82,137,252,0.20)',
      fillColor: '#5289FC',
      fillOpacity: 0.2,
      radius: radius
    })
    const feature = this.getFeature('circle') || this.addFeature('circle')
    feature.addLayer(circle)
  }

  // 清除圆形
  clearCricle () {
    this.removeaFeature('circle')
  }

  // 添加点位
  addOneMarker (detail, clickEvent = null, showDetail = false) {
    const { isCluster, markerType } = detail
    let marker = null

    // 判断是否有点位数据
    if (detail.location && Array.isArray(detail.location) && detail.location.length >= 2) {
      detail.latitude = detail.location[1]
      detail.longitude = detail.location[0]
    } else {
      return console.info('暂无点位数据')
    }

    // 判断是否聚合
    if (isCluster) {
      marker = this.creatClusterMarker(markerType, detail, this.getIcon(markerType, false))
    } else {
      marker = this.creatOrdinaryMarker(markerType, detail, this.getIcon(markerType, false))
    }

    if (!marker) {
      return console.info('创建marker失败')
    } else if (clickEvent) {
      // marker的点击事件
      marker.on('click', e => {
        const detail = e.target.getExtData()

        // 设置当前marker点位居中
        this.setCenter(marker.getLatLng())

        if (showDetail) {
          // 显示popup详情
          this.handleMarkerClick(markerType, detail)
        }

        clickEvent && clickEvent(detail)
      })
    }
    return marker
  }

  // 删除点位
  clearMarker (type) {
    this.removeaFeature(type)
  }

  // 显示详情popup
  handleMarkerClick (markerType, detail) {
    const lnglat = [detail.latitude, detail.longitude]
    let ConstructorName = null

    if (markerType === 'event') {
      ConstructorName = LeafletPopup.EventPopup
    }

    const HtmlNode = new ConstructorName({
      propsData: {
        detail
      }
    }).$mount()

    L.popup({
      offset: [0, -30],
      closeButton: true,
      closeOnClick: true
    }).setLatLng(lnglat).setContent(HtmlNode.$el).openOn(this.leafletMap)
  }

  // 创建聚合marker
  creatClusterMarker (type, data, icon) {
    // TODO: id不存在生成随机id
    const uniqueId = data.uniqueId || `${type}_${data.id}`

    return L.marker([data.latitude, data.longitude], {
      icon: icon || L.icon({ iconUrl: data.iconUrl }),
      extData: { uniqueId, markerType: type, ...data },
      zIndexOffset: data.zIndexOffset || 0
    })
  }

  // 创建普通marker
  creatOrdinaryMarker (type, data, icon) {

    const marker = this.creatClusterMarker(type, data, icon)
    if (!marker) {
      return console.log('无法创建marker点位')
    }
    const uniqueId = marker.getExtData().uniqueId

    // 添加marker
    this.markers[type] = this.markers[type] || {}
    this.markers[type][uniqueId] = marker

    const feature = this.getFeature(type) || this.addFeature(type)
    feature.addLayer(marker)

    return marker
  }

  // 通过类型获取marker的图标
  getIcon (markerType, isActive) {
    let MarkerDeaultSetting = MarkerConfig[markerType] || {
      defaultIcon: '',
      activeIcon: '',
      defaultSize: [16, 16],
      activeSize: [20, 20]
    }
    let icon = null
    if (isActive) {
      icon = new L.Icon({
        // 图标尺寸
        iconSize: MarkerDeaultSetting.activeSize,
        // 图标的取图地址
        iconUrl: MarkerDeaultSetting.activeIcon,
        // 图标中心点偏移量
        iconAnchor: [
          MarkerDeaultSetting.activeSize[0] / 2,
          MarkerDeaultSetting.activeSize[1]
        ]
      })
    } else {
      icon = new L.Icon({
        // 图标尺寸
        iconSize: MarkerDeaultSetting.defaultSize,
        // 图标的取图地址
        iconUrl: MarkerDeaultSetting.defaultIcon,
        // 图标中心点偏移量
        iconAnchor: [
          MarkerDeaultSetting.defaultSize[0] / 2,
          MarkerDeaultSetting.defaultSize[1]
        ]
      })
    }
    return icon
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

  // 绘制地理边界
  addAreaPolygon (data, callback = null, showName = false) {
    const PolygonData = Array.isArray(data) ? data : [data]
    const geoLayer = this.getFeature('area') || this.addFeature('area')
    const textLayer = this.getFeature('text') || this.addFeature('text')

    PolygonData.forEach((item) => {
      const geojsonData = JSON.parse(JSON.stringify(item))
      if (item.geojson) {
        const gridLayer = L.geoJSON(JSON.parse(item.geojson), {
          color: '#1E90FF',
          fillColor: '#ff00ff',
          fillOpacity: 0.4,
          ...geojsonData
        }).addTo(geoLayer)

        const gridCenter = gridLayer.getBounds().getCenter()

        // 添加网格的点击事件
        gridLayer.on('click', e => {
          if (callback) {
            callback(e.target.options, gridCenter)
          }
        })

        // 添加标注
        if (showName) {
          const textLocation = [gridCenter.lat, gridCenter.lng]
          const normalInnerHtml = `<span class="polygon_text">${item.groupName || ''}</span>`
          const activeInnerHtml = `<span class="polygon_text_active">${item.groupName || ''}</span>`
          const iconAnchor = item.groupNo === '371425001' ? [-20 * rate, 10 * rate] : [20 * rate, -10 * rate]

          const normalDiv = L.divIcon({
            html: normalInnerHtml,
            iconAnchor: iconAnchor
          })
          const activeDiv = L.divIcon({
            html: activeInnerHtml,
            iconAnchor: iconAnchor
          })

          const textMarker = L.marker(textLocation, {
            icon: normalDiv
          }).addTo(textLayer)

          gridLayer.on('mousemove', e => {
            e.target.setStyle({
              color: '#13eee8',
              fillColor: '#1ed2ff',
              fillOpacity: 0.4
            })
            textMarker.setIcon(activeDiv)
          })

          gridLayer.on('mouseout', e => {
            e.target.setStyle({
              color: '#1E90FF',
              fillColor: '#ff00ff',
              fillOpacity: 0.4
            })
            // e.target.resetStyle()
            textMarker.setIcon(normalDiv)
          })

        }

      } else {
        console.log('无geojson数据')
      }
    })
  }

  // 清除地理边界
  clearAreaPolygon () {
    this.removeaFeature('area')
    this.removeaFeature('text')
  }

  // 热力图
  addHeatMap (data, type) {
    const _data = data.filter(item => {
      return item.length && item[0] && item[1]
    }).map(i => {
      return new L.LatLng(i[0], i[1], i[2] || 100)
    })

    const colorGradient = {
      "0.13": "rgba(255,142,60,0.13)",
      "0.37": "rgba(255,153,78,0.37)",
      "0.61": "rgba(255,154,81,0.61)",
      "0.74": "rgba(255,143,62,0.74)",
      "0.87": "rgba(255,142,60,0.87)",
      "1": "rgba(255,142,60,1)"
    }

    const headLayer = L.heatLayer(_data, { radius: 40, gradient: colorGradient })
    headLayer.addTo(this.addFeature(`heat-${type}`))
  }

  // 清除热力图
  clearHeatmap (type) {
    if (type) {
      this.removeaFeature(type)
    } else {
      Object.keys(this.featureCollectors).filter(name => name.includes('heat-')).forEach(name => this.removeaFeature(name))
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
      iconSize: [40 * rate, 40 * rate],
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
      iconSize: [40 * rate, 40 * rate],
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
        iconSize: [32 * rate, 32 * rate],
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
}

export default LeafletMap