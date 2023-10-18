<template>
  <div class="app-container">
    <el-row>
      <el-button type="primary" @click="pingTest">ping测试</el-button>
      <el-button type="success" @click="topTest">top测试</el-button>
      <el-button type="info" @click="memTest">查看内存</el-button>
      <el-button type="warning" @click="diskTest">查看磁盘空间</el-button>
      <el-button type="danger" @click="customTest">自定义</el-button>
      <el-button
        type="primary"
        v-if="needUserCommand"
        round
        @click="startTest"
        >{{ commandBtnName }}</el-button
      >
    </el-row>
    <el-row v-if="needUserCommand" style="margin-top: 10px">
      <el-input
        v-model="testUserInputCommand"
        :placeholder="placeHolder"
      ></el-input>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-input
        type="textarea"
        :autosize="{ minRows: 10, maxRows: 100 }"
        placeholder=""
        v-model="testResult"
      >
      </el-input>
    </el-row>
  </div>
</template>

<script>
import testChecker from "@maintainModule/api/maintain/testChecker";
//测试状态-空闲
const TEST_STATUS_IDLE = 0;
//测试状态-测试中
const TEST_STATUS_TESTING = 1;
//测试状态-测试结束
const TEST_STATUS_FINISHED = 2;
//ping测试
const TEST_COMMAND_PING = "ping -c 10 ";
//top测试
const TEST_COMMAND_TOP = "top -n 5";
//查看内存
const TEST_COMMAND_MEMNORY = "free -m";
//查看磁盘空间
const TEST_COMMAND_DISK = "df -h";
//自定义测试命令
const TEST_COMMAND_CUSTOME = "";
export default {
  name: "resetSystem",
  data() {
    return {
      //测试结果
      testResult: "",
      //测试命令
      testCommand: TEST_COMMAND_PING,
      //用户输入部分的命令
      testUserInputCommand: "",
      //输入提示框部分的内容
      placeHolder: "请输入要ping的地址",
      needUserCommand: true,
      //开始按钮的显示内容
      commandBtnName: "开始ping测试",
    };
  },
  created() {},
  methods: {
    //ping测试
    pingTest() {
      this.testCommand = TEST_COMMAND_PING;
      this.placeHolder = "请输入要ping的地址";
      this.commandBtnName = "开始ping测试";
      this.needUserCommand = true;
    },
    //top命令测试
    topTest() {
      this.testCommand = TEST_COMMAND_TOP;
      this.testUserInputCommand = "";
      this.needUserCommand = false;
      this.startTest();
    },
    //查看内存测试
    memTest() {
      this.testCommand = TEST_COMMAND_MEMNORY;
      this.testUserInputCommand = "";
      this.needUserCommand = false;
      this.startTest();
    },
    //查看磁盘空间测试
    diskTest() {
      this.testCommand = TEST_COMMAND_DISK;
      this.testUserInputCommand = "";
      this.needUserCommand = false;
      this.startTest();
    },
    //用户自定义测试
    customTest() {
      this.testCommand = TEST_COMMAND_CUSTOME;
      this.testUserInputCommand = "";
      this.placeHolder = "请输入测试命令";
      this.commandBtnName = "开始自定义测试";
      this.needUserCommand = true;
    },
    //开始测试
    startTest() {
      if (this.needUserCommand && !this.testUserInputCommand) {
        this.msgError("测试内容不能为空");
        return;
      }
      var testCommandComobo = this.testCommand + this.testUserInputCommand;
      this.$modal.loading("测试中，请稍候！");
      testChecker.startCheck(testCommandComobo, this.onTestCallback);
    },
    //测试回调
    onTestCallback(status, reason) {
      if (status === TEST_STATUS_IDLE) {
        this.$modal.closeLoading();
      } else if (status === TEST_STATUS_TESTING) {
        this.testResult = "测试中";
      } else {
        this.$modal.closeLoading();
        if (reason) {
          this.testResult = reason;
        } else {
          this.testResult = "测试结束，但结果为空";
        }
      }
    },
  },
};
</script>