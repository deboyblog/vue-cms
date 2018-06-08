/**
 * Created by Deboy on 2016/10/12.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import state from './states'
// modules
import user from './modules/user'
import loading from './modules/loading'
import breadcrumbs from './modules/breadcrumbs'
import gallery from './modules/gallery'
// global actions
import actions from './actions'
// global mutations
import mutations from './mutations'

Vue.use(Vuex)
export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
    user,
    loading,
    breadcrumbs,
    gallery
  }
})
