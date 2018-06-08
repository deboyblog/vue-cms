<template>
  <div>
    <Modal title="视频预览" v-model="showModal" :styles="{top: '0px'}" :width="800">
      <video style="width: 100%" :src="url" controls="controls"></video>
      <div slot="footer">
        <Button type="success" size="large" long @click="showModal = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<style scoped lang="less" rel="stylesheet/less">
</style>
<script type="text/ecmascript-6">
  export default{
    props: [
      'value',
      'url'
    ],
    data () {
      return {
        showModal: this.value
      }
    },
    watch: {
      showModal (val) {
        if (!val) {
          this.$store.dispatch('closeVideoPreview')
        } else {
          this.$emit('input', val)
        }
      },
      value (val) {
        this.showModal = val
      }
    }
  }
</script>
