import { download, packageFile } from "@maintainModule/api/maintain/file";
import { saveAs } from "file-saver";
var downloadHelper = {
  //下载检测，反复检查是否准备好可供下载
  downloadInterval: 2000,
  //下载定时器
  downloadTimer: null,
  //等待下载的文件
  filePath: [],
  //保存的文件名称
  saveFileName: null,
  //主文件类型
  mainType: null,
  //子文件类型
  subType: null,
  //是否打包
  isZip: true,
  callback: null,
  //打包成功后的回调
  packageCallback: null,
  //打包成功后是否自动下载
  autoDownload: true,
};
downloadHelper.downloadFile = function () {
  download(
    downloadHelper.filePath,
    downloadHelper.isZip,
    downloadHelper.mainType,
    downloadHelper.subType
  ).then((res) => {
    let type = "application/zip";
    if (
      downloadHelper.mainType === "media" &&
      downloadHelper.subType === "audio"
    ) {
      type = "audio/mp3";
    } else if (
      downloadHelper.mainType === "media" &&
      downloadHelper.subType === "video"
    ) {
      type = "audio/mp4";
    } else if (
      downloadHelper.mainType === "media" &&
      downloadHelper.subType === "image"
    ) {
      type = "image/png";
    }
    const blob = new Blob([res], { type: type });
    if (downloadHelper.saveFileName) {
      saveAs(blob, downloadHelper.saveFileName);
    }
    if (downloadHelper.callback) {
      downloadHelper.callback(
        downloadHelper.saveFileName
          ? downloadHelper.saveFileName
          : window.URL.createObjectURL(blob)
      );
    }
  });
};
downloadHelper.doPackageFile = function () {
  packageFile(
    downloadHelper.filePath,
    downloadHelper.isZip,
    downloadHelper.mainType,
    downloadHelper.subType
  ).then((res) => {
    if (res.code) {
      if (res.code != 200) {
        this.msgError(res.msg);
      } else {
        downloadHelper.filePath = [];
        downloadHelper.filePath.push(res.data.filePath);
        if (res.data.ready) {
          if (downloadHelper.packageCallback) {
            downloadHelper.packageCallback(res.data);
          }
          if (downloadHelper.autoDownload) {
            downloadHelper.downloadFile();
          }
        } else {
          downloadHelper.startDownloadTimer();
        }
      }
    }
  });
};
downloadHelper.startDownload = function (
  fileList,
  mainType,
  subType,
  saveFilePath,
  callback,
  isZip = true,
  packageCallback = null,
  autoDownload = true
) {
  downloadHelper.filePath = fileList;
  downloadHelper.isZip = isZip;
  downloadHelper.mainType = mainType;
  downloadHelper.subType = subType;
  downloadHelper.saveFileName = saveFilePath;
  downloadHelper.callback = callback;
  downloadHelper.packageCallback = packageCallback;
  downloadHelper.autoDownload = autoDownload;
  downloadHelper.doPackageFile();
};

downloadHelper.startDownloadTimer = function () {
  if (downloadHelper.downloadTimer == null) {
    setTimeout(() => {
      downloadHelper.doPackageFile();
    }, downloadHelper.downloadInterval);
  }
};
export default downloadHelper;
