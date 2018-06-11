<template>
  <div class="container">
    <section class="section">
      <app-table :columns="getColumns()"
                 :row-operations="getRowOperations()"
                 :multiple-operations="getMultipleOperations()"
                 :filters="getFilters()"
                 :extra-operations="getExtraOperations()"
                 :filters-params.sync="filtersParams"
                 :api-url="`${tableName}/page`"
      ></app-table>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        tableName: 'user',
        filtersParams: {},
        filters: {
          startDtm: '',
          endDtm: ''
        }
      }
    },
    methods: {
      getColumns () {
        return []
      },
      getRowOperations () {
        return []
      },
      getMultipleOperations () {
        return []
      },
      getExtraOperations () {
        return []
      },
      getFilters () {
        return [
          {
            label: '时间范围',
            dateRange: 'dateRange',
            bindKey: ['startDtm', 'endDtm']
          }
        ]
      }
    },
    mounted () {
    }
  }
</script>

<style lang="less" scoped>
  .container {
    color: white;
  }
</style>
