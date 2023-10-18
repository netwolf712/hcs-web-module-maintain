<template>
  <div class="app-container">
    <span style="color: #ff0000">点击按钮将重启系统，业务将会短暂中断</span>
    <el-button type="primary" @click="showConfirmDialog()">重启</el-button>
    <!-- 日志详细 -->
    <el-dialog
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
    </el-dialog>
  </div>
</template>

<script>
import { restartSystem } from "@maintainModule/api/monitor/server";
import { removeToken } from "@/utils/auth";
import aliveChecker from "@maintainModule/api/maintain/aliveChecker";
export default {
  name: "restartSystem",
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
    };
  },
  created() {
    aliveChecker.init();
  },
  methods: {
    // 打开加载层
    openLoading() {
      this.$modal.loading("正在重启，请稍候！");
    },
    showConfirmDialog() {
      this.open = true;
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    /** 提交按钮 */
    submitForm: function () {
      restartSystem(this.form.password).then((response) => {
        if (response.code === 200) {
          this.msgSuccess("发送成功");
          this.open = false;
          aliveChecker.startCheck(this.onRestartSuccess);
          this.openLoading();
        } else {
          this.msgError(response.msg);
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