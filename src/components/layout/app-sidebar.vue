<template>
  <div class="wrapper" :style="{height: height}">
    <div class="toggle" @click="toggle" :class="{open: value}">
      <template v-if="!value">
        <Icon type="chevron-right" size="20"></Icon>
      </template>
      <template v-else>
        <Icon type="chevron-left" size="20"></Icon>
      </template>
    </div>
    <div class="menu-wrapper" v-if="value">
      <template v-for="(menu, index) in menus">
        <router-link tag="a" :class="{active: menu.name === $route.name}" :to="{name: menu.name}" class="menu-item"
                     :key="index">
          <Icon size="18" :type="menu.icon"></Icon>
          {{menu.label}}
        </router-link>
      </template>
    </div>
  </div>
</template>
<style scoped lang="less">
  .wrapper {
    position: relative;
    z-index: 0;
    background: white;
    .toggle {
      cursor: pointer;
      width: 50px;
      text-align: right;
      background: white;
      height: 50px;
      line-height: 50px;
      display: flex;
      align-self: center;
      justify-content: center;
      align-items: center;
      border-radius: 0 5px 5px 0;
      position: absolute;
      &.open {
        left: 200px;
      }
    }
  }

  .menu-wrapper {
    display: flex;
    flex-direction: column;
    background: white;
    box-shadow: 2px 0 10px 0 rgba(229, 229, 229, 1);
    border-right: 1px solid #e5e5e5;
    height: 100%;
    flex: 1;
    width: 100%;
    .menu-item {
      height: 50px;
      width: 100%;
      padding: 15px 30px;
      font-size: 16px;
      line-height: 20px;
      color: #99a1a7;
      transition: all 0.2s;
      &.active, &:hover {
        border-right: 4px solid #009bff;
        color: #009bff;
        font-weight: 600;
      }
      &:hover{
        text-indent: 10px;
      }
    }
  }
</style>
<script>

  export default {
    data () {
      return {
      }
    },
    props: {
      height: String,
      value: Boolean,
      menus: Array
    },
    methods: {
      toggle () {
        this.$emit('input', !this.value)
      }
    }
  }
</script>
