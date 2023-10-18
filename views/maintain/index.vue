<template>
  <div class="app-container">
    <el-table
      ref="tables"
      v-loading="loading"
      :data="list"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="名称模块" align="center" prop="logType" />
      <el-table-column label="保存目录" align="center" prop="logDir" />
      <el-table-column
        label="最长保存时间（ms）"
        align="center"
        prop="maxKeepTime"
      />
      <el-table-column
        label="最大文件数量"
        align="center"
        prop="maxFileCount"
      />
      <el-table-column
        label="最大单个文件大小（kb）"
        align="center"
        prop="maxFileCount"
      />
      <el-table-column
        label="是否开启"
        align="center"
        prop="open"
        :formatter="openTypeFormat"
      />
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
            >详细</el-button
          >
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

    <!-- 日志详细 -->
    <el-dialog
      title="日志配置"
      :visible.sync="open"
      width="700px"
      append-to-body
    >
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="模块名称：">{{ form.logType }} </el-form-item>
            <el-form-item label="日志目录：">
              <el-input v-model="form.logDir" placeholder="日志目录：" />
            </el-form-item>
            <el-form-item label="最长保存时间（ms）：">
              <el-input
                v-model="form.maxKeepTime"
                placeholder="最长保存时间（ms）："
              />
            </el-form-item>
            <el-form-item label="最大文件数量：">
              <el-input
                v-model="form.maxFileCount"
                placeholder="最大文件数量："
              />
            </el-form-item>
            <el-form-item label="最大单个文件大小（kb）：">
              <el-input
                v-model="form.maxFileSize"
                placeholder="最大单个文件大小（kb）："
              />
            </el-form-item>
            <el-form-item label="状态：">
              <el-radio-group v-model="form.open">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
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
import { list, config } from "@maintainModule/api/maintain/logManager";
import downloadHelper from "@maintainModule/api/maintain/downloadHelper";
export default {
  name: "configLog",
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
        title: undefined,
        operName: undefined,
        businessType: undefined,
        status: undefined,
      },
      sys_oper_type: [
        {
          value: 0,
          label: "app",
        },
        {
          value: 1,
          label: "web",
        },
      ],
      sys_common_status: [
        {
          value: 0,
          label: "失败",
        },
        {
          value: 1,
          label: "成功",
        },
      ],
      statusOptions: [
        {
          value: false,
          label: "关闭",
        },
        {
          value: true,
          label: "开启",
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
      list().then((res) => {
        console.log(res);
        if (res.code === 200) {
          this.list = res.data;
        } else {
          this.msgError(res.msg);
        }
      });
      this.loading = false;
    },
    openTypeFormat(row, column) {
      if (row.open) {
        return "开启";
      } else {
        return "关闭";
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
    },
    downloadLog(row) {
      var downloadName = "log.zip";
      this.$modal.loading("数据下载中...");
      downloadHelper.startDownload(
        null,
        "log",
        row.logType,
        downloadName,
        this.downloadFinished,
        true
      );
    },
    downloadFinished() {
      this.$modal.closeLoading();
    },
  },
};
</script>

