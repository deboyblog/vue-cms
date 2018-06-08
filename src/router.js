import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('./views/Dashboard')
    },
    {
      path: '/Login',
      name: 'Login',
      component: () => import('./views/Login')
    }
  ]
})
