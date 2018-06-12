<template>
  <div class="container">
    <section class="panel">
      <div class="login-panel">
        <div class="logo-wrapper">
          <img class="logo" src="../../assets/images/logo.png" alt="">
        </div>
        <div class="form-wrapper">
          <div class="form-item">
            <div class="input-icon">
              <img src="../../assets/images/user.png" alt="">
            </div>
            <div class="input-wrapper">
              <input type="text" v-model="form.account" placeholder="请输入账户">
            </div>
          </div>
          <div class="form-item">
            <div class="input-icon">
              <img src="../../assets/images/password.png" alt="">
            </div>
            <div class="input-wrapper">
              <input type="password" v-model="form.password" placeholder="请输入密码">
            </div>
          </div>
          <div class="form-item">
            <div class="input-icon">
              <img src="../../assets/images/code.png" alt="">
            </div>
            <div class="input-wrapper">
              <input type="text" maxlength="6" v-model="form.code" placeholder="请输入验证码">
            </div>
            <div class="extra-wrapper">
              <img class="code" @click="refreshCodeUrl" :src="codeUrl" alt="">
            </div>
          </div>
          <div class="form-actions-wrapper">
            <div class="forget-password">
              <a @click="showForgetPwdModal = true">忘记密码？</a>
            </div>
            <div class="submit-btn-wrapper">
              <button class="submit-btn" @click="onLogin">登录</button>
            </div>
          </div>
        </div>
        <div class="copy-right">
          2018 &copy; <a href="#">VueCMS</a>
        </div>
      </div>
      <div class="carousel-panel">
      </div>
    </section>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        form: {
          account: '',
          password: '',
          code: ''
        },
        showForgetPwdModal: false,
        codeUrl: ''
      }
    },
    methods: {
      refreshCodeUrl () {
        this.codeUrl = (process.env.NODE_ENV !== 'production' ? 'api' : '') + '/code?' + Math.random()
      },
      onLogin () {
        this.$emit('on-login')
        // TODO 替换联调登录接口
        // this.$router.push({name: 'Dashboard'})
      }
    },
    mounted () {
      this.refreshCodeUrl()
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/less/base";

  .container {
    height: 100%;
    width: 100%;
    display: flex;
    flex: 1;
    justify-content: center;
    align-self: center;
    .panel {
      width: 1600px;
      height: 800px;
      display: flex;
      flex-direction: row;
      align-self: center;
      overflow: hidden;
      .login-panel {
        /*flex: 0 0 400px;*/
        width: 450px;
        background: white;
        padding: 50px;
        box-sizing: border-box;
        .logo-wrapper {
          height: 100px;
          width: 100%;
          padding: 10px;
          overflow: hidden;
          margin-bottom: 100px;
          img {
            width: 100%;
          }
        }
        .form-wrapper {
          display: flex;
          flex-direction: column;
          .form-item {
            display: flex;
            flex-direction: row;
            flex: 1;
            height: 40px;
            align-items: center;
            border: 2px solid #e0e2e5;
            box-sizing: content-box;
            border-radius: 5px;
            margin-top: 20px;
            .input-icon {
              height: 40px;
              width: 40px;
              padding: 10px;
              display: flex;
              border-right: 2px solid #e0e2e5;
              img {
                height: 100%;
                align-self: center;
              }
            }
            .input-wrapper {
              flex: 1;
              display: flex;
              align-self: center;
              padding: 10px;
              input {
                flex: 1;
                width: 100%;
                color: black;
                border: none;
                &:focus {
                  outline: none;
                }
                &::placeholder {
                  color: #e0e2e5;
                }
              }
            }
            .extra-wrapper {
              flex: 0 0 100px;
              height: 40px;
              border-left: 2px solid #e0e2e5;
              .code {
                height: 40px;
                width: 100px;
              }
            }
          }
          .form-actions-wrapper {
            display: flex;
            flex-direction: row;
            padding: 10px 0;
            align-items: center;
            margin-top: 20px;
            .forget-password {
              flex: 1;
              a {
                color: #009bff;
              }
            }
            .submit-btn-wrapper {
              button {
                cursor: pointer;
                width: 120px;
                height: 40px;
                background: #009bff;
                line-height: 40px;
                padding: 0;
                margin: 0;
                border: none;
                color: white;
                border-radius: 4px;
                box-shadow: 1px 1px 30px -10px rgba(71, 134, 255, 1);
                &:focus, &:visited, &:active {
                  outline: none;
                }
                &:active {
                  opacity: 1;
                }
              }
            }
          }
        }
        .copy-right {
          border-top: 2px dotted #e0e2e5;
          margin-top: 20px;
          padding: 20px 0;
          text-align: center;
        }
      }
      .carousel-panel {
        flex: 1;
        height: 800px;
        background-image: url("../../assets/images/laptop.jpg");
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
      }
    }
  }
</style>
