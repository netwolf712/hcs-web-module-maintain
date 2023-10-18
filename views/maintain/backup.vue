<template>
  <div class="app-container">
    <span style="color: #ff0000">点击按钮将备份此设备上的所有数据</span>
    <div>
      <el-button type="primary" size="mini" @click="backup()"
        >备份数据</el-button
      >
    </div>
    <div style="margin-top: 10px">
      <span style="color: #ff0000"
        >请选择正确的备份数据并导入，数据导入后原先的配置将会被覆盖，可以选择【备份数据】功能先备份原先数据，避免数据丢失</span
      >
      <upload-file
        @onUploadFile="onUploadFile"
        :buttonName="buttonName"
        :fileAccept="fileAccept"
      />
    </div>

    <!-- <el-dialog
      title="输入密码确认"
      :visible.sync="open"
      width="700px"
      append-to-body
    >
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="密码：">
              <el-input
                show-password
                v-model="form.password"
                placeholder="密码"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import downloadHelper from "@maintainModule/api/maintain/downloadHelper";
import uploadFile from "@maintainModule/components/uploadFile";
import { recoverConfig } from "@maintainModule/api/monitor/server";
import aliveChecker from "@maintainModule/api/maintain/aliveChecker";
import { removeToken } from "@/utils/auth";
export default {
  name: "resetSystem",
  components: {
    uploadFile,
  },
  data() {
    return {
      form: {
        password: "",
      },
      //应用之前的启动时间
      preStartTime: null,
      //每秒检测一次是否存活
      checkTimeInterval: 2000,
      //检测定时器
      checkTimer: null,
      //弹框
      open: false,
      //下载检测，反复检查是否准备好可供下载
      downloadInterval: 2000,
      //下载定时器
      downloadTimer: null,
      buttonName: "导入",
      fileAccept: "*.zip",
    };
  },
  created() {},
  methods: {
    // 打开加载层
    openLoading() {
      this.$modal.loading("正在重启，请稍候！");
    },
    closeLoading() {
      this.$modal.closeLoading();
      if (this.checkTimer != null) {
        clearInterval(this.checkTimer);
      }
      this.checkTimer = null;
    },

    showConfirmDialog() {
      this.open = true;
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    /** 提交按钮 */
    submitForm: function () {},
    backup() {
      var downloadName = "backup.zip";
      this.$modal.loading("数据下载中...");
      downloadHelper.startDownload(
        null,
        "other",
        "backup",
        downloadName,
        this.downloadFinished,
        true
      );
    },
    downloadFinished() {
      this.$modal.closeLoading();
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    //上传成功回调
    onUploadFile(res) {
      aliveChecker.init();
      recoverConfig(res[0], 1).then((res) => {
        if (res.code == 200) {
          this.$modal.loading("应用重启中，请稍候！");
          aliveChecker.init();
          aliveChecker.startCheck(this.onRestartSuccess);
        }
      });
    },
    onRestartSuccess() {
      this.$modal.closeLoading();
      removeToken();
      location.href = "/index";
    },
  },
};
</script>