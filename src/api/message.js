import request from '@/utils/request'

export function fetchMessageList(params) {
  return request({
    url: '/starx-admin/messageBoard/loadAllMessage',
    method: 'get',
    params: params
  })
}
