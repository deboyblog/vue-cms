/**
 * Created by Deboy on 2017/4/1.
 */
const files = require.context('.', false, /\.js$/)
const modules = {}

files.keys().forEach((key) => {
  if (key === './index.js' || key === './store-keys.js') {
    return
  }
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

export default modules
