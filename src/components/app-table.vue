<template>
  <div>
    <!--操作-->
    <Row style="padding: 20px 0;height: 60px;margin-top: 0" v-if="(showInsert && permissions.INSERT) || showSearch">
      <i-col span="10">
        <i-button v-if="showInsert && permissions.INSERT" @click="insertAction" type="primary"
                  style="margin-right: 10px;"
                  key="insert">
          新增
        </i-button>
        <template v-for="(operation, index) in leftOperations">
          <i-button :key="index" @click="operation.action" :type="operation.type"
                    style="margin-right: 10px;">
            {{operation.name}}
          </i-button>
        </template>
        <div style="color: white">.</div>
      </i-col>
      <i-col span="14" style="text-align: right">
        <i-input v-if="showSearch" @keyup.enter.native="loadData" v-model="query"
                 :placeholder="searchFields"
                 icon="ios-search"
                 style="width: 400px"></i-input>
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
              <template v-if="filter.type === 'daterange'">
                <!--时间范围选择-->
                <!--<DatePicker type="datetimerange" format="yyyy-MM-dd HH:mm:ss" v-model="filter.value"-->
                <!--placeholder="Select date and time" style="width: 300px"></DatePicker>-->
                <Date-picker type="datetimerange" placement="bottom-start"
                             :value="[currentFilterParams[filter.bindKey[0]], currentFilterParams[filter.bindKey[1]]]"
                             @on-change="filter.onChange" placeholder="选择日期"
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
                <div style="display: flex;flex-direction: row">
                  <Select v-model="filterParams[filter.bindKey[0]]" @on-change="() => {
                    filterParams[filter.bindKey[1]] = ''
                    loadArea(2, filterParams[filter.bindKey[0]])
                  }">
                    <Option :key="index" v-for="(area, index) in provinces" :value="area.id">{{area.name}}</Option>
                  </Select>
                  <Select style="margin-left: 10px" @on-change="() => {
                    filterParams[filter.bindKey[2]] = ''
                    loadArea(3, filterParams[filter.bindKey[1]])
                  }" v-if="filter.bindKey.length >= 2" v-model="filterParams[filter.bindKey[1]]">
                    <Option :key="index" v-for="(area, index) in cities" :value="area.id">{{area.name}}</Option>
                  </Select>
                  <Select style="margin-left: 10px" @on-change="() => {
                    loadArea(3, filterParams[filter.bindKey[1]])
                  }" v-if="filter.bindKey.length === 3" v-model="filterParams[filter.bindKey[2]]">
                    <Option :key="index" v-for="(area, index) in districts" :value="area.id">{{area.name}}</Option>
                  </Select>
                </div>
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
      noInit: {
        type: Boolean,
        default () {
          return false
        }
      },
      showSearch: {
        type: Boolean,
        default () {
          return true
        }
      },
      permissions: {
        type: Object,
        default () {
          return {
            INSERT: true,
            FILTER: true,
            SEARCH: true
          }
        }
      },
      showInsert: {
        type: Boolean,
        default () {
          return true
        }
      },
      insertAction: {
        type: Function,
        default () {
          return () => {
          }
        }
      },
      onRowClick: {
        type: Function,
        default () {
          return (row) => {
          }
        }
      },
      column: {
        type: Array
      },
      leftOperations: {
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
      operations: {
        type: Array,
        default () {
          return []
        }
      },
      customParams: {
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
      api: {
        type: String
      },
      filterParams: {
        type: Object,
        default () {
          return {}
        }
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
        provinces: [],
        cities: [],
        districts: [],
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
        currentFilterParams: this.filterParams
      }
    },
    computed: {
      searchFields () {
        let placeholder = '输入 '
        this.column.forEach(row => {
          if (row.searchable) {
            placeholder += `${row.title}、`
          }
        })
        return placeholder.substring(0, placeholder.length - 1) + ' 回车即可搜索'
      }
    },
    watch: {
      displayFields: 'renderDisplayColumns',
      column: 'initDisplayFields',
      displayColumns: 'initIColumns',
      sortParams: 'loadData',
      currentFilterParams: {
        deep: true,
        handler (val) {
          if (this.hadInitFilter) {
            this.$nextTick(() => {
              this.$emit('update:', val)
            })
          }
        }
      },
      filterParams (val) {
        this.currentFilterParams = val
        if (val && val.length > 0 && this.filterParams.map(f => f.type).indexOf('areaPicker') >= 0) {
          this.loadArea()
        }
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
            link: (h, params) => {
              const row = params.row
              const column = params.column
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
            img: (h, params) => {
              const row = params.row
              const column = params.column
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
            select: (h, params) => {
              return h('span', params.column.options[params.row[params.column.displayField]])
            },
            // 默认 取 displayField 字段对应的值
            default: (h, params) => {
              const row = params.row
              const column = params.column
              return h('span', this.$form.getRowValue(row, column))
            },
            // 默认 取 displayField 字段对应的值
            text: (h, params) => {
              const row = params.row
              const column = params.column
              return h('span', this.$form.getRowValue(row, column))
            }
          }
          val.render = rowRenders[val.type]
          iColumn.push(val)
        })
        // 添加行操作
        let operations = this.operations
        if (operations.length > 0) {
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
        this.column.forEach(field => {
          fields.push(field.field)
        })
        this.displayFields = fields
      },
      renderDisplayColumns () {
        let displayFields = JSON.parse(JSON.stringify(this.displayFields))
        let displayColumns = []
        this.column.forEach(field => {
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
          if (filter.isParams === false) {
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
        if (!this.api) {
          this.$Message.error('API地址没有填写')
        } else {
          if (init) {
            this.tableParams.page = 1
          }
          this.data = []
          console.log('###', this.getRequestParams())
          this.$http.get(this.api, {params: this.getRequestParams()}).then(res => {
            this.data = res.data.content
            this.tableParams.total = res.data.totalElements
          })
        }
      },
      runAction (index, rowIndex, e) {
        // 执行行操作
        this.operations[index]['action'](this.data[rowIndex], e)
      },
      /**
       * 加载下的区域
       * @param level
       * @param parentId
       */
      loadArea (level = 1, parentId = null) {
        let lists = ['provinces', 'cities', 'districts']
        this.$http.get('area/findAll', {
          params: {
            level: level,
            parentId: parentId
          }
        }).then(rst => {
          let key = lists[level - 1]
          this[key] = rst.data
          // this.$set(this, key, rst.data)
        })
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
          if (typeof filterItem.bindKey === 'string') {
            if (forceReset) {
              this.$set(this.currentFilterParams, filterItem.bindKey, filterItem.default || '')
            } else if (this.filterParams[filterItem.bindKey]) {
              this.$set(this.currentFilterParams, filterItem.bindKey, this.filterParams[filterItem.bindKey])
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
