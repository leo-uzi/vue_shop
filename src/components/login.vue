<template>
<!--  登录页面容器-->
  <div class="login_container">
    <!--登录页面盒子模型-->
    <div class="login_box">
      <!--头像区域-->
      <div class="head_img">
        <img src="../assets/logo.png" alt="">
      </div>
      <!--表单区域-->
      <el-form label-width="0" ref="loginRef" class="form_data" :model="loginData" :rules="loginRules">
        <!--用户名输入框-->
        <el-form-item class="username" prop="username">
          <el-input  prefix-icon="iconfont icon-user" v-model="loginData.username"></el-input>
        </el-form-item>
        <!--密码框-->
        <el-form-item class="pwd" prop="password">
          <el-input type="password" prefix-icon="iconfont icon-3702mima" v-model="loginData.password" ></el-input>
        </el-form-item>
        <!--按钮区域-->
        <el-form-item class="btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="loginReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      /* 表单数据对象 */
      loginData: {
        username: 'admin',
        password: '123456'
      },
      /* 表单验证对象 */
      loginRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 5, max: 8, message: '长度在 5 到8个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 8 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /* 重置按钮功能实现 */
    loginReset () {
      this.$refs.loginRef.resetFields()
    },
    /* 登录按钮功能实现 */
    login () {
      this.$refs.loginRef.validate(async value => {
        if (!value) return
        const { data: ref } = await this.$http.post('login', this.loginData)
        /* 设置弹窗提醒 */
        if (ref.meta.status !== 200) return this.$message({ message: '登录失败', type: 'error', showClose: true })
        this.$message({ message: '登录成功', type: 'success', showClose: true })
        /* 登录成功后记录token值至sessionStorage中 */
        window.sessionStorage.setItem('token', ref.data.token)
        /* 编程式导航至home页面 */
        this.$router.push('/home')
      })
    }
  }
}

</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .head_img{
    width: 130px;
    height: 130px;
    border: solid 1px #eee;
    border-radius: 50%;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
    box-shadow: 0 0 10px #ccc;
    img{
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 1px solid #eee;
      background-color: #f0f0f0;
    }
  }
  .form_data{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
  }
  .btn{
    display: flex;
    justify-content: flex-end;
  }

</style>
