import request from '@/utils/request'

export function getUserList(params){
  return request({
    url:'/starx-admin/member/loadAllMember',
    params,
    method:'get'
  })
}

export function alterAccount(id, data){
  return request({
    url:'/starx-admin/member/updateBalance/' + id,
    method:'post',
    data:data
  })
}
export function updateUser(data){
  return request({
    url:'/starx-admin/member/update/' + data.id,
    method:'post',
    data:data
  })
}
export function deleteUser(id){
  return request({
    url:'/starx-admin/member/delete/' + id,
    method:'post'
  })
}
