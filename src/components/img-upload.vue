<template>
  <div>
    <div :key="index" class="upload-list" v-for="(item, index) in instanceUploadList">
      <template v-if="item.status === 'finished'">
        <img :src="item.url">
        <div class="upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <Upload
      v-show="(!instanceUploadList || instanceUploadList.length < max) && !disabled"
      ref="upload"
      :show-upload-list="false"
      :default-file-list="defaultList"
      :on-success="handleSuccess"
      :format="['jpg','jpeg','png']"
      :max-size="2048"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      :multiple="multiple"
      type="drag"
      :headers="headers"
      :action="uploadApi"
      style="display: inline-block;width:100px;">
      <div style="width: 100px;height:100px;line-height: 100px;padding: 20px 0;">
        <Icon type="camera" size="60"></Icon>
      </div>
    </Upload>
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
          return (process.env.NODE_ENV !== 'production' ? 'api' : '') + '/admin/file/upload'
        }
      }
    },
    data () {
      return {
        defaultList: [],
        visible: false
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
        set (val) {
        }
      },
      headers () {
        return {
          token: this.$store.getters.authToken
        }
      }
    },
    methods: {
      updateValue () {
        let list = []
        list = this.instanceUploadList.map((file) => {
          return file.response && file.response.data
        })
        this.$emit('input', list.join())
        this.$emit('on-complete')
      },
      updateDefaultList (val) {
        let list = (val && val.split(',')) || []
        let imgs = []
        list.forEach(item => {
          imgs.push({
            url: item,
            name: UUID.v1()
          })
        })
        this.defaultList = imgs
      },
      handleView (url) {
        this.$store.dispatch('openPreview', url)
      },
      handleRemove (file) {
        if (this.disabled) {
          return
        }
        // 从 upload 实例删除数据
        const fileList = this.$refs.upload.fileList
        fileList.forEach((fileObj, index) => {
          if (fileObj.url === file.url) {
            this.$refs.upload.fileList.splice(index, 1)
            this.$emit('on-delete')
            return false
          }
        })
        this.updateValue()
      },
      handleSuccess (res, file) {
        if (res.code !== 200) {
          switch (res.code) {
            case 444:
              this.$Message.info('请先登录')
              this.$store.commit('LOGOUT')
              break
            default:
              this.$Message.error(res.msg)
              break
          }
          return
        }
        // 因为上传过程为实例，这里模拟添加 url
        if (res.data && res.code === 200) {
          file.url = res.data
          file.name = UUID.v1()
          this.updateValue()
        } else {
          this.$Notice.warning({
            title: '上传失败',
            desc: res.data.data
          })
        }
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
        })
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
        })
      },
      handleBeforeUpload () {
        const check = this.instanceUploadList.length < this.max
        if (!check) {
          this.$Notice.warning({
            title: `最多只能上传 ${this.max} 张图片。`
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
</style>
