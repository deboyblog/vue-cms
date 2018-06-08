<template>
  <div>
    <Modal
      :title="`更改${row && row.title}`"
      v-model="showModal" :width="1024">
      <AppTable :show-insert="false" v-if="apiUrl" ref="table" :column="column" :api="apiUrl" :no-init="true"
                :rowHandle="rowHandle"></AppTable>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<style scoped lang="less" rel="stylesheet/less">
</style>
<script type="text/ecmascript-6">
  export default {
    props: [
      'value',
      'row'
    ],
    data () {
      return {
        showModal: this.value,
        rowHandle: [
          {
            name: '选择',
            action: (row) => {
              this.$emit('change-select', row)
              this.showModal = false
            }
          }
        ]
      }
    },
    watch: {
      value (val) {
        this.showModal = val
      },
      showModal (val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.table.loadData()
          })
        }
        this.$emit('input', val)
      }
    },
    computed: {
      apiUrl () {
        return this.row && this.row.selectUrl
      },
      editField: {
        cache: false,
        get () {
          return this.row && this.row.field
        }
      },
      column: {
        cache: false,
        get () {
          return (this.row && this.row.one) || []
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.$refs.table && this.$refs.table.loadData()
      })
    }
  }
</script>
