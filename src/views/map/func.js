/*
 * @Author: daieh
 * @LastEditors: daieh
 * @Description: 
 */
const wms_service = '/geoserver/qh_grid/wms'
let gridLayers = 'qh_grid:qh_grid_1130_84'


function getFeatureInfoUrl (evt, map) {
  const latlng = evt.latlng
  var point = map.latLngToContainerPoint(latlng, map.getZoom())
  var size = map.getSize()
  var height = size.y
  height = Math.round(size.y)
  var width = size.x
  width = Math.round(width)
  var params = {
    service: 'WMS',
    version: '1.1.1',
    request: 'GetFeatureInfo',
    layers: `${gridLayers}`,
    bbox: map.getBounds().toBBoxString(),
    height: Math.round(height),
    width: Math.round(width),
    srs: 'EPSG:4326',
    style: '',
    format: 'application/openlayers',
    transparent: 'true',
    query_layers: `${gridLayers}`,
    info_format: 'application/json',
    feature_count: 50,
    exceptions: 'application/json'
  }

  params[params.version === '1.1.0' ? 'i' : 'x'] = point.x
  params[params.version === '1.1.0' ? 'j' : 'y'] = point.y
  return wms_service + L.Util.getParamString(params, wms_service, true)
}

export function getFeatureInfo (evt, map, callback) {
  var url = getFeatureInfoUrl(evt, map)
  fetch(url)
    .then(response => {
      return response.json()
    })
    .then(res => {
      const gridData = res.features[0]?.properties
      callback(gridData)
    })
}
