<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card>
      <el-row :gutter="25">
        <!--搜索框-->
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryData.query" :clearable="true" @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <!--添加按钮-->
        <el-col :span="3">
          <el-button type="primary" @click="adduser">添加用户</el-button>
        </el-col>
      </el-row>
      <!--用户表单-->
      <el-table
        :data="userList"
        style="width: 100%"
        :border="true"
        :stripe="true">
        <el-table-column
          label="#"
          type="index">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色">
        </el-table-column>
        <!--状态选项-->
        <el-table-column
          prop="mg_state"
          label="状态">
          <!--作用域插槽添加状态按钮-->
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <!--操作选项-->
        <el-table-column
          label="操作" width="180px">
          <template v-slot="scope">
            <el-tooltip effect="dark" content="编辑角色" placement="top-start" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditeDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="删除角色" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="showRemove(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="分配角色" placement="top-end" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRoleDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--添加用户弹窗dialog-->
      <el-dialog
        title="添加用户"
        :visible.sync="adduserDialog"
        width="50%" @close="adduserClose">
        <!--弹窗主内容-->
        <el-form :model="adduserForm" :rules="adduserRules" ref="adduserRef" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="adduserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="adduserForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="adduserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="adduserForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!--弹窗脚 按钮-->
        <span slot="footer" class="dialog-footer">
        <el-button @click="adduserDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!--用户编辑弹窗-->
      <el-dialog
        title="用户修改"
        :visible.sync="editeDialog"
        width="50%" @close="editeDialogClose">
        <!--弹窗表单区域-->
        <el-form :model="editeForm" :rules="editeDialogRules" ref="editeDialogRef" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="editeForm.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editeForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editeForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!--弹窗脚（按钮）-->
        <span slot="footer" class="dialog-footer">
        <el-button @click="editeDialog = false">取 消</el-button>
        <el-button type="primary" @click="editeDialogCommit">确 定</el-button>
        </span>
      </el-dialog>
      <!--分配角色dialog-->
      <el-dialog
        title="分配角色"
        :visible.sync="setRoleDialogVisible"
        width="50%"
        @close="setRoleClose">
        <!--主体区域-->
          <p>姓名：{{setRole.username}}</p>
          <p>角色：{{setRole.role_name}}</p>
          <div>
            <p>分配角色：</p>
            <el-select v-model="setRoleId" placeholder="请选择">
              <el-option
                v-for="item in setRoleList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </div>
        <!--尾部按钮区域-->
        <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleCommit">确 定</el-button>
        </span>
      </el-dialog>
      <!--分页器-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryData.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="queryData.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    /* 利用正则表达式增加自定义的验证规则 */
    var userEmailCheck = (rules, value, callback) => {
      rules = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if (rules.test(value)) {
        callback()
      } else {
        callback(new Error('邮箱格式有误'))
      }
    }
    var userMobileCheck = (rules, value, callback) => {
      rules = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (rules.test(value)) {
        callback()
      } else {
        callback(new Error('手机号码格式错误'))
      }
    }
    return {
      /* 用户列表数据get方式传递params */
      queryData: {
        query: '',
        pagenum: 1,
        pagesize: 3
      },
      /* 用户列表数据获取到的值 */
      userList: [],
      total: 0,
      adduserDialog: false,
      editeDialog: false,
      setRoleDialogVisible: false,
      setRoleList: [],
      setRole: {},
      setRoleId: '',
      adduserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      /* 编辑弹窗后台获取的数据 */
      editeForm: {},
      /* 用户弹窗输入框验证规则 */
      adduserRules: {
        username: [
          {
            required: true,
            message: '请输入用户名名称',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 8,
            message: '长度在 5 到 8 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 8,
            max: 12,
            message: '长度在 8 到 12 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱名称',
            trigger: 'blur'
          },
          {
            validator: userEmailCheck,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          },
          {
            validator: userMobileCheck,
            trigger: 'blur'
          }
        ]
      },
      /* 编辑弹窗表单验证规则 */
      editeDialogRules: {
        email: [
          {
            required: true,
            message: '邮箱不可为空',
            trigger: 'blur'
          },
          {
            validator: userEmailCheck,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '手机不可为空',
            trigger: 'blur'
          },
          {
            validator: userMobileCheck,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  /* 生命周期函数-生成组件后立刻获取用户列表数据 */
  created () {
    this.getUserList()
  },
  methods: {
    /* 获取用户列表数据功能实现 */
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryData
      })
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.meta.message
        })
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    /* 实现每页显示条数改变时功能实现 */
    handleSizeChange (pageValue) {
      this.queryData.pagesize = pageValue
      this.getUserList()
    },
    /* 实现当前页改变时功能实现 */
    handleCurrentChange (pageValue) {
      this.queryData.pagenum = pageValue
      this.getUserList()
    },
    /* 状态按钮切换时即时改变后台数据 */
    async userStateChange (val) {
      const { data: res } = await this.$http.put(`users/${val.id}/state/${val.mg_state}`)
      if (res.meta.status !== 200) {
        val.mg_state = !val.mg_state
        return this.$message({
          type: 'error',
          message: res.meta.msg
        })
      }
      this.$message({
        type: 'success',
        message: res.meta.msg
      })
    },
    /* 添加用户弹窗出现功能 */
    adduser () {
      this.adduserDialog = true
    },
    /* 添加用户弹窗关闭后自动清空表单内数据功能实现 */
    adduserClose () {
      this.$refs.adduserRef.resetFields()
    },
    /* 添加用户功能实现(数据添加至后台并渲染前端页面) */
    addUser () {
      this.$refs.adduserRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.adduserForm)
        if (res.meta.status !== 201) {
          return this.$message({
            type: 'error',
            message: res.meta.msg
          })
        }
        this.adduserDialog = false
        this.getUserList()
      })
    },
    /* 编辑弹窗功能实现 */
    async showEditeDialog (id) {
      this.editeDialog = true
      const { data: res } = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          message: res.meta.msg
        })
      }
      this.editeForm = res.data
    },
    /* 编辑弹窗关闭后表单重置 */
    editeDialogClose () {
      this.$refs.editeDialogRef.resetFields()
    },
    /* 编辑表单提交功能 */
    editeDialogCommit () {
      this.$refs.editeDialogRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`users/${this.editeForm.id}`, {
          email: this.editeForm.email,
          mobile: this.editeForm.mobile
        })
        if (res.meta.status !== 200) {
          return this.$message({
            type: 'error',
            message: res.meta.msg
          })
        }
        this.editeDialog = false
        this.$message({
          type: 'success',
          message: res.meta.msg
        })
        this.getUserList()
      })
    },
    /* 删除用户功能实现 */
    async showRemove (id) {
      const removeMsg = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {})
      if (removeMsg !== 'confirm') return this.$message({ type: 'info', message: '已取消删除操作' })
      const { data: res } = await this.$http.delete(`users/${id}`)
      if (res.meta.status !== 200) return this.$message({ type: 'error', message: res.meta.msg })
      this.$message({ type: 'success', message: res.meta.msg })
      this.getUserList()
    },
    /* 分配角色dialog */
    async showSetRoleDialog (role) {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取数据出错')
      this.setRoleList = res.data
      this.setRole = role
      this.setRoleDialogVisible = true
    },
    /* 关闭分配角色dialog后重置内容 */
    setRoleClose () {
      this.setRoleId = ''
      this.setRoleList = []
    },
    /* 分配角色功能实现 */
    async setRoleCommit () {
      if (!this.setRoleId) return this.$message.error('未选择角色')
      const { data: res } = await this.$http.put(`users/${this.setRole.id}/role`, {
        rid: this.setRoleId
      })
      if (res.meta.status !== 200) return this.$message.error('设置角色失败')
      this.getUserList()
      this.$message.success('设置角色成功')
      this.setRoleDialogVisible = false
    }
  }
}
</script>

<style scoped>
p{
  font-size: 16px;
  line-height: 30px;
}
</style>
