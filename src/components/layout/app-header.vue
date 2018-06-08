<template>
  <div class="header-wrapper">
    <div class="logo-wrapper">
      <router-link :to="{name: 'Dashboard'}" tag="a" class="logo-wrapper">
        <img class="logo" src="../../assets/images/logo.png" alt="">
      </router-link>
    </div>
    <div class="account-info-wrapper">
      <div class="headimg">
        <img src="../../assets/logo.png" alt="">
      </div>
      <div class="user-info">
        <p class="username">Hello, {{userInfo && userInfo.account || 'Admin'}}</p>
        <p class="update-pwd-btn" @click.native="showUpdatePswModal = true">修改密码</p>
      </div>
      <div class="message">
        <Badge dot>
          <Icon type="ios-bell" color="#99a1a7" size="30"></Icon>
        </Badge>
      </div>
      <div class="exit" @click="logout">
        <Icon size="30" color="#99a1a7" type="android-exit"></Icon>
      </div>
    </div>
    <Modal
      v-model="showUpdatePswModal"
      title="修改密码"
      @on-ok="confirm"
      @on-cancel="() => {showUpdatePswModal = false}">
      <Form :model="form" label-position="right" :label-width="100">
        <FormItem label="旧密码">
          <i-input v-model="form.oldPsw"></i-input>
        </FormItem>
        <FormItem label="新密码">
          <i-input v-model="form.newPsw"></i-input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<style scoped lang="less" rel="stylesheet/less">
  .header-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    background: white;
    box-shadow: 0px 2px 10px 0px rgba(229, 229, 229, 1);
    .toggle-wrapper {
      color: black;
      flex: 0 0 200px;
      text-align: center;
      font-size: 18px;
    }
    .logo-wrapper {
      flex: 1;
      display: flex;
      align-self: center;
      padding-left: 10px;
      .logo {
        display: flex;
        height: 50px;
        align-self: center;
      }
    }
    .account-info-wrapper {
      flex: 0 0 300px;
      display: flex;
      flex-direction: row;
      .headimg {
        flex: 0 0 50px;
        align-self: center;
        align-items: center;
        display: flex;
        text-align: center;
        img {
          width: 40px;
          height: 40px;
          border-radius: 5px;
        }
      }
      .user-info {
        display: flex;
        flex-direction: column;
        flex: 1;
        align-self: center;
        margin-left: 10px;
        p {
          text-align: left;
          line-height: 20px;
          align-self: flex-start;
        }
        .username {
          color: #99a1a7;
          font-weight: 600;
          font-size: 16px;
        }
        .update-pwd-btn {
          color: #009bff;
          font-size: 14px;
          cursor: pointer;
        }
      }
      .message{
        flex: 0 0 50px;
        align-self: center;
        align-items: center;
        flex-direction: column;
        display: flex;
        margin-right: 10px;
        cursor: pointer;
      }
      .exit{
        cursor: pointer;
        flex: 0 0 70px;
        height: 80px;
        align-self: center;
        align-items: center;
        display: flex;
        justify-content: center;
        flex-direction: column;
        border-left: 2px solid #f5f7fa;
        text-align: center;
      }
    }
  }
</style>
<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'

  export default {
    data () {
      return {
        showUpdatePswModal: false,
        form: {
          oldPsw: '',
          newPsw: ''
        }
      }
    },
    watch: {},
    computed: {
      ...mapGetters(['userInfo'])
    },
    methods: {
      logout () {
        this.$http.post('login/logout').then(res => {
          this.$store.commit('LOGOUT')
          window.location.href = '/'
        })
      },
      confirm () {
        this.$http.post('userLogin/updatePsw', this.form).then(res => {
          this.showUpdatePswModal = false
        })
      }
    }
  }
</script>
