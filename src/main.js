// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'

import iView from 'iview'
import 'iview/dist/styles/iview.css'
import BaseMixin from './mixins/base'

import http from './libs/http'
Vue.use(iView)
Vue.use(http)
Vue.mixin(BaseMixin)
// 通用组件
require('./components')
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: {App},
  template: '<App/>'
})
