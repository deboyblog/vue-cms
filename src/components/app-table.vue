<template>
  <div>
    <!--操作-->
    <Row style="padding: 20px 0;height: 60px;margin-top: 0" v-if="extraOperations.length > 0 || enableSearch">
      <i-col span="10">
        <template v-for="(operation, index) in extraOperations">
          <i-button :key="index" @click="operation.action" :type="operation.type"
                    style="margin-right: 10px;">
            {{operation.label}}
          </i-button>
        </template>
        <div style="color: white">.</div>
      </i-col>
      <i-col span="14" style="text-align: right">
        <i-input v-if="enableSearch" @keyup.enter.native="loadData" v-model="query"
                 :placeholder="searchLabel"
                 icon="ios-search"
                 style="max-width: 400px"></i-input>
      </i-col>
    </Row>
    <section v-if="filters.length > 0" class="filters-wrapper">
      <div class="filters">
        <template v-for="(filter, index) in filters">
          <div :key="index" :offset="index > 0 ? 1 : 0" class="filter-item">
            <div class="label">{{filter.label}}</div>
            <div class="options">
              <template v-if="filter.type === 'select'">
                <Select style="max-width: 230px" v-model="currentFilterParams[filter.bindKey]">
                  <template v-for="(option, index) in filter.options">
                    <Option :key="index" :value="option.value">{{option.label}}</Option>
                  </template>
                </Select>
              </template>
              <template v-if="filter.type === 'dateRange'">
                <!--时间范围选择-->
                <Date-picker type="datetimerange" placement="bottom-start"
                             :value="[currentFilterParams[filter.bindKey[0]], currentFilterParams[filter.bindKey[1]]]"
                             @on-change="(val) => {
                              if (typeof filter.onChange === 'function') {
                                filter.onChange(val)
                              } else {
                                currentFilterParams[filter.bindKey[0]] = val[0]
                                currentFilterParams[filter.bindKey[1]] = val[1]
                              }
                             }" placeholder="选择日期"
                             style="width: 250px"></Date-picker>
              </template>
              <template v-if="filter.type === 'priceRange'">
                <div style="display: flex;flex-direction: row">
                  <i-input v-model="currentFilterParams[filter.bindKey[0]]" style="width: 100px"></i-input>
                  <span style="align-self: center;margin: 0 10px">到</span>
                  <i-input v-model="currentFilterParams[filter.bindKey[1]]" style="width: 100px"></i-input>
                </div>
              </template>
              <template v-if="filter.type === 'areaPicker'">
                <area-selector
                  :province.sync="currentFilterParams[filter.bingKey[0]]"
                  :city.sync="currentFilterParams[filter.bingKey[1]]"
                  :district.sync="currentFilterParams[filter.bingKey[2]]"
                  :street.sync="currentFilterParams[filter.bingKey[3]]"
                ></area-selector>
              </template>
            </div>
          </div>
        </template>
      </div>
      <Row class="actions">
        <i-button type="primary" @click="onQuery">确定</i-button>
        <i-button type="error" @click="initFilters">重置</i-button>
      </Row>
    </section>

    <section class="table">
      <!--数据表格-->
      <i-table border :width="tableWidth" @on-selection-change="onSelectionChange" stripe :columns="iColumn"
               :data="data"></i-table>
    </section>

    <div class="table-page">
      <div class="multiple-operations">
        <template v-if="multipleOperations && multipleOperations.length > 0">
          <Select class="select" placeholder="请选择操作选项" v-model="multipleOperationIndex">
            <Option :key="index" v-for="(operation, index) in multipleOperations" :value="index">
              {{operation.label}}
            </Option>
          </Select>
          <Button @click="confirmMultiOperation" type="primary">确定</Button>
        </template>
      </div>
      <div>
        <Page style="float: right" :current="tableParams.page" :page-size="tableParams.pageSize"
              :total="tableParams.total"
              @on-change="onChangePage" @on-page-size-change="onPageSizeChange" show-sizer show-elevator></Page>

      </div>
    </div>
  </div>
</template>
<style lang="less">
  .table {
    margin-top: 20px;
  }

  .table-page {
    display: flex;
    height: 40px;
    padding: 5px;
    width: 100%;
    flex-direction: row;
    margin-top: 20px;
    .multiple-operations {
      align-self: center;
      flex: 1;
      .select {
        width: 150px;
      }
    }
  }

  .filters-wrapper {
    border: 1px solid #ccc;
    padding: 20px;
    margin-top: 5px;
    border-radius: 5px;
    .filters {
      margin-bottom: 10px;
      flex-wrap: wrap;
      display: flex;
      flex-direction: row;
      .filter-item {
        display: flex;
        flex: 1;
        margin-bottom: 10px;
        flex-direction: row;
        margin-left: 10px;
        .label {
          flex: 0 0 60px;
          text-align: right;
          margin-right: 10px;
          display: flex;
          align-self: center;
        }
        .options {
          display: flex;
          flex: 1;
        }
      }
    }
    .actions {
      text-align: center;
    }
  }

</style>

<script>
  export default {
    props: {
      autoInit: {
        type: Boolean,
        default () {
          return false
        }
      },
      enableSearch: {
        type: Boolean,
        default () {
          return true
        }
      },
      onRowClick: {
        type: Function,
        default () {
          return (row) => {
          }
        }
      },
      columns: {
        type: Array,
        default () {
          return []
        }
      },
      extraOperations: {
        type: Array,
        default () {
          return []
        }
      },
      multipleOperations: {
        type: Array,
        default () {
          return []
        }
      },
      rowOperations: {
        type: Array,
        default () {
          return []
        }
      },
      extraParams: {
        type: [Array],
        default () {
          return []
        }
      },
      filters: {
        type: [Array],
        default () {
          return []
        }
      },
      filtersParams: {
        type: Object,
        default () {
          return {}
        }
      },
      apiUrl: {
        type: String
      }
    },
    data () {
      return {
        multipleOperationIndex: '',
        tableParams: {
          pageSize: 10,
          page: 1,
          total: 0
        },
        emptyVar: null,
        hadInitFilter: false,
        data: [],
        selection: [],
        query: null,
        tableWidth: '',
        showFieldsDisplaySetting: false,
        displayColumns: [],
        displayFields: [],
        // 真正显示的数据列
        iColumn: [],
        currentFilterParams: this.filtersParams
      }
    },
    computed: {
      searchLabel () {
        let placeholder = '输入 '
        this.columns.forEach(row => {
          if (row.searchable) {
            placeholder += `${row.title}、`
          }
        })
        if (placeholder) {
          return '输入 关键词 回车搜索'
        } else {
          return placeholder.substring(0, placeholder.length - 1) + ' 回车搜索'
        }
      }
    },
    watch: {
      displayFields: 'renderDisplayColumns',
      columns: 'initDisplayFields',
      displayColumns: 'initIColumns',
      sortParams: 'loadData',
      currentFilterParams: {
        deep: true,
        handler (val) {
          if (this.hadInitFilter) {
            this.$nextTick(() => {
              this.$emit('update:filtersParams', val)
            })
          }
        }
      },
      filtersParams (val) {
        this.currentFilterParams = val
      }
    },
    methods: {
      confirmMultiOperation () {
        if (!this.selection || this.selection.length === 0) {
          this.$Message.info('请先选择要批量操作的对象')
          return
        }
        if (this.multipleOperationIndex === '') {
          return
        }
        if (!isNaN(this.multipleOperationIndex) && this.multipleOperationIndex >= 0) {
          this.$Modal.confirm({
            title: '操作确认',
            content: '该批量操作不可恢复,  确认执行吗？',
            onCancel: () => {
            },
            onOk: () => {
              let action = this.multipleOperations[this.multipleOperationIndex].action
              if (typeof action === 'function') {
                action(this.selection)
              } else {
                this.$Message.info('批量操作方法未定义, 请联系开发')
              }
            }
          })
        }
      },
      initIColumns () {
        let iColumn = this.multipleOperations && this.multipleOperations.length > 0 ? [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          }
        ] : []
        // 如果表格的批量操作方法不为空 才有前面的多选框
        this.displayColumns.forEach((col, index) => {
          // 将field字段转换为key
          let val = col
          val.key = val.field
          val.sortable = val.sort ? 'custom' : false
          let rowRenders = {
            // 自定义渲染
            custom: (h, params) => {
              return val.customRender(h, params)
            },
            // 链接
            link: (h, {row, column}) => {
              if (row[column['field']]) {
                return h('router-link', {
                  style: {
                    width: '100%'
                  },
                  props: {
                    to: {name: 'editForm', query: {table: column['linkTable'] || '', id: row[column['field']]}}
                  }
                }, row[column['field']])
              } else {
                return h('span', '')
              }
            },
            // 图片
            img: (h, {row, column}) => {
              if (row[column['field']]) {
                return h('img', {
                  style: {
                    height: '60px',
                    padding: 0,
                    width: '100%',
                    alignSelf: 'center'
                  },
                  attrs: {
                    src: row[column['field']] || 'error'
                  },
                  on: {
                    click: () => {
                      this.showImg(row[column['field']])
                    }
                  }
                })
              } else {
                return h('span', '')
              }
            },
            select: (h, {row, column}) => {
              return h('span', column.options[row[column.displayField]])
            },
            // 默认 取 displayField 字段对应的值
            default: (h, {row, column}) => {
              return h('span', this.$form.getRowValue(row, column))
            },
            // 默认 取 displayField 字段对应的值
            text: (h, {row, column}) => {
              return h('span', this.$form.getRowValue(row, column))
            }
          }
          val.render = rowRenders[val.type]
          iColumn.push(val)
        })
        // 添加行操作
        let operations = this.rowOperations
        if (operations && operations.length > 0) {
          // 渲染行操作
          iColumn.push({
            title: '操作',
            key: 'action',
            render: (h, params) => {
              const rowIndex = params.index
              let actions = []
              operations.forEach((val, index) => {
                actions.push(h('Button', {
                  props: {
                    type: val.type || 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '10px',
                    padding: '5px'
                  },
                  on: {
                    click: (e) => {
                      this.runAction(index, rowIndex, e)
                    }
                  }
                }, val.name))
              })
              return h('div', actions)
            }
          })
        }
        this.iColumn = iColumn
      },
      closeDisplaySetting () {
        this.showFieldsDisplaySetting = false
      },
      initDisplayFields () {
        let fields = []
        this.columns.forEach(field => {
          fields.push(field.field)
        })
        this.displayFields = fields
      },
      renderDisplayColumns () {
        let displayFields = JSON.parse(JSON.stringify(this.displayFields))
        let displayColumns = []
        this.columns.forEach(field => {
          if (displayFields.indexOf(field.field) >= 0) {
            displayColumns.push(field)
          }
        })
        this.displayColumns = displayColumns
        this.initIColumns()
      },
      getTableWidth () {
        this.tableWidth = this.$el.clientWidth
      },
      // 获取请求参数
      getRequestParams () {
        let customParams = {}
        if (this.customParams) {
          this.customParams.forEach(param => {
            if (typeof param === 'function') {
              // 将表格实例传递给他
              let newParam = param(this)
              customParams[newParam.key] = newParam.value
            } else {
              customParams[param.key] = param.value
            }
          })
        }
        let params = Object.assign({}, {
          page: this.tableParams.page - 1,
          size: this.tableParams.pageSize,
          query: this.query
        }, customParams, this.currentFilterParams)
        this.filters.forEach(filter => {
          // 可以通过without选项将参数排除在外
          if (filter.without) {
            delete params[filter.bindKey]
          }
        })
        let lastParams = {}
        Object.keys(params).forEach((k) => {
          if (params[k] !== '' && params[k] !== undefined) {
            lastParams[k] = params[k]
          }
        })
        return lastParams
      },
      onSelectionChange (selection) {
        this.selection = selection
      },
      onQuery () {
        this.loadData()
        this.$emit('on-query')
      },
      // 获取参数 然后请求接口
      loadData (init = false) {
        if (!this.apiUrl) {
          this.$Message.error('API地址没有填写')
        } else {
          if (init) {
            this.tableParams.page = 1
          }
          this.data = []
          console.log('###', this.getRequestParams())
          this.$http.get(this.apiUrl, {params: this.getRequestParams()}).then(res => {
            this.data = res.data.content
            this.tableParams.total = res.data.totalElements
          })
        }
      },
      runAction (index, rowIndex, e) {
        // 执行行操作
        this.rowOperations[index]['action'](this.data[rowIndex], e)
      },
      onChangePage (page) {
        // 改变页码
        this.tableParams.page = page
        this.loadData()
      },
      onPageSizeChange (pageSize) {
        if (this.tableParams.pageSize !== pageSize) {
          // 改变每页显示数量
          this.tableParams.pageSize = pageSize
          this.loadData()
        }
      },
      // 调用vuex的图片预览 在app组件中声明了 直接调用即可
      showImg (img) {
        this.$store.dispatch('openPreview', img)
      },
      initFilters (forceReset = false) {
        this.hadInitFilter = false
        this.filters.forEach((filterItem) => {
          if (!filterItem.bindKey) {
            console.warring('自定义筛选条件中，bindKey 参数必须有')
            return
          }
          if (typeof filterItem.bindKey === 'string') {
            if (forceReset) {
              this.$set(this.currentFilterParams, filterItem.bindKey, filterItem.default || '')
            } else if (this.filtersParams[filterItem.bindKey]) {
              this.$set(this.currentFilterParams, filterItem.bindKey, this.filtersParams[filterItem.bindKey])
            } else if (filterItem.default) {
              this.$set(this.currentFilterParams, filterItem.bindKey, filterItem.default)
            } else {
              this.$set(this.currentFilterParams, filterItem.bindKey, '')
            }
          } else {
            filterItem.bindKey.forEach(key => {
              this.$set(this.currentFilterParams, key, '')
            })
          }
        })
        let filtersTypes = this.filters.map(f => f.type)
        if (filtersTypes.indexOf('areaPicker') >= 0) {
          this.loadArea()
        }
        this.hadInitFilter = true
        this.$nextTick(() => {
          this.$emit('on-query')
          this.loadData()
        })
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.getTableWidth()
        this.initDisplayFields()
        this.initFilters()
      })
    }
  }
</script>
