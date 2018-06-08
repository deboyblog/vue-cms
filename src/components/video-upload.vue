<template>
  <div>
    <Upload
      ref="upload"
      :on-success="handleSuccess"
      :max-size="20480"
      :default-file-list="defaultList"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :multiple="multiple"
      accept="video/*"
      type="drag"
      :on-preview="handleView"
      :action="uploadApi"
      :format="['mp4','m2ts','mts', 'wmv', 'mkv']"
    >
      <div style="padding: 20px 0">
        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
        <p>点击或将文件拖拽到这里上传</p>
      </div>
      <div slot="tip" style="font-size: 14px;padding: 10px 0">
        视频只能以 MPEG-1、MPEG-2、MPEG4格式上传，大小 20M 以内
        <br>
        <b style="color: red">注意: 大文件上传完成需要等待一段时间处理 等文件名显示成一串数字+字母的组合才是真正的上传完成</b>
      </div>
    </Upload>
    <Modal v-model="videoPreview.show" style="position: fixed;top: 20px" :width="800">
      <video :src="videoPreview.url" style="width: 100%;height: 100%"></video>
      <div slot="footer">
        <Button type="success" size="large" long @click="videoPreview.show = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script type="text/ecmascript-6">
  import UUID from 'uuid'

  export default {
    props: {
      value: {
        type: String
      },
      multiple: {
        type: Boolean,
        default () {
          return false
        }
      },
      max: {
        type: Number,
        default () {
          return 1
        }
      },
      disabled: {
        type: Boolean,
        default () {
          return false
        }
      },
      uploadApi: {
        type: String,
        default () {
          return (process.env.NODE_ENV !== 'production' ? '/api' : '') + '/admin/file/upload'
        }
      }
    },
    data () {
      return {
        defaultList: [],
        visible: false,
        videoPreview: {
          show: false,
          url: ''
        }
      }
    },
    watch: {
      value (val) {
        this.updateDefaultList(val)
      }
    },
    computed: {
      instanceUploadList: {
        cache: false,
        get () {
          return this.$refs.upload && this.$refs.upload.fileList
        },
        set () {
        }
      }
    },
    methods: {
      updateValue () {
        let list = []
        this.instanceUploadList.forEach((file) => {
          list.push(file.response && file.response.data)
        })
        this.$emit('input', list.join())
      },
      updateDefaultList (val) {
        let list = val && val.split(',') || []
        let videos = []
        list.forEach(item => {
          videos.push({
            url: item,
            name: UUID.v1()
          })
        })
        this.defaultList = videos
      },
      handleView (file) {
//        if (typeof file.url !== 'string') {
//          this.$store.dispatch('openVideoPreview', file.url.join(''))
//        } else {
//          this.$store.dispatch('openVideoPreview', file.url)
//        }
      },
      handleRemove (file) {
        // 从 upload 实例删除数据
        const fileList = this.$refs.upload.fileList
        fileList.forEach((fileObj, index) => {
          if (fileObj.url === file.url) {
            this.$refs.upload.fileList.splice(index, 1)
            return false
          }
        })
        this.updateValue()
      },
      handleSuccess (res, file) {
        // 因为上传过程为实例，这里模拟添加 url
        if (res.data && res.code === 200) {
          console.log(file)
          file.url = res.data
          file.name = UUID.v1()
          this.updateValue()
        } else {
          this.$Notice.warning({
            title: '上传失败',
            desc: res.data.msg
          })
        }
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确'
        })
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 20 M。'
        })
      },
      handleBeforeUpload () {
        const check = this.instanceUploadList && this.instanceUploadList.length < this.max
        if (!check) {
          this.$Notice.warning({
            title: `最多只能上传 ${this.max} 个视频。`
          })
        }
        this.instanceUploadList = this.$refs.upload.fileList
        return check
      }
    },
    mounted () {
      this.$nextTick(() => {
        if (this.value) {
          this.updateDefaultList(this.value)
        }
      })
    }
  }
</script>
<style>
  .upload-list {
    display: inline-block;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .upload-list img {
    width: 100%;
    height: 100%;
  }

  .upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .upload-list:hover .upload-list-cover {
    display: block;
  }

  .upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

  .video-player {
    width: 100%;
    height: 100%;
    position: fixed;
  }
</style>
