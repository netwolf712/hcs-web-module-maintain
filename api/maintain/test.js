import request from "@/utils/request";
import request2 from "@/utils/request2";
// 执行测试操作
export function handleTest(testCommand, startTest) {
  var params = {
    commandId: "maintain-req-test",
    data: {
      testCommand: testCommand,
      startTest: startTest,
    },
  };
  return request({
    url: "/maintain/custom",
    method: "post",
    data: params,
  });
}

// 获取测试状态
export function getTestStatus() {
  var params = {
    commandId: "maintain-req-test-status",
  };
  return request2({
    url: "/maintain/custom",
    method: "post",
    data: params,
  });
}
