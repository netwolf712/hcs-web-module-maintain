<template>
  <span>
    <span v-for="(item, index) in ipAdress" :key="index">
      <i v-if="index > 0" class="ipDot">.</i>
      <el-input
        style="width: 80px"
        type="number"
        @input="checkIpVal(item, index)"
        @keyup.native="turnIpPOS(item, index, $event)"
        v-model="item.value"
        ref="ipInput"
        :id="index"
        @blur="setDefaultVal(item)"
        :disabled="!canInput"
      />
    </span>
  </span>
</template>

<script>
export default {
  name: "IpAddress",
  props: {
    //字符串形式的IP地址
    ipAddressStr: {
      type: String,
      default: "0.0.0.0",
    },
    //是否可输入
    canInput: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      ipAdress: [
        {
          value: "",
        },
        {
          value: "",
        },
        {
          value: "",
        },
        {
          value: "",
        },
      ],
      cursorIndex: 0,
    };
  },
  created() {},
  watch: {
    ipAddressStr(newValue, oldValue) {
      if (!oldValue || oldValue == "0.0.0.0") {
        this.convertStrToIP(newValue);
      }
    },
  },
  methods: {
    /**
     * 将字符串形式的IP地址转换成数组
     */
    convertStrToIP(ipStr) {
      let ipArr = ipStr.split(".");
      this.ipAdress[0].value = ipArr[0];
      this.ipAdress[1].value = ipArr[1];
      this.ipAdress[2].value = ipArr[2];
      this.ipAdress[3].value = ipArr[3];
    },
    /**
     * 将IP数字转换成字符串
     */
    convertIPToStr() {
      return (
        this.ipAdress[0].value +
        "." +
        this.ipAdress[1].value +
        "." +
        this.ipAdress[2].value +
        "." +
        this.ipAdress[3].value
      );
    },
    //methods
    checkIpVal(item, index) {
      let self = this;
      //确保每个值都处于0-255
      let val = item.value;
      //当输入的是空格时，值赋为空
      val = val.trim();
      val = parseInt(val, 10);
      if (isNaN(val)) {
        val = "";
      } else {
        val = val < 0 ? 0 : val;
        val = val > 255 ? 255 : val;
      }
      item.value = val.toString();
      this.$emit("onAddressChange", this.convertIPToStr());
    },
    turnIpPOS(item, index, event) {
      let self = this;
      let e = event || window.event;
      //因无法准确获取光标位置，所以左移/删除/右移暂不处理
      //左箭头向左跳转，左一不做任何措施
      // if (e.keyCode == 37) {
      //   if (index == 0) {
      //   } else {
      //     self.$refs.ipInput[index - 1].focus();
      //   }
      // }
      //删除键把当前数据删除完毕后会跳转到前一个input，左移不做任何处理
      // if (e.keyCode == 8) {
      //   let val = item.value;
      //   if (index == 0) {
      //   } else {
      //     self.$refs.ipInput[index - 1].focus();
      //   }
      // }
      //回车键、空格键、冒号均向右跳转，右一不做任何措施
      if (
        // e.keyCode == 39 ||
        e.keyCode == 13 ||
        e.keyCode == 32 ||
        e.keyCode == 190
      ) {
        if (index == 3) {
        } else {
          self.$refs.ipInput[index + 1].focus();
        }
      }
    },
    setDefaultVal(item) {
      //当input失去焦点，而ip没有赋值时，会自动赋值为0
      let self = this;
      let val = item.value;
      if (val == "") {
        item.value = "0";
      }
    },
  },
};
</script>

<style scoped>
.ipAdress {
  display: flex;
  align-items: center;
  border: 1px solid #0190fe;
  width: 148px;
  margin-right: 10px;
}
.ipDot {
  margin: 5px;
}
</style>