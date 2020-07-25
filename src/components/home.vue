<template>
  <!--home界面容器-->
  <el-container class="el-box">
    <!--头部-->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="ifo" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!--侧边栏-->
      <el-aside :width="Collapse?'64px':'200px'">
        <div class="toggleBTN" @click="toggleMenu">|||</div>
        <!--侧边栏导航-->
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#396db2"
          :unique-opened="true"
          :collapse="Collapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activeState">
          <!--一级导航-->
          <el-submenu :index="'/'+item.path" v-for="item in menuData" :key="item.id">
            <!--一级导航模板-->
            <template slot="title">
              <!--图标-->
              <i :class=iconFont[item.id]></i>
              <!--文字-->
              <span>{{item.authName}}</span>
            </template>
            <!--二级导航-->
            <el-menu-item :index="'/'+items.path" v-for="items in item.children" :key="items.id" @click="activeChange('/'+items.path)">
              <!--二级导航模板-->
              <template slot="title">
                <!--图标-->
                <i class="el-icon-menu"></i>
                <!--文字-->
                <span>{{items.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data: function () {
    return {
      /* 侧边栏数据 */
      menuData: [],
      /* 侧边栏一级导航图标动态添加 */
      iconFont: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      Collapse: false,
      activeState: ''
    }
  },
  /* 用生命周期函数 页面一生成立刻加载menu */
  created () {
    this.showMenuList()
    this.activeState = window.sessionStorage.getItem('activeState')
  },
  methods: {
    /* 退出登录功能实现 */
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    /* 获取后台数据-侧边栏 */
    async showMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message({
          message: res.meta.message,
          type: 'error'
        })
      }
      this.menuData = res.data
    },
    /* 侧边栏折叠功能实现 */
    toggleMenu () {
      this.Collapse = !this.Collapse
    },
    /* 二级导航选取变色功能完善 */
    activeChange (activeState) {
      window.sessionStorage.setItem('activeState', activeState)
      this.activeState = window.sessionStorage.getItem('activeState')
    }
  }
}
</script>

<style lang="less" scoped>
  .el-menu {
    border-right: none;
  }

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    color: #fff;
    font-size: 20px;
    padding-left: 0;
    align-items: center;

    div {
      display: flex;
      align-items: center;

      span {
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #333744;

    span {
      font-size: 16px;
    }

    .iconfont {
      margin-right: 15px;
      font-size: 22px;
    }

    .el-icon-menu {
      font-size: 16px;
    }

    .el-menu-item span {
      font-size: 14px;
    }

    .toggleBTN {
      background-color: #485166;
      height: 20px;
      line-height: 20px;
      color: #fff;
      text-align: center;
      letter-spacing: 0.2em;
      font-size: 12px;
      cursor: pointer;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }

  .el-box {
    height: 100%;
  }
</style>
