import { handleTest, getTestStatus } from "@maintainModule/api/maintain/test";
const TEST_STATUS_FINISHED = 2;
var testChecker = {
  //应用之前的启动时间
  preStatus: null,
  //每秒检测一次是否存活
  checkTimeInterval: 2000,
  //检测定时器
  checkTimer: null,
  //状态变化回调
  statusCallback: null,
};

testChecker.init = function () {
  testChecker.stopCheck();
};

testChecker.startCheck = function (testCommand, statusCallback) {
  //先停止之前的
  testChecker.stopCheck();
  testChecker.statusCallback = statusCallback;
  handleTest(testCommand, true).then((res) => {
    if (testChecker.checkTimer == null) {
      testChecker.checkTimer = setInterval(() => {
        getTestStatus()
          .then((res) => {
            if (res.code === 200) {
              var status = res.data.status;
              //如果启动时间不一样，则说明重启过了
              if (testChecker.preStatus != status) {
                testChecker.preStatus = status;
                if (testChecker.statusCallback) {
                  testChecker.statusCallback(res.data.status, res.data.result);
                }

                //如果是测试完成，则自动停止定时器
                if (status === TEST_STATUS_FINISHED) {
                  testChecker.stopCheck();
                }
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }, testChecker.checkTimeInterval);
    }
  });
};
testChecker.stopCheck = function () {
  if (testChecker.checkTimer != null) {
    clearInterval(testChecker.checkTimer);
    testChecker.checkTimer = null;
    //停止测试
    handleTest("", false);
  }

  testChecker.preStatus = null;
};
export default testChecker;
