<template>
  <el-card class="box-card-device-base">
    <div slot="header" class="clearfix">
      <span class="card-title">{{ cardName }}</span>
    </div>
    <div class="text item">产品名称：{{ deviceBaseInfo.productName }}</div>
    <div class="text item">产品型号：{{ deviceBaseInfo.module }}</div>
    <div class="text item">序列号：{{ deviceBaseInfo.deviceId }}</div>
    <div class="text item">系统版本号：{{ deviceBaseInfo.systemVersion }}</div>
    <div class="text item">产品型号：{{ deviceBaseInfo.module }}</div>
    <div class="text item">内核版本号：{{ deviceBaseInfo.kernelVersion }}</div>
    <div class="text item">
      应用运行时间：{{
        appRunTime ? runtimeFormater(parseInt(appRunTime)) : ""
      }}
    </div>
    <div class="text item">
      系统运行时间：{{
        sysRunTime ? runtimeFormater(parseInt(sysRunTime)) : ""
      }}
    </div>
    <current-time
      :startTime="deviceCurrentTime ? parseInt(deviceCurrentTime) : null"
      :hour24="deviceBaseInfo.timeConfig.hour24"
    />
  </el-card>
</template>

<script>
import { getDeviceBaseInfo } from "@maintainModule/api/maintain/deviceBase";
import CurrentTime from "@maintainModule/components/currentTime.vue";
/**
 * 一天的毫秒数
 */
const DAY_MILLISECOND = 86400000;
/**
 * 一小时的毫秒数
 */
const HOUR_MILLISECOND = 3600000;
/**
 * 一分钟的毫秒数
 */
const MINUTE_MILLISECOND = 60000;
/**
 * 1秒的毫秒数
 */
const SECOND_MILLISECOND = 1000;
export default {
  name: "DeviceBaseInfo",
  components: {
    CurrentTime,
  },
  props: {
    cardName: {
      type: String,
      default: "设备信息",
    },
    //是否自动装载
    autoLoad: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      deviceBaseInfo: {
        deviceId: "",
        systemVersion: "",
        module: "",
        kernelVersion: "",
        timeConfig: {
          unixTime: null,
          hour24: true,
        },
      },
      //动态计时器
      timeInterval: null,
      //系统运行时长
      sysRunTime: null,
      //app运行时长
      appRunTime: null,
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
    this.initTimeInterval();
  },
  methods: {
    getInfo() {
      getDeviceBaseInfo().then((res) => {
        console.log(res);
        if (res.code === 200) {
          this.deviceBaseInfo = res.data;
          this.deviceCurrentTime = this.deviceBaseInfo.timeConfig.unixTime;
        } else {
          this.msgError(res.msg);
        }
      });
    },
    /**
     * 初始化动态计时器
     */
    initTimeInterval() {
      if (!this.timeInterval) {
        this.timeInterval = setInterval(() => {
          if (this.sysRunTime) {
            this.sysRunTime = parseInt(this.sysRunTime) + SECOND_MILLISECOND;
          } else {
            this.sysRunTime = this.deviceBaseInfo.systemRunTime;
          }
          if (this.appRunTime) {
            this.appRunTime = parseInt(this.appRunTime) + SECOND_MILLISECOND;
          } else {
            this.appRunTime = this.deviceBaseInfo.appRunTime;
          }
        }, SECOND_MILLISECOND);
      }
    },

    runtimeFormater(runtimeLength) {
      let timeStr = "";
      if (runtimeLength > DAY_MILLISECOND) {
        timeStr += Math.trunc(runtimeLength / DAY_MILLISECOND) + "天";
        runtimeLength %= DAY_MILLISECOND;
      }
      if (runtimeLength > HOUR_MILLISECOND) {
        timeStr += Math.trunc(runtimeLength / HOUR_MILLISECOND) + "小时";
        runtimeLength %= HOUR_MILLISECOND;
      }
      if (runtimeLength > MINUTE_MILLISECOND) {
        timeStr += Math.trunc(runtimeLength / MINUTE_MILLISECOND) + "分钟";
        runtimeLength %= MINUTE_MILLISECOND;
      }
      timeStr += Math.trunc(runtimeLength / SECOND_MILLISECOND) + "秒";
      return timeStr;
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

.box-card-device-base {
  width: 100%;
}
.card-title {
  font-size: 18px;
  font-weight: bold;
}
</style>

