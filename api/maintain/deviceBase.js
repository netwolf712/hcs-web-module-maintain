import request from "@/utils/request";
import request2 from "@/utils/request2";
// 获取设备基本信息
export function getDeviceBaseInfo() {
  var params = {
    commandId: "maintain-req-device-base-info",
  };
  return request({
    url: "/maintain/custom",
    method: "post",
    data: params,
  });
}

/**
 * 获取网络配置
 */
export function getNetConfig() {
  var params = {
    commandId: "maintain-req-net-config",
  };
  return request({
    url: "/maintain/custom",
    method: "post",
    data: params,
  });
}

/**
 * 获取时间配置
 */
export function getTimeConfig() {
  var params = {
    commandId: "maintain-req-time-config",
  };
  return request({
    url: "/maintain/custom",
    method: "post",
    data: params,
  });
}

// 更新设备ip地址
export function updateIpAddress(netConfig) {
  var params = {
    commandId: "maintain-req-update-ip-address",
    data: netConfig,
  };
  return request2({
    url: "/maintain/custom",
    method: "post",
    data: params,
  });
}

// 更新设备时间设置
export function updateTimeConfig(timeConfig) {
  var params = {
    commandId: "maintain-req-update-time",
    data: timeConfig,
  };
  return request2({
    url: "/maintain/custom",
    method: "post",
    data: params,
  });
}

/**
 * 截屏
 */
export function captureScreen() {
  var params = {
    commandId: "maintain-req-screen-capture",
    data: {},
  };
  return request2({
    url: "/maintain/custom",
    method: "post",
    data: params,
  });
}
