<template>
  <div style="display: flex;flex-direction: row">
    <Select v-model="province" @on-change="() => {
                    city = ''
                    loadArea(2, province)
                  }">
      <Option :key="index" v-for="(area, index) in provinces" :value="area.id">{{area.name}}</Option>
    </Select>
    <Select style="margin-left: 10px" @on-change="() => {
                    district = ''
                    loadArea(3, city)
                  }" v-if="level >= 2" v-model="city">
      <Option :key="index" v-for="(area, index) in cities" :value="area.id">{{area.name}}</Option>
    </Select>
    <Select style="margin-left: 10px" @on-change="() => {
                    street = ''
                    loadArea(4, district)
                  }" v-if="level >= 3" v-model="district">
      <Option :key="index" v-for="(area, index) in districts" :value="area.id">{{area.name}}</Option>
    </Select>
    <Select style="margin-left: 10px" v-if="level >= 4" v-model="street">
      <Option :key="index" v-for="(area, index) in streets" :value="area.id">{{area.name}}</Option>
    </Select>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        provinces: [],
        cities: [],
        districts: [],
        streets: []
      }
    },
    props: {
      province: [Number, String],
      city: [Number, String],
      district: [Number, String],
      street: [Number, String],
      level: {
        type: Number,
        default () {
          return 4
        }
      }
    },
    methods: {
      /**
       * 加载区域
       * @param level
       * @param parentId
       */
      loadArea (level = 1, parentId = null) {
        let lists = ['provinces', 'cities', 'districts', 'districts']
        this.$http.get('area/findAll', {
          params: {
            level: level,
            parentId: parentId
          }
        }).then(rst => {
          let key = lists[level - 1]
          this[key] = rst.data
        })
      }
    },
    mounted () {
      this.loadArea()
    }
  }
</script>

<style lang="less" scoped>
  .container {
  }
</style>
