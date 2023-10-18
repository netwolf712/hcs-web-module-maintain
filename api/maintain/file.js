import request from "@/utils/request";

//获取文件列表
export function list(dir, mainType, subType, withDir) {
  var params = {
    commandId: "maintain-req-get-file-list",
    data: {
      dir: dir,
      mainType: mainType,
      subType: subType,
      withDir: withDir,
    },
  };
  return request({
    url: "/maintain/custom",
    method: "post",
    data: params,
  });
}

// 下载文件
export function download(fileList, zipAll, mainType, subType) {
  var params = {
    fileList: fileList,
    zipAll: zipAll,
    mainType: mainType,
    subType: subType,
  };
  return request({
    url: "/file/download",
    method: "post",
    data: params,
    responseType: "blob",
  });
}

//文件打包
export function packageFile(fileList, zipAll, mainType, subType) {
  // var fileList = [];
  // fileList.push(filePath);
  var data = {
    fileList: fileList,
    zipAll: zipAll,
    mainType: mainType,
    subType: subType,
  };
  var params = {
    commandId: "maintain-req-package-file",
    data: data,
  };
  return request({
    url: "/maintain/custom",
    method: "post",
    data: params,
  });
}

/**
 * 文件操作
 */
export function operateFile(operateParams) {
  var params = {
    commandId: "maintain-req-operate-file",
    data: operateParams,
  };
  return request({
    url: "/maintain/custom",
    method: "post",
    data: params,
  });
}
