/**
 * Created by Deboy on 2016/10/12.
 */
const state = {
  user: Object.assign({}, JSON.parse(window.sessionStorage.getItem('user')) || {})
}
const getters = {
  userInfo (state) {
    return state.user
  },
  isLogin (state) {
    return (state.user && state.user.id) || false
  },
  authToken (state) {
    return state.user && state.user.token
  },
  /**
   * 用户权限列表 key 集合
   * @param state
   * @returns {Array}
   */
  permissions (state) {
    let user = state.user
    if (user && user.id) {
      if (!user.rolePermissionList) {
        return []
      }
      return user.rolePermissionList.map(p => p.permission && p.permission.permission)
    } else {
      return []
    }
  },
  permissionIds () {
    let user = state.user
    if (user && user.id) {
      if (!user.rolePermissionList) {
        return []
      }
      return user.rolePermissionList.map(p => {
        // console.log(p.permission, p.permission.id)
        return p.permission && p.permission.id
      })
    } else {
      return []
    }
  }
}
const mutations = {
  SET_USER_INFO (state, payload) {
    state.user = payload
    window.sessionStorage.setItem('user', JSON.stringify(state.user))
  },
  LOGOUT (state) {
    state.user = null
    window.sessionStorage.removeItem('user')
  }
}
export default {
  state,
  getters,
  mutations
}
