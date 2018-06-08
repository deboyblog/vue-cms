/**
 * Created by Deboy on 2017/4/1.
 * 记录面包屑导航
 * 逻辑：当跳转路由不是编辑表单[app-form]的时候 就当成目前第一级路由 当从app-table跳转到app-from的时候 就会记录下来跳转的信息
 */
import * as types from '../mutations-type'

const state = {
  list: []
}
const getters = {
  breadcrumbs (state) {
    return state.list
  }
}
const mutations = {
  /**
   * 更新路由记录
   * @param state
   * @param payload
   */
  [types.UPDATE_BREADCRUMBS_LIST] (state, payload) {
    if (payload.toAppForm) {
      state.list[1] = payload.route
    } else {
      state.list[0] = payload.route
    }
  }
}
export default {
  state,
  mutations,
  getters
}
