import request from '@/utils/request'

// 查询日志配置列表
export function list(logType) {
  var params = {
    commandId:"maintain-req-log-get-config",
    data:{
      logType:logType
    }
  }
  return request({
    url: '/maintain/custom',
    method: 'post',
    data: params
  })
}

// 配置日志
export function config(logConfig) {
  var params = {
    commandId:"maintain-req-log-set-config",
    data:[]
  }
  params.data.push(logConfig)
  return request({
    url: '/maintain/custom',
    method: 'post',
    data: params
  })
}

