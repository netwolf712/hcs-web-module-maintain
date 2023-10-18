<template>
  <div class="app-container">
    <el-row>
      <el-col :span="6" style="margin-right: 12px">
        <device-base-info :autoLoad="true" />
      </el-col>
      <el-col :span="8" style="margin-right: 12px">
        <network-info :autoLoad="true" :readOnly="false" />
      </el-col>
      <el-col :span="6">
        <time-info :autoLoad="true" :readOnly="false" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DeviceBaseInfo from "@maintainModule/components/deviceBaseInfo.vue";
import NetworkInfo from "@maintainModule/components/networkInfo.vue";
import TimeInfo from "@maintainModule/components/timeInfo.vue";
export default {
  name: "deviceBase",
  components: {
    DeviceBaseInfo,
    NetworkInfo,
    TimeInfo,
  },
  data() {
    return {
      //设备的基本信息
      deviceBaseInfo: {
        deviceId: "",
        systemVersion: "",
        module: "",
        kernelVersion: "",
        netConfig: {
          linkMode: "1",
          ipAddress: "",
          mask: "",
        },
        timeConfig: {
          enableNtp: true,
          ntpServer: "",
          unixTime: null,
        },
      },
    };
  },
  created() {},
  methods: {},
};
</script>


