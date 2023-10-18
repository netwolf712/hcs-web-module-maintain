import request from "@/utils/request";
import request2 from "@/utils/request2";
import { getToken } from "@/utils/auth";
// 获取服务信息
export function getServer() {
  var params = {
    commandId: "maintain-req-device-info",
  };
  return request({
    url: "/maintain/custom",
    method: "post",
    data: params,
  });
}

/**
 * 重启应用
 */
export function restartApp(password) {
  var params = {
    commandId: "maintain-req-restart-app",
    data: {
      token: getToken(),
      password: password,
    },
  };
  return request({
    url: "/maintain/custom",
    method: "post",
    data: params,
  });
}

/**
 * 重启系统
 */
export function restartSystem(password) {
  var params = {
    commandId: "maintain-req-restart-system",
    data: {
      token: getToken(),
      password: password,
    },
  };
  return request({
    url: "/maintain/custom",
    method: "post",
    data: params,
  });
}

/**
 * 恢复出厂设置
 */
export function resetSystem(password) {
  var params = {
    commandId: "maintain-req-reset-system",
    data: {
      token: getToken(),
      password: password,
    },
  };
  return request({
    url: "/maintain/custom",
    method: "post",
    data: params,
  });
}

/**
 * 还原配置
 */
export function recoverConfig(recoverFilePath, recoverType) {
  var params = {
    commandId: "maintain-req-recover-config",
    data: {
      recoverFilePath: recoverFilePath,
      recoverType: recoverType,
    },
  };
  return request({
    url: "/maintain/custom",
    method: "post",
    data: params,
  });
}

/**
 * 检查是否还存活
 */
export function checkIsAlive() {
  var params = {
    commandId: "maintain-req-is-alive",
  };
  return request2({
    url: "/maintain/custom",
    method: "post",
    data: params,
  });
}
