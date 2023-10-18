<template>
  <div>
    <el-card class="box-card-time">
      <div slot="header" class="clearfix">
        <span class="card-title">{{ cardName }}</span>
        <el-button
          v-if="!readOnly"
          style="float: right; padding: 3px 0"
          type="text"
          @click="doSubmit(false)"
          >修改</el-button
        >
        <el-button
          v-if="!readOnly && !timeConfig.enableNtp"
          style="float: right; padding: 3px 0; margin-right: 12px"
          type="text"
          @click="doSubmit(true)"
          >与本机同步时间</el-button
        >
      </div>
      <current-time
        :startTime="deviceCurrentTime ? parseInt(deviceCurrentTime) : null"
        :hour24="timeConfig.hour24"
      />
      <div class="text item">
        是否24小时制：
        <el-radio-group v-model="timeConfig.hour24">
          <el-radio
            v-for="dict in hour24Options"
            :key="dict.value"
            :label="dict.value"
            :disabled="readOnly"
            >{{ dict.label }}</el-radio
          >
        </el-radio-group>
      </div>
      <div class="text item">
        是否自动获取时区：
        <el-radio-group v-model="timeConfig.autoTimeZone">
          <el-radio
            v-for="dict in autoTimeZoneOptions"
            :key="dict.value"
            :label="dict.value"
            :disabled="readOnly"
            >{{ dict.label }}</el-radio
          >
        </el-radio-group>
      </div>
      <div class="text item">
        当前时区：
        <el-select
          v-model="timeConfig.timeZoneId"
          placeholder="请选择"
          :disabled="timeConfig.autoTimeZone || readOnly"
        >
          <el-option
            v-for="item in timeZoneOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="text item">
        是否启用NTP服务器：
        <el-radio-group v-model="timeConfig.enableNtp">
          <el-radio
            v-for="dict in ntpOptions"
            :key="dict.value"
            :label="dict.value"
            :disabled="readOnly"
            >{{ dict.label }}</el-radio
          >
        </el-radio-group>
      </div>
      <div class="text item" v-if="timeConfig.enableNtp">
        NTP服务器地址：<el-input
          v-model="timeConfig.ntpServer"
          :disabled="!timeConfig.enableNtp || readOnly"
          placeholder="NTP服务器地址"
          style="width: 180px"
        />
      </div>
    </el-card>

    <!-- <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" center>
      <span>确定修改时间配置？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doSubmit">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
/**
 * 一分钟的毫秒数
 */
const MINUTE_MILLISECOND = 60000;
import {
  getTimeConfig,
  updateTimeConfig,
} from "@maintainModule/api/maintain/deviceBase";
import CurrentTime from "@maintainModule/components/currentTime.vue";
export default {
  name: "TimeInfo",
  components: {
    CurrentTime,
  },
  props: {
    cardName: {
      type: String,
      default: "时间信息",
    },
    readOnly: {
      type: Boolean,
      default: true,
    },
    //是否自动装载
    autoLoad: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      timeConfig: {
        enableNtp: true,
        ntpServer: "",
        unixTime: null,
        hour24: true,
        timeZoneName: null,
        timeZoneId: null,
      },
      //是否弹出提示框
      //dialogVisible: false,
      ntpOptions: [
        {
          value: false,
          label: "停用",
        },
        {
          value: true,
          label: "启用",
        },
      ],
      //是否24小时制
      hour24Options: [
        {
          value: false,
          label: "12小时制",
        },
        {
          value: true,
          label: "24小时制",
        },
      ],
      //是否自动时区
      autoTimeZoneOptions: [
        {
          value: false,
          label: "手动设置时区",
        },
        {
          value: true,
          label: "自动获取时区",
        },
      ],
      //时区列表
      timeZoneOptions: [
        {
          value: "Asia/Shanghai",
          label: "中国标准时间",
        },
        {
          value: "Asia/Hong_Kong",
          label: "中国香港",
        },
        {
          value: "Asia/Taipei",
          label: "中国台北",
        },
      ],
      //设备当前时间
      deviceCurrentTime: null,
    };
  },
  watch: {
    autoLoad(isAutoLoad) {
      if (isAutoLoad) {
        this.getInfo();
      }
    },
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      getTimeConfig().then((res) => {
        if (res.code === 200) {
          this.timeConfig = res.data;
          this.deviceCurrentTime = this.timeConfig.unixTime;
        } else {
          this.msgError(res.msg);
        }
      });
    },

    doSubmit(syncLocalTime) {
      //如果是根据NTP服务器获取，则不能传当前时间
      if (this.timeConfig.enableNtp || !syncLocalTime) {
        this.timeConfig.unixTime = null;
      } else {
        let date = new Date();
        this.timeConfig.unixTime = date.getTime();
      }
      this.timeConfig.timeZoneName = null;
      updateTimeConfig(this.timeConfig)
        .then((res) => {
          this.dialogVisible = false;
          if (res.code == 200) {
            this.msgSuccess("修改成功");
            if (!this.timeConfig.enableNtp) {
              let date = new Date();
              this.deviceCurrentTime = date.getTime();
            }
          } else {
            this.msgError(res.msg ? res.msg : "修改失败");
          }
        })
        .catch((error) => {
          this.dialogVisible = false;
          //this.msgError(error);
        });
    },
  },
};
</script>
<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card-time {
  width: 100%;
}
.card-title {
  font-size: 18px;
  font-weight: bold;
}
</style>

