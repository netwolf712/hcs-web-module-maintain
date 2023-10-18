import { checkIsAlive } from "@maintainModule/api/monitor/server";

var aliveChecker = {
  //应用之前的启动时间
  preStartTime: null,
  //每秒检测一次是否存活
  checkTimeInterval: 2000,
  //检测定时器
  checkTimer: null,
  //检测到存活后的回调
  aliveCallback: null,
};

aliveChecker.init = function () {
  aliveChecker.stopCheck();
  if (aliveChecker.preStartTime == null) {
    checkIsAlive().then((res) => {
      aliveChecker.preStartTime = res.data.startTime;
    });
  }
};

aliveChecker.startCheck = function (aliveCallback) {
  aliveChecker.aliveCallback = aliveCallback;
  if (aliveChecker.checkTimer == null) {
    aliveChecker.checkTimer = setInterval(() => {
      checkIsAlive()
        .then((res) => {
          if (res.code === 200) {
            var startTime = res.data.startTime;
            //如果启动时间不一样，则说明重启过了
            if (aliveChecker.preStartTime != startTime) {
              aliveChecker.preStartTime = startTime;
              if (aliveChecker.aliveCallback) {
                aliveChecker.aliveCallback();
              }
            }
          } else if (res.code == 401) {
            if (aliveChecker.aliveCallback) {
              aliveChecker.aliveCallback();
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }, aliveChecker.checkTimeInterval);
  }
};
aliveChecker.stopCheck = function () {
  if (aliveChecker.checkTimer != null) {
    clearInterval(aliveChecker.checkTimer);
    aliveChecker.checkTimer = null;
  }
  aliveChecker.preStartTime = null;
};
export default aliveChecker;
