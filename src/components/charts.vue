<template>
  <div :id="id" class="chart-container" :style="styles">
    <!--charts container-->
  </div>
</template>

<script type="text/ecmascript-6">
  import UUID from 'uuid'
  import EChart from 'echarts'

  export default {
    data () {
      return {
        id: null,
        charts: null
      }
    },
    props: {
      styles: {
        type: Object,
        default () {
          return {}
        }
      },
      options: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    watch: {
      options: 'initCharts'
    },
    methods: {
      initCharts () {
        if (!this.charts) {
          this.charts = EChart.init(document.getElementById(this.id))
        }
        this.charts.setOption(this.options)
      }
    },
    mounted () {
      this.id = UUID.v4()
      this.$nextTick(this.initCharts)
    }
  }
</script>

<style lang="less" scoped>
  .chart-container {
    min-width: 300px;
    min-height: 300px;
  }
</style>
