<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      size="mini"
      @click="handleAdd"
      >{{ buttonName }}</el-button
    >

    <el-dialog
      title="上传文件"
      :visible.sync="open"
      width="700px"
      append-to-body
    >
      <div style="margin-bottom: 10px">
        <span>文件名：</span>
        <el-input v-model="fileName" placeholder="文件名" />
      </div>
      <el-upload
        class="upload-demo"
        ref="upload"
        :action="uploadUrl"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="onUploadSuccess"
        :on-change="onChangeFile"
        :file-list="fileList"
        :auto-upload="false"
        :headers="headers"
        :accept="fileAccept"
        :limit="1"
      >
        <el-button slot="trigger" size="small" type="primary"
          >选取文件</el-button
        >
        <el-button
          style="margin-left: 10px"
          size="small"
          type="success"
          @click="submitUpload"
          >上传到服务器</el-button
        >
        <el-button
          style="margin-left: 10px"
          size="small"
          type="danger"
          @click="cancel"
          >取消</el-button
        >
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
export default {
  name: "uploadFile",
  props: {
    fileAccept: {
      type: String,
      default: "*.*",
    },
    buttonName: {
      type: String,
      default: "上传",
    },
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      open: false,
      //原始文件列表
      fileList: [],
      //已上传的文件列表
      uploadedFileList: [],
      uploadUrl: process.env.VUE_APP_BASE_API + "/file/upload",
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      //文件名
      fileName: "",
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
  created() {},
  methods: {
    // 取消按钮
    cancel() {
      this.open = false;
    },
    handleAdd() {
      this.uploadedFileList = [];
      this.open = true;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    //上传成功回调
    onUploadSuccess(res) {
      if (res.code === 200) {
        res.data.fileName = this.fileName;
        this.uploadedFileList.push(res.data.filePath);
        this.$emit("onUploadFile", this.uploadedFileList);
        this.$emit("onUploadFileDetail", res);
        this.open = false;
      }
    },
    /**
     * 修改文件列表
     */
    onChangeFile(file, fileList) {
      //如果文件名为空，则默认将原始文件名作为当前文件名
      if (!this.fileName) {
        this.fileName = file.name;
      }
    },
  },
};
</script>

