<template>
  <div>
    <template v-if="disabled">
      <div v-html="content"></div>
    </template>
    <template v-else>
      <div :id="id" class="editor"></div>
    </template>
  </div>
</template>
<style lang="less" scoped>
  .editor{
    width: 100%;
  }
</style>
<script type="text/ecmascript-6">
  import UUID from 'uuid'

  const WangEditor = require('wangeditor')

  export default {
    props: ['value', 'height', 'disabled'],
    canReUse: false,
    data () {
      return {
        id: '',
        editor: null,
        content: this.value,
        hadInit: false
      }
    },
    watch: {
      value (val) {
        this.content = val
      },
      content (val) {
        this.$emit('input', val)
        this.$nextTick(() => {
          this.initHtmlContent()
        })
      }
    },
    methods: {
      initHtmlContent () {
        if (!this.hadInit && this.editor) {
          this.editor.txt.html(this.value)
          this.hadInit = true
        }
      },
      initEditor () {
        this.id = UUID.v4()
        console.log(this.id)
        this.$nextTick(() => {
          let createEvent = setInterval(() => {
            let container = document.getElementById(this.id)
            if (container) {
              let editor = new WangEditor(container)
              editor.customConfig.onchange = (html) => {
                // onchange 事件中更新数据
                this.content = html
              }
              editor.customConfig.uploadImgHeaders = {
                token: this.$store.getters.authToken
              }
              editor.customConfig.uploadImgServer = (process.env.NODE_ENV !== 'production' ? '/api' : '') + '/admin/file/upload'
              editor.customConfig.uploadFileName = 'file'
              editor.customConfig.uploadImgTimeout = 5000
              editor.customConfig.zIndex = 100
              editor.customConfig.uploadImgHooks = {
                customInsert: (insertImg, resultText, xhr) => {
                  const result = JSON.parse(resultText)
                  insertImg(result.data[0])
                },
                timeout: (xhr) => {
                  // xhr 是 xmlHttpRequest 对象，IE8、9中不支持
                  this.$Notice.error({
                    title: '上传超时',
                    desc: '网络出错，如果多次出现，请联系管理员',
                    duration: 5
                  })
                },
                error: (xhr) => {
                  // xhr 是 xmlHttpRequest 对象，IE8、9中不支持
                  this.$Notice.error({
                    title: '上传失败',
                    desc: '网络繁忙，如果多次出现，请联系管理员',
                    duration: 5
                  })
                }
              }
              editor.create()
              this.editor = editor
              clearInterval(createEvent)
              this.$nextTick(() => {
                this.initHtmlContent()
              })
            }
          }, 500)
        })
      }
    },
    mounted () {
      this.initEditor()
    }
  }
</script>
