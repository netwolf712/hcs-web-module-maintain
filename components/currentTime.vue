<template>
  <div class="text item">
    系统当前时间：{{
      deviceCurrentTime ? timeFormater(parseInt(deviceCurrentTime)) : ""
    }}
  </div>
</template>

<script>
import { formatDate } from "@/utils/ruoyi";
export default {
  name: "CurrentTime",
  props: {
    startTime: {
      type: Number,
      default: null,
    },
    hour24: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      deviceCurrentTime: null,
    };
  },

  created() {
    this.initTimeInterval();
  },
  methods: {
    /**
     * 初始化动态计时器
     */
    initTimeInterval() {
      if (!this.timeInterval) {
        this.timeInterval = setInterval(() => {
          if (this.deviceCurrentTime) {
            this.deviceCurrentTime = parseInt(this.deviceCurrentTime) + 1000;
          } else {
            this.deviceCurrentTime = this.startTime;
          }
        }, 1000);
      }
    },

    timeFormater(timeStr) {
      // timeStr是毫秒值
      var timeDate = new Date(timeStr);
      return formatDate("yyyy-MM-dd HH:mm:ss", timeDate, this.hour24);
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

