<template>
  <div class="container" v-if="value">
    <div class="tool-bar">
      <div @click="close" class="tool-item">
        <img src="../assets/close.png" alt="">
      </div>
    </div>
    <div class="big-picture">
      <div @click="prev" v-show="showController" class="controller left">
        <img src="../assets/left.png" alt="">
      </div>
      <div class="img-container">
        <img :src="currentImg" :style="currentStyle" alt="">
      </div>
      <div @click="next" v-show="showController" class="controller right">
        <img src="../assets/right.png" alt="">
      </div>
    </div>
    <ul class="thumb-list">
      <li :key="index" :class="{active: index === currentIndex}" @click="() => {preview(index)}" v-for="(img, index) in data"
          class="thumb-item">
        <img :src="img" alt="">
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        currentIndex: this.pictureIndex,
        cacheWH: []
      }
    },
    props: {
      value: Boolean,
      data: Array,
      pictureIndex: 0
    },
    computed: {
      currentImg: {
        cache: false,
        get () {
          if (this.data && this.data.length > 0) {
            console.log(this.data[this.currentIndex], this.currentIndex)
            return this.data[this.currentIndex]
          } else {
            return null
          }
        }
      },
      currentStyle () {
        let windowHeight = document.body.clientHeight
        let {w, h} = this.cacheWH[this.currentIndex] || {w: 0, h: 0}
        if (w && h) {
          if (w > h) {
            return {
              width: '100%'
            }
          } else {
            console.log(windowHeight - 180, (((windowHeight - 180) / h) * w))
            return {
              height: '100%',
              width: (((windowHeight - 180) / h) * w) + 'px'
            }
          }
        } else {
          return {}
        }
      },
      showController () {
        return this.data.length > 1
      }
    },
    watch: {
      data: 'initCacheWH',
      pictureIndex (val) {
        this.currentIndex = val
      }
    },
    methods: {
      onLoad (e) {
        console.log(e)
      },
      initCacheWH () {
        if (this.cacheWH.length !== this.data.length) {
          this.cacheWH = []
          for (let index = 0; index < this.data.length; index++) {
            this.cacheWH.push({loading: false, w: 0, h: 0})
          }
        }
        let updateCacheWH = ({index, w, h}) => {
          this.$set(this.cacheWH, index, {
            loading: false,
            w,
            h
          })
        }
        for (let index = 0; index < this.data.length; index++) {
          this.cacheWH[index].loading = true
          let img = new Image()
          img.onload = function () {
            updateCacheWH({index, w: this.width, h: this.height})
          }
          img.src = this.data[index]
        }
      },
      preview (index) {
        this.currentIndex = index
      },
      prev () {
        if (this.currentIndex === 0) {
          this.currentIndex = this.data.length - 1
        } else {
          this.currentIndex -= 1
        }
      },
      next () {
        if (this.currentIndex !== this.data.length - 1) {
          this.currentIndex += 1
        } else {
          this.currentIndex = 0
        }
      },
      close () {
        this.$emit('input', false)
      }
    },
    mounted () {
      if (this.data && this.data.length > 0) {
        this.initCacheWH()
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 1);
    display: flex;
    justify-content: center;
    flex-direction: column;
    .tool-bar {
      flex: 0 0 40px;
      width: 100%;
      display: flex;
      padding: 0 20px;
      justify-content: flex-end;
      .tool-item {
        display: flex;
        flex: 0 0 40px;
        height: 40px;
        width: 40px;
        text-align: center;
        cursor: pointer;
        img {
          margin: 0 auto;
          display: flex;
          align-self: center;
          height: 30px;
          width: 30px;
        }
      }
    }
    .big-picture {
      display: flex;
      flex: 1;
      position: relative;
      flex-direction: row;
      .img-container {
        flex: 1;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        padding: 20px;
        overflow: hidden;
        img {
          align-self: center;
        }
      }
      .controller {
        align-self: center;
        flex: 0 0 100px;
        cursor: pointer;
        &.left {
          left: 20px;
        }
        &.right {
          right: 20px;
        }
      }
    }
    .thumb-list {
      text-align: center;
      justify-content: center;
      display: flex;
      height: 140px;
      padding: 20px 0;
      flex-direction: row;
      .thumb-item {
        height: 100px;
        width: 100px;
        margin-left: 10px;
        cursor: pointer;
        &.active {
          border: 2px solid #ffffff;
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
