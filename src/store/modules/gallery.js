/**
 * Created by Deboy on 2017/5/3.
 */
const state = {
  show: false,
  pictureIndex: 0,
  imgList: []
}

const mutations = {
  PUSH_GALLERY (state, payload) {
    state.pictureIndex = payload.index
    state.imgList = payload.imgList
    state.show = true
  },
  SHIFT_GALLERY (state) {
    state.show = false
  }
}
const getters = {
  gallery (state) {
    return state
  }
}
const actions = {
  openGallery (contaxt, playload) {
    contaxt.commit('PUSH_GALLERY', playload)
  },
  closeGallery (contaxt) {
    contaxt.commit('SHIFT_GALLERY')
  }
}
export default {
  state,
  mutations,
  getters,
  actions
}
