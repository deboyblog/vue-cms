import hadPermission from '../utils/permission'

export default {
  data () {
    return {}
  },
  computed: {
    busying () {
      return this.$store.getters.busying
    }
  },
  methods: {
    hadPermission: hadPermission
  }
}
