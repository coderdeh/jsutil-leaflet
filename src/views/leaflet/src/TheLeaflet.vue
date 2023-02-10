<!--
 * @Author: daieh
 * @LastEditors: daieh
 * @Description: 
-->
<template>
  <div class="leaflet-wrap">
    <div
      id="leaflet-wrap-map"
      class="leaflet-wrap-map"
    ></div>
    <div
      class="leaflet-wrap-opearte"
      ref="opearte"
    >
      <div class="btns">
        <el-button
          v-show="isAllShow"
          @click="tranLeft(false)"
        >收起</el-button>
        <el-button
          v-show="!isAllShow"
          @click="tranLeft(true)"
        >展开</el-button>
      </div>
      <div class="maps">
        <el-button @click="mapOperate('zoom')">设置层级</el-button>
        <el-button @click="mapOperate('center')">设置中心点</el-button>
        <br>

        <el-button @click="mapOperate('marker')">添加Marker</el-button>
        <el-button @click="mapOperate('clearmarker')">清除Marker</el-button>
        <br>

        <el-button @click="mapOperate('cluster')">点位聚合</el-button>
        <el-button @click="mapOperate('clearcluster')">点位聚合</el-button>
        <br>

        <el-button @click="mapOperate('line')">绘制线</el-button>
        <el-button @click="mapOperate('clearline')">清除线</el-button>
        <br>

        <el-button @click="mapOperate('cricle')">绘制圆形</el-button>
        <el-button @click="mapOperate('clearcricle')">清除圆形</el-button>
        <br>

        <el-button @click="mapOperate('grid')">绘制网格边界</el-button>
        <el-button @click="mapOperate('cleargrid')">清除网格边界</el-button>
        <br>

        <el-button @click="mapOperate('head')">绘制热力图</el-button>
        <el-button @click="mapOperate('clearhead')">清除热力图</el-button>
        <br>

        <el-button @click="mapOperate('wms')">绘制WMS图层</el-button>
        <el-button @click="mapOperate('clearwms')">清除WMS图层</el-button>
        <br>

        <el-button @click="mapOperate('trajectory')">绘制轨迹</el-button>
        <el-button @click="mapOperate('cleartrajectory')">清除轨迹</el-button>
        <br>
      </div>
      <div class="track">
        <el-button @click="startTrack">播放</el-button>
        <el-button @click="stopTrack">暂停</el-button>
        <el-button @click="speetUp">加速</el-button>
        <el-button @click="speetDown">减速</el-button>
        <el-button @click="replayTrack">重播</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import SgupLeafletMap from '../../map/SgupLeafletMap'
const mcenter = [36.78839127856239, 116.68853759765626]
// const mtile = 'GaoDe.Normal.Map'
const mtile = '/sgup/tile?x={x}&y={y}&z={z}&customid=midnight&type=WGS84'
const wmsservice = '/geoserver/qh_grid/wms'
const wmslayer = 'qh_grid:qh_grid_1130_84'
const MAP = new SgupLeafletMap(mcenter, mtile, wmsservice, wmslayer)

import { reqEventList, reqAllEquiment, reqGridPolygon, reqPatrolTrackDetail } from '@/api/index'

export default {
  name: 'TheLeaflet',
  data () {
    return {
      isAllShow: true,
      moveMarker: null,
      speetX: 1,
      isShowTrack: false
    }
  },
  mounted () {
    this.initMap()
  },
  methods: {
    initMap () {
      MAP.createMap('leaflet-wrap-map', {
        preferCanvas: true,
        zoomControl: true,
        attributionControl: true
      })
    },

    // 地图操作
    mapOperate (val) {
      const zoom = MAP.getZoom()
      switch (val) {
        case 'zoom':
          MAP.setZoom(zoom + 1)
          break

        case 'center':
          MAP.setCenter([36.18418, 116.162767])
          break

        case 'marker':
          this.addMarker()
          break

        case 'clearmarker':
          this.clearMarker('event')
          break

        case 'cluster':
          this.addCluster()
          break

        case 'clearcluster':
          this.clearCluster()
          break

        case 'line':
          this.addOneLine()
          break

        case 'clearline':
          this.clearOneLine()
          break

        case 'cricle':
          MAP.clearCricle()
          MAP.addCricle([36.789954, 116.725273], 'cricle')
          break

        case 'clearcricle':
          MAP.clearCricle('cricle')
          break

        case 'grid':
          this.addGridPoly()
          break

        case 'cleargrid':
          MAP.clearAreaPolygon()
          break

        case 'head':
          this.addHead()
          break

        case 'clearhead':
          MAP.clearHeatmap('equipment')
          break

        case 'wms':
          this.addWMS()
          break

        case 'clearwms':
          MAP.clearWMS()
          break

        case 'trajectory':
          this.addTrajectory()
          break

        case 'cleartrajectory':
          MAP.clearTrack()
          break

        default:
          break
      }
    },

    // 添加点位
    async addMarker () {
      const params = {
        queryTypeEnum: 'ALLEVENT',
        type: 0,
        current: 1,
        size: 20
      }
      const res = await reqEventList(params)
      const { success, data } = res
      if (success) {
        data.forEach(item => {
          const detail = {
            ...item,
            location: [item.longitude, item.latitude],
            markerType: 'event',
            isCluster: false
          }
          MAP.addOneMarker(detail, this.eventMarkerClick, true)
        })
      }
    },

    // 清除Marker
    clearMarker (type) {
      MAP.clearMarker(type)
    },

    // marker的点击事件
    eventMarkerClick (detail) {
      console.log('marker点击回调', detail.location)
    },

    // 添加聚合
    async addCluster () {
      MAP.clearCluster('equipment')
      const res = await reqAllEquiment(4)
      const { success, data } = res
      if (success) {
        const markerList = []
        data.forEach(item => {
          const marker = MAP.addOneMarker(
            {
              ...item,
              location: [item.deviceLon, item.deviceLat],
              markerType: 'equipment',
              uniqueId: 'equipment_' + item.id,
              isCluster: true
            },
            item => {
              console.log('聚合点位详情', item)
            }
          )
          marker && markerList.push(marker)
        })
        MAP.addCluster(markerList, 'equipment')
      }
    },

    // 清除聚合
    clearCluster () {
      MAP.clearCluster('equipment')
    },

    // 添加线
    addOneLine () {
      const lines = [
        [36.78839127856239, 116.68853759765626],
        [36.789954, 116.725273],
        [36.78509731286164, 116.74750984848552]
      ]
      MAP.addPolyLine(lines, 'line')
    },

    // 清除线
    clearOneLine () {
      MAP.clearPolyLine('line')
    },

    // 添加网格边界
    async addGridPoly () {
      MAP.clearAreaPolygon()
      const params = {
        type: 4,
        groupNo: 371425
      }
      const result = await reqGridPolygon(params)
      const { success, data } = result
      if (success) {
        MAP.addAreaPolygon(data, this.gridClick, true)
      }
    },

    // 网格的点击事件
    gridClick (target, center) {
      console.log('gridClick', target, center)
    },

    // 添加热力图
    async addHead () {
      MAP.clearHeatmap('equipment')
      const res = await reqAllEquiment(4)
      const { success, data } = res
      if (success) {
        const headData = data.map(item => {
          if (Number(item.deviceLat) && Number(item.deviceLon)) {
            return [
              item.deviceLat,
              item.deviceLon,
              Math.random()
            ]
          } else {
            return [
              36.5 + Math.random() / 10,
              116.5 + Math.random() / 10,
              Math.random()
            ]
          }
        })
        MAP.addHeatMap(headData, 'equipment')
      }
    },

    // WMS图层
    addWMS () {
      MAP.clearWMS()
      MAP.addWMS()
    },

    // 添加轨迹
    async addTrajectory () {
      let tractArr = [
        [36.55649, 116.74433],
        [36.55649, 116.74533],
        [36.55749, 116.74533],
        [36.55749, 116.74633],
        [36.55849, 116.74633]
      ]
      this.moveMarker = MAP.addTrack(tractArr)
    },

    // 轨迹播放
    startTrack () {
      if (!this.moveMarker.isPlay) {
        this.moveMarker.start()
      }
    },

    // 轨迹暂停
    stopTrack () {
      if (!this.moveMarker.isPause) {
        this.moveMarker.pause()
      }
    },

    // 轨迹重播
    replayTrack () {
      this.speetX = 1
      this.moveMarker.stop()
      this.startTrack()
    },

    // 轨迹加速
    speetUp () {
      if (this.moveMarker.isPlay) {
        this.speetX = this.speetX * 2
        this.moveMarker.setSpeetX(this.speetX)
      }
    },

    // 轨迹减速
    speetDown () {
      if (this.moveMarker.isPlay) {
        this.speetX = this.speetX / 2
        this.moveMarker.setSpeetX(this.speetX)
      }
    },

    tranLeft (val) {
      this.isAllShow = val
      if (val) {
        this.$refs.opearte.style.left = 0
      } else {
        this.$refs.opearte.style.left = '-15vw'
      }
    }
  }
};
</script>

<style lang='scss' scoped>
/deep/ .el-button {
  padding: 6px 8px;
  margin-top: 20px;
}
.leaflet-wrap {
  width: 100vw;
  height: 100vh;
  background: transparent;
  &-map {
    width: 100vw;
    height: 100vh;
  }
  &-opearte {
    z-index: 9999;
    width: 20vw;
    height: 90vh;
    background: #ffffff;
    padding: 24px;
    box-shadow: -2px 0px 12px 0px rgba(0, 0, 0, 0.09);
    position: absolute;
    top: 10vh;
    left: 0;
    transition: all 1s;

    .btns {
      width: 100%;
      text-align: right;
      cursor: pointer;
    }
  }
}
</style>