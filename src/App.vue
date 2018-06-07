<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style lang="less">
  @import "./assets/less/reset.less";
  #app {
    width: 100%;
    min-height: 100%;
    display: flex;
    flex: 1;
    background: url("./assets/images/team.jpg");
  }
</style>
