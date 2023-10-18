<template>
  <div class="app-container">
    <div>
      <span style="color: #ff0000"
        >请选择正确的升级包导入，升级成功后会重启系统，将短暂中断业务</span
      >
      <upload-file
        @onUploadFile="onUploadSys"
        :buttonName="sysButtonName"
        :fileAccept="fileAcceptSys"
      />
    </div>
    <div style="margin-top: 10px">
      <span style="color: #ff0000"
        >请选择正确的升级包导入，升级成功后会重启应用，将短暂中断业务</span
      >
      <upload-file
        @onUploadFile="onUploadApk"
        :buttonName="apkButtonName"
        :fileAccept="fileAcceptApk"
      />
    </div>
  </div>
</template>

<script>
import uploadFile from "@maintainModule/components/uploadFile";
import { handleUpgrade } from "@maintainModule/api/maintain/upgrade";
import upgradeChecker from "@maintainModule/api/maintain/upgradeChecker";
import { removeToken } from "@/utils/auth";

//升级状态-空闲
const upgrade_status_idle = 0;
//升级状态-拷贝数据中
const upgrade_status_copying = 1;
//升级状态-解压中
const upgrade_status_unzipping = 2;
//升级状态-升级中
const upgrade_status_upgrading = 3;
//升级状态-升级完成
const upgrade_status_finished = 4;
//升级状态-升级失败
const upgrade_status_failed = 5;
//升级状态-校验中
const upgrade_status_checking = 6;
//升级apk
const upgrade_type_apk = 0;
//升级系统
const upgrade_type_system = 1;

export default {
  name: "upgrade",
  components: {
    uploadFile,
  },
  data() {
    return {
      form: {
        password: "",
      },
      apkButtonName: "导入应用",
      fileAcceptApk: "*.apk",
      sysButtonName: "导入系统",
      fileAcceptSys: "*.zip",
    };
  },
  created() {},
  methods: {
    //上传成功回调
    onUploadApk(res) {
      handleUpgrade(res[0], upgrade_type_apk).then((res) => {
        if (res.code == 200) {
          this.$modal.loading("升级中，请稍候！");
          upgradeChecker.init();
          upgradeChecker.startCheck(this.onRestartSuccess);
        }
      });
    },
    onUploadSys(res) {
      handleUpgrade(res[0], upgrade_type_system).then((res) => {
        if (res.code == 200) {
          this.$modal.loading("升级中，请稍候！");
          upgradeChecker.init();
          upgradeChecker.startCheck(this.onRestartSuccess);
        }
      });
    },
    onRestartSuccess(status, reason) {
      if (status === 401) {
        this.$modal.closeLoading();
        removeToken();
        location.href = "/index";
      } else {
        if (status == this.upgrade_status_failed) {
          this.$modal.closeLoading();
          if (reason) {
            this.msgError(reason);
          }
        } else {
          var statusInfo = "升级异常";
          if (status == upgrade_status_copying) {
            statusInfo = "正在拷贝文件";
          } else if (status == upgrade_status_unzipping) {
            statusInfo = "正在解压文件";
          } else if (status == upgrade_status_upgrading) {
            statusInfo = "正在升级";
          } else if (status == upgrade_status_finished) {
            statusInfo = "升级完成";
          } else if (status == upgrade_status_checking) {
            statusInfo = "正在进行文件校验";
          }
          this.$modal.loading(statusInfo);
        }
      }
    },
  },
};
</script>