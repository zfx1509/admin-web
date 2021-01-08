import request from '@/utils/request'

export function getAreaList(){
  return request({
    url:'/starx-admin/area/treeList',
    method:'get'
  })
}

export function addArea(data) {
  return request({
    url:'/starx-admin/area/create',
    method:'post',
    data:data
  })
}
export function updateArea(data) {
  return request({
    url:'/starx-admin/area/update/' + data.areaId,
    method:'post',
    data:data
  })
}
export function deleteArea(id) {
  return request({
    url:'/starx-admin/area/delete/' + id,
    method:'delete'
  })
}
export function getTheDepot(id){
  return request({
    url:'/starx-admin/depot/getDepotListByCityId',
    method:'get',
    params: { "cityId": id }
  })
}
export function addDepot(data) {
  return request({
    url:'/starx-admin/depot/add',
    method:'post',
    data:data
  })
}
export function updateDepot(data) {
  return request({
    url:'/starx-admin/depot/update/' + data.depotId,
    method:'post',
    data:data
  })
}
export function deleteDepot(id) {
  return request({
    url:'/starx-admin/depot/delete/' + id,
    method:'delete'
  })
}
export function addZone(data) {
  return request({
    url:'/starx-admin/area/zone/create',
    method:'post',
    data: data
  })
}
export function updateZone(data) {
  return request({
    url:'/starx-admin/area/zone/update/' + data.id,
    method:'post',
    data: data
  })
}
export function queryZoneList(id) {
  return request({
    url:'/starx-admin/area/zone/listByZoneOne',
    method:'get',
    params: { "zoneOne": id }
  })
}


export function getCityList() {
  return request({
    url:'/starx-admin/area/listByPid',
    method:'get',
    params: { "pid":0 }
  })
}

export function fetchFeeList() {
  return request({
    url:'/starx-admin/area/fee/list',
    method:'get'
  })
}
export function addZoneFee(data) {
  return request({
    url:'/starx-admin/area/fee/create',
    method:'post',
    data: data
  })
}
export function updateZoneFee(data) {
  return request({
    url:'/starx-admin/area/fee/update/' + data.id,
    method:'post',
    data: data
  })
}
export function deleteZoneFee(id) {
  return request({
    url:'/starx-admin/area/fee/delete/' + id,
    method:'delete'
  })
}

export function getListByAreaId(params) {
  return request({
    url:'/starx-admin/area/fee/listByAreaId',
    method:'get',
    params
  })
}

export function getListByAreaLevel(params) {
  return request({
    url:'/starx-admin/area/listByAreaLevel',
    method:'get',
    params
  })
}

export function getLadderLevel(params) {
  return request({
    url:'/starx-admin/fee/ladder/list',
    method:'get',
    params
  })
}

export function updateLadderLevel(data) {
  return request({
    url:'/starx-admin/fee/ladder/update/' + data.id,
    method:'post',
    data
  })
}

export function deleteLadder(id) {
  return request({
    url:'/starx-admin/fee/ladder/delete/' + id,
    method:'delete'
  })
}

export function addLadder(data) {
  return request({
    url:'/starx-admin/fee/ladder/create',
    method:'post',
    data: data
  })
}
