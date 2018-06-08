import Store from '../store'

/**
 * 权限校验
 * @param permission
 * @returns {boolean}
 */
export default (permission = '') => {
  // 没有定义权限校验 都返回 true
  if (!permission) {
    return true
  }
  let userPermissions = Store.getters.permissions
  let userPermissionIds = Store.getters.permissionIds
  if (typeof permission === 'number') {
    return userPermissionIds.indexOf(permission) >= 0
  } else {
    return userPermissions.indexOf(permission) >= 0
  }
}
