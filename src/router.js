import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      redirect: {
        name: 'Dashboard'
      }
    },
    {
      path: '/Dashboard',
      name: 'Dashboard',
      component: () => import('./views/Dashboard')
    },
    {
      path: '/Users',
      name: 'Users',
      component: () => import('./views/Users')
    },
    {
      path: '/Login',
      name: 'Login',
      component: () => import('./views/Login')
    }
  ]
})
