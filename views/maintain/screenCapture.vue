<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          @click="handleDeleteFile"
          :disabled="ids.length == 0"
          >删除文件</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain @click="handleCaptureScrren"
          >截屏</el-button
        >
      </el-col>
    </el-row>

    <el-table
      ref="tables"
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="名称" align="left" prop="name"> </el-table-column>
      <el-table-column
        label="生成时间"
        align="left"
        prop="name"
        :formatter="fileTimeFormat"
      />
      <el-table-column
        label="文件大小"
        align="center"
        prop="length"
        :formatter="fileSizeFormat"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="downloadLog(scope.row)"
            >下载</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-eye-open"
            @click="onShowOnline(scope.row)"
            >在线查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="截屏详情"
      :visible.sync="playFile.show"
      width="700px"
      append-to-body
    >
      <el-image :src="playFile.url"></el-image>
    </el-dialog>
  </div>
</template>

<script>
import { list, operateFile } from "@maintainModule/api/maintain/file";
import downloadHelper from "@maintainModule/api/maintain/downloadHelper";
import { captureScreen } from "@maintainModule/api/maintain/deviceBase";
import { fileBytesToSize, dateParse, formatDate } from "@/utils/ruoyi";
/**
 * 文件操作
 * 删除
 */
const FILE_OPERATE_TYPE_DELETE = 3;
export default {
  name: "fileManager",

  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 默认排序
      defaultSort: { prop: "operTime", order: "descending" },
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dir: "screen_capture",
        mainType: "other",
        subType: "any",
        withDir: true,
      },
      statusOptions: [
        {
          value: false,
          label: "文件",
        },
        {
          value: true,
          label: "目录",
        },
      ],
      //下一个将要播放的文件
      nextPlayFile: null,
      // 播放文件
      playFile: {
        // 文件名称
        name: "",
        // 文件播放路径
        url: "",
        // 是否显示
        show: false,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询登录日志 */
    getList() {
      list(
        this.queryParams.dir,
        this.queryParams.mainType,
        this.queryParams.subType,
        this.queryParams.withDir
      ).then((res) => {
        console.log(res);
        if (res.code === 200) {
          this.list = res.data;
        } else {
          this.msgError(res.msg);
        }
      });
      this.loading = false;
    },
    /**
     * 转化文件时间
     */
    fileTimeFormat(row) {
      let timeStr = row.name.replace(".png", "");
      let date = dateParse(timeStr, "yyyyMMdd_HHmmss");
      console.log(date);
      return formatDate("yyyy年MM月dd日 HH:mm:ss", date, true);
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.filePath);
      this.multiple = !selection.length;
    },

    downloadLog(row) {
      var downloadName = row.name;
      var fileList = [];
      fileList.push(row.filePath);
      this.$modal.loading("数据下载中...");
      downloadHelper.startDownload(
        fileList,
        "media",
        "image",
        downloadName,
        this.downloadFinished,
        false
      );
    },
    downloadFinished() {
      this.$modal.closeLoading();
    },

    handleCaptureScrren() {
      captureScreen().then((res) => {
        if (res.code === 200) {
          this.msgSuccess("截屏成功");
          this.getList();
        } else {
          this.msgError("截屏失败");
        }
      });
    },

    fileSizeFormat(row) {
      return fileBytesToSize(parseInt(row.length));
    },
    /**
     * 删除文件
     */
    handleDeleteFile() {
      let requestOpFile = {
        operateType: FILE_OPERATE_TYPE_DELETE,
        srcFileList: this.ids,
      };
      operateFile(requestOpFile).then((res) => {
        if (res.code === 200) {
          this.msgSuccess("操作成功");
          this.getList();
        } else {
          this.msgError("操作失败");
        }
      });
    },
    /**
     * 在线查看
     */
    onShowOnline(row) {
      this.nextPlayFile = row;
      var fileList = [];
      fileList.push(row.filePath);
      downloadHelper.startDownload(
        fileList,
        "media",
        "audio",
        null,
        this.OnShowReady,
        false,
        null,
        true
      );
    },
    /**
     * 下载完成，可以开始展示了
     */
    OnShowReady(url) {
      this.playFile.name = this.nextPlayFile.name;
      this.playFile.url = url;
      this.playFile.show = true;
    },
  },
};
</script>

