<template>
  <div id="app" :style="{
    minHeight: `${windowAvailHeight}px`
  }">
    <div class="layout-wrapper">
      <div class="layout-header">
        <AppHeader></AppHeader>
      </div>
      <div class="content-wrapper">
        <div class="sidebar-wrapper" :class="{open: sidebarOpen, close: !sidebarOpen}">
          <AppSidebar v-model="sidebarOpen" :height="minContentHeight"></AppSidebar>
        </div>
        <div class="layout-content" :style="{minHeight: minContentHeight}">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
      </div>
      <BackTop></BackTop>
    </div>
    <Gallery v-model="gallery.show" :picture-index="gallery.pictureIndex" :data="gallery.imgList"></Gallery>
  </div>
</template>
<script type="text/ecmascript-6">
  import AppSidebar from './components/layout/app-sidebar'
  import Login from './components/layout/login'
  import AppHeader from './components/layout/app-header'
  import Gallery from './components/gallery'
  import {mapGetters} from 'vuex'

  export default {
    components: {
      AppSidebar,
      Login,
      AppHeader,
      Gallery
    },
    data () {
      return {
        windowAvailHeight: 0,
        sidebarOpen: true
      }
    },
    computed: {
      minContentHeight () {
        return (this.windowAvailHeight - 80) + 'px'
      },
      ...mapGetters([
        'breadcrumbs',
        'isLogin',
        'gallery'
      ])
    },
    methods: {
      getWindowAvailHeight () {
        let body = document.body
        let html = document.documentElement
        this.windowAvailHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
      }
    },
    mounted () {
      this.getWindowAvailHeight()
      window.addEventListener('resize', () => {
        this.getWindowAvailHeight()
      })
    }
  }
</script>
<style lang="less">
  @import "./assets/less/base";

  #app {
    width: 100%;
    background: #f5f7fa;
    * {
      box-sizing: border-box;
    }
    .layout-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      .layout-header {
        color: #e5e5e5;
        line-height: 80px;
        height: 80px;
        flex: 0 0 80px;
        z-index: 999;
      }
      .content-wrapper {
        flex: 1;
        width: 100%;
        flex-direction: row;
        display: flex;
        .sidebar-wrapper {
          width: 200px;
          flex: 0 0 200px;
          transition: all 0.1s;
          background: white;
          &.close {
            flex: 0;
            width: 0;
          }
          &.open {
            flex: 0 0 200px;
            width: 200px;
          }
        }
        .layout-content {
          flex: 1;
          min-height: 200px;
          margin-left: 10px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border-radius: 5px;
          padding: 20px 50px;
        }
      }
      .layout-copyright {
        flex: 0 0 40px;
        text-align: center;
        height: 40px;
        font-size: 14px;
        line-height: 40px;
        display: flex;
        color: #e5e5e5;
        align-self: center;
      }
    }
  }
</style>
