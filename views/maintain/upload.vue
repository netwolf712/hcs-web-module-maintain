<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <upload-file @onUploadFile="onUploadFile" />
      </el-col>

      <el-col :span="1.5">
        <el-button
          v-if="queryParams.dir.indexOf('/') > 0"
          type="success"
          icon="el-icon-replay"
          size="mini"
          @click="backFolder"
          >返回上级目录</el-button
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
      <el-table-column label="名称" align="left" prop="dir">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.dir"
            size="mini"
            type="text"
            icon="el-icon-folder"
            @click="nextFolder(scope.row)"
            >{{ scope.row.name }}</el-button
          >
          <el-button
            v-if="!scope.row.dir"
            size="mini"
            type="text"
            icon="el-icon-file-text"
            >{{ scope.row.name }}</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="保存目录" align="left" prop="filePath" />
      <el-table-column label="文件大小（b）" align="center" prop="length">
        <template slot-scope="scope" v-if="!scope.row.dir">
          {{ scope.row.length }}
        </template>
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
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { list } from "@maintainModule/api/maintain/file";
import downloadHelper from "@maintainModule/api/maintain/downloadHelper";
import uploadFile from "@maintainModule/components/uploadFile";
export default {
  name: "fileManager",
  components: {
    uploadFile,
  },
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
        dir: "upload",
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
    fileTypeFormat(row, column) {
      if (row.dir) {
        return "目录";
      } else {
        return "文件";
      }
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.operId);
      this.multiple = !selection.length;
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true;
      this.form = row;
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "monitor/operlog/export",
        {
          ...this.queryParams,
        },
        `operlog_${new Date().getTime()}.xlsx`
      );
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          config(this.form).then((response) => {
            if (response.code === 200) {
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.getList();
    },

    downloadLog(row) {
      var downloadName = row.name + ".zip";
      var fileList = [];
      fileList.push(row.filePath);
      this.$modal.loading("数据下载中...");
      downloadHelper.startDownload(
        fileList,
        "other",
        "any",
        downloadName,
        this.downloadFinished,
        true
      );
    },
    downloadFinished() {
      this.$modal.closeLoading();
    },

    //访问下一级目录
    nextFolder(row) {
      this.queryParams.dir += "/" + row.name;
      this.getList();
    },
    //访问下一级目录
    backFolder() {
      if (this.queryParams.dir.indexOf("/") <= 0) {
        return;
      }
      this.queryParams.dir = this.queryParams.dir.substring(
        0,
        this.queryParams.dir.indexOf("/")
      );
      this.getList();
    },
    //上传成功回调
    onUploadFile(res) {
      this.getList();
    },
  },
};
</script>

