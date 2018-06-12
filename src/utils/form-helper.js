/**
 * Created by Deboy on 2017/4/1.
 */
const form = {
  /**
   * 获取无限层次的值 eg: a = {b: {c: {e: 123}}} getDeepValue(a, 'a.b.c.e') = 123 不要直接用这个 用 getRowValue
   * @param rowData
   * @param field
   * @returns {*}
   */
  getDeepValue: (rowData, field) => {
    if (field.indexOf('.') >= 0) {
      let fields = field.split('.')
      let val = rowData
      fields.forEach((singleField) => {
        if (val === '' || val === undefined) return ''
        if (val && val[singleField] !== undefined && val[singleField] !== '') {
          val = val[singleField]
        } else {
          val = null
        }
      })
      return val
    } else {
      return rowData[field]
    }
  },
  /**
   * 获取table/form中某个字段的值
   * @param rowData
   * @param fieldInfo
   * @returns {*}
   */
  getRowValue: (rowData, fieldInfo) => {
    let field = fieldInfo.displayField
    if (!field) {
      return
    }
    if (field.indexOf('.') < 0 && field.indexOf('&') < 0 && field.options === null) {
      return rowData[field]
    } else if (fieldInfo.options) {
      if (fieldInfo.vue && fieldInfo.vue.validType === 'array') {
        let valArray = []
        if (rowData[field]) {
          let data = rowData[field]
          if (typeof rowData[field] === 'number') {
            data = rowData[field].toString()
          }
          valArray = data.split(',') || []
        }
        let arr = []
        Object.keys(fieldInfo.options).forEach((key) => {
          if (valArray.indexOf(key) >= 0) {
            arr.push(fieldInfo.options[key])
          }
        })
        return arr.join(', ')
      } else {
        return fieldInfo.options[rowData[field]]
      }
    } else {
      if (field.indexOf('&') >= 0) {
        let fields = field.split('&')
        let returnStr = ''
        fields.forEach((singleField) => {
          returnStr += form.getDeepValue(rowData, singleField)
        })
        return returnStr
      } else {
        if (rowData) {
          return form.getDeepValue(rowData, field)
        } else {
          return null
        }
      }
    }
  },
  /**
   * 拆分用指定符号(默认逗号)分割的字符串为数组
   * @param rowData
   * @param fieldInfo
   * @param separator
   * @returns {*}
   */
  strToArr: (rowData, fieldInfo, separator = ',') => {
    let value = form.getRowValue(rowData, fieldInfo)
    if (value) {
      return value.split(separator)
    } else {
      return []
    }
  },
  /**
   * 根据model生成表单校验规则
   * @param model
   * @returns {{}}
   */
  generateValidateRule (model) {
    let rule = {}
    model.forEach((field) => {
      if (field.required) {
        rule[field.field] = []
        rule[field.field].push({
          required: true,
          message: field.title + '不能为空',
          trigger: (field.xtype === 'select' ? 'change' : 'blur'),
          type: (field.vue && field.vue.validType) || 'string'
        })
        // 如果字段本身有校验规则 那就加上
        if (field.validateRule) {
          rule[field.field].push(field.validateRule)
        }
      }
    })
    return rule
  }
}

export const getRowValue = form.getRowValue
export const generateValidateRule = form.generateValidateRule
