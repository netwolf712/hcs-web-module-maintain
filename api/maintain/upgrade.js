import request from "@/utils/request";
import request2 from "@/utils/request2";
// 升级
export function handleUpgrade(filePath, upgradeType) {
  var params = {
    commandId: "maintain-req-upgrade",
    data: {
      filePath: filePath,
      upgradeType: upgradeType,
    },
  };
  return request({
    url: "/maintain/custom",
    method: "post",
    data: params,
  });
}

// 获取升级状态
export function getUpgradeStatus() {
  var params = {
    commandId: "maintain-req-upgrade-status",
  };
  return request2({
    url: "/maintain/custom",
    method: "post",
    data: params,
  });
}
