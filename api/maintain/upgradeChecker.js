import { getUpgradeStatus } from "@maintainModule/api/maintain/upgrade";

var upgradeChecker = {
  //应用之前的启动时间
  preStatus: null,
  //每秒检测一次是否存活
  checkTimeInterval: 2000,
  //检测定时器
  checkTimer: null,
  //状态变化回调
  statusCallback: null,
};

upgradeChecker.init = function () {
  upgradeChecker.stopCheck();
};

upgradeChecker.startCheck = function (statusCallback) {
  upgradeChecker.statusCallback = statusCallback;
  if (upgradeChecker.checkTimer == null) {
    upgradeChecker.checkTimer = setInterval(() => {
      getUpgradeStatus()
        .then((res) => {
          if (res.code === 200) {
            var status = res.data.status;
            //如果启动时间不一样，则说明重启过了
            if (upgradeChecker.preStatus != status) {
              upgradeChecker.preStatus = status;
              if (upgradeChecker.statusCallback) {
                upgradeChecker.statusCallback(res.data.status, res.data.reason);
              }
            }
          } else if (res.code == 401) {
            if (upgradeChecker.statusCallback) {
              upgradeChecker.statusCallback(401, null);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }, upgradeChecker.checkTimeInterval);
  }
};
upgradeChecker.stopCheck = function () {
  if (upgradeChecker.checkTimer != null) {
    clearInterval(upgradeChecker.checkTimer);
    upgradeChecker.checkTimer = null;
  }
  upgradeChecker.preStatus = null;
};
export default upgradeChecker;
