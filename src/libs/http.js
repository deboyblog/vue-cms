import Axios from 'axios'
import Qs from 'qs'
import iView from 'iview'
import store from '../store'

function install (Vue) {
  Axios.defaults.baseURL = (process.env.NODE_ENV !== 'production' ? '/api' : '') + '/admin'
  Axios.defaults.headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  Axios.defaults.timeout = 20000
  // Axios.defaults.withCredentials = true
  Axios.interceptors.request.use((request) => {
    if (store.getters.authToken) {
      request.headers.token = store.getters.authToken
    }
    if (request.url.toUpperCase().indexOf('FILE') < 0) {
      iView.LoadingBar.start()
      store.dispatch('openLoading')
      // 检测参数列表 清空无用参数
      if (request.data) {
        let uselessVars = []
        for (let params in request.data) {
          if (request.data[params] === undefined || request.data[params] === null || request.data[params] === '') {
            uselessVars.push(params)
            delete request.data[params]
          }
        }
        if (uselessVars.length > 0) {
          console.log('清空了以下无用参数:', uselessVars.join(','))
        }
      }
      // 判断接口需要以哪种形式发送参数
      if (request.isJSON) {
        request.headers['Content-Type'] = 'application/json'
      } else {
        for (let params in request.data) {
          if (typeof request.data[params] === 'object') {
            delete request.data[params]
          }
        }
        request.data = Qs.stringify(request.data)
      }
    }
    return request
  }, (error) => {
    console.log(error)
  })
  // Add a response interceptor
  Axios.interceptors.response.use((response) => {
    iView.LoadingBar.finish()
    store.dispatch('closeLoading')
    switch (response.data.code) {
      case 200:
        return Promise.resolve(response.data)
      case 444:
        iView.Message.info('请先登录')
        store.commit('LOGOUT')
        return Promise.reject(response.data)
      default:
        iView.Message.error(response.data.msg)
        return Promise.reject(response.data)
    }
  }, (error) => {
    iView.LoadingBar.error()
    store.dispatch('closeLoading')
    if (!error.response && error.code !== 'ECONNABORTED') {
      iView.Message.info('请先登录')
      store.commit('LOGOUT')
      return Promise.reject(new ErrorEvent({}))
    }
    if (JSON.stringify(error).indexOf('404') > 0) {
      iView.Notice.error({
        title: '系统错误',
        desc: '系统出现错误，请联系管理员',
        duration: 5
      })
    } else if (error.code === 'ECONNABORTED') {
      iView.Notice.error({
        title: '请求超时',
        desc: '请尝试刷新,如刷新多次均无法正常使用,请联系管理员',
        duration: 5
      })
    } else {
      iView.Notice.error({
        title: '网络错误',
        desc: '网络出错，如果多次出现，请联系管理员',
        duration: 5
      })
    }
    return Promise.reject(error)
  })
  Vue.prototype.$http = Axios
}

export default install
