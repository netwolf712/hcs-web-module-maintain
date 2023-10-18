<template>
  <div>
    <el-card class="box-card-network">
      <div slot="header" class="clearfix">
        <span class="card-title">{{ cardName }}</span>
        <el-button
          v-if="!readOnly"
          style="float: right; padding: 3px 0"
          type="text"
          @click="dialogVisible = true"
          >修改</el-button
        >
      </div>
      <div class="text item">
        工作模式：
        <el-radio-group v-model="netConfig.linkMode">
          <el-radio
            v-for="dict in netTypeOptions"
            :key="dict.value"
            :label="dict.value"
            :disabled="readOnly"
            >{{ dict.label }}</el-radio
          >
        </el-radio-group>
      </div>
      <div class="text item">
        IP地址：<ip-address
          ref="ipAddress"
          :canInput="netConfig.linkMode == '2' && !readOnly"
          :ipAddressStr="netConfig.ipAddress"
          :onAddressChange="changeIpAddress"
        />
      </div>
      <div class="text item">
        子网掩码：<ip-address
          ref="netMask"
          :canInput="netConfig.linkMode == '2' && !readOnly"
          :ipAddressStr="netConfig.mask"
          :onAddressChange="changeNetMask"
        />
      </div>
      <div class="text item">
        网 关 ：<ip-address
          ref="gateway"
          :canInput="netConfig.linkMode == '2' && !readOnly"
          :ipAddressStr="netConfig.gateway"
          :onAddressChange="changeGateway"
        />
      </div>
      <div class="text item">
        DNS ：<ip-address
          ref="gateway"
          :canInput="netConfig.linkMode == '2' && !readOnly"
          :ipAddressStr="netConfig.dns1"
          :onAddressChange="changeDns"
        />
      </div>
    </el-card>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" center>
      <span>修改IP地址会自动重启应用，会导短暂的业务中断。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/**
 * DHCP
 */
const LINK_MODE_DHCP = "1";
/**
 * 静态地址
 */
const LINK_MODE_STATIC = "2";

import {
  getNetConfig,
  updateIpAddress,
} from "@maintainModule/api/maintain/deviceBase";
import IpAddress from "@maintainModule/components/ipAddress.vue";

export default {
  name: "NetworkInfo",
  components: {
    IpAddress,
  },
  props: {
    cardName: {
      type: String,
      default: "网络信息",
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
      netConfig: {
        linkMode: "1",
        ipAddress: "",
        mask: "",
      },
      //是否弹出提示框
      dialogVisible: false,
      netTypeOptions: [
        {
          value: "1",
          label: "DHCP",
        },
        {
          value: "2",
          label: "手动配置",
        },
      ],
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
      getNetConfig().then((res) => {
        if (res.code === 200) {
          this.netConfig = res.data;
        } else {
          this.msgError(res.msg);
        }
      });
    },
    changeIpAddress(ipAddress) {
      this.msgSuccess("IP地址改变 ==> " + ipAddress);
      this.netConfig.ipAddress = ipAddress;
    },
    changeNetMask(netMask) {
      this.msgSuccess("子网掩码改变 ==> " + netMask);
      this.netConfig.mask = netMask;
    },
    changeGateway(gateway) {
      this.msgSuccess("网关改变 ==> " + gateway);
      this.netConfig.gateway = gateway;
    },
    changeDns(dns) {
      this.msgSuccess("DNS改变 ==> " + dns);
      this.netConfig.dns1 = dns;
    },
    doSubmit() {
      //只有是静态IP才需要改变IP地址
      if (this.netConfig.linkMode == LINK_MODE_STATIC) {
        this.netConfig.ipAddress = this.$refs.ipAddress.convertIPToStr();
        this.netConfig.mask = this.$refs.netMask.convertIPToStr();
        this.netConfig.gateway = this.$refs.gateway.convertIPToStr();
      }
      updateIpAddress(this.netConfig)
        .then((res) => {
          this.dialogVisible = false;
          if (res.code == 200) {
            //this.msgSuccess("修改成功");
            this.$modal.loading("应用重启中，请稍候！");
            //5秒后跳转到新修改的地址
            setTimeout(() => {
              this.$modal.closeLoading();
              window.location.href =
                "http://" + this.netConfig.ipAddress + ":8080";
            }, 5000);
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

.box-card-network {
  width: 100%;
}
.card-title {
  font-size: 18px;
  font-weight: bold;
}
</style>

