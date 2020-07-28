<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card>
      <!--添加按钮-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>
      <!--表单区域-->
      <el-table :data="rolesData" :border="true" :stripe="true">
        <!--权限展开部分-->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row :class="['bd_bottom','center_item',index1===0 ? 'bd_top' :'']" v-for="(item1,index1) in scope.row.children" :key="item1.id">
              <!--一级权限-->
              <el-col :span="6">
                <el-tag closable @close="removeRoleRight(scope.row,item1.id)">
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--二级及三级权限-->
              <el-col :span="18">
                <el-row :class="index2===0?'':'bd_top'" v-for="(item2,index2) in item1.children" :key="item2.id" >
                  <!--二级权限-->
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRoleRight(scope.row,item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!--三级权限-->
                  <el-col :span="18">
                    <el-tag type="warning"  v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRoleRight(scope.row,item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--排序列-->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditeDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRole(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRights(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--编辑功能dialog-->
      <el-dialog
        title="角色编辑"
        :visible.sync="editeDialog"
        width="50%" @closed="editeDialogClose">
        <!--表单区域-->
        <el-form :model="editeForm" :rules="editeFormRules" ref="editeRef" label-width="100px">
          <el-form-item label="角色名称">
            <el-input v-model="editeForm.roleName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editeForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!--尾部按钮区域-->
        <span slot="footer" class="dialog-footer">
        <el-button @click="editeDialog = false">取 消</el-button>
        <el-button type="primary" @click="editeFormChange">确 定</el-button>
        </span>
      </el-dialog>
      <!--添加角色dialog-->
      <el-dialog
        title="添加角色"
        :visible.sync="addRoleDialog"
        width="50%" @close="addRoleClose">
        <!--表单区域-->
        <el-form :model="addRoleForm" :rules="addRoleRules" ref="addRoleRef" label-width="100px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!--尾部按钮区域-->
        <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </el-dialog>
      <!--分配权限dialog-->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightVisible"
        width="50%"
        @close="setRightClose">
        <!--树形控件-->
        <el-tree :data="rightsTree" :props="rightProps" :show-checkbox="true"
        node-key="id" default-expand-all :default-checked-keys="defalutChecked" ref="rightTreeRef"></el-tree>
        <!--尾部按钮区域-->
        <span slot="footer" class="dialog-footer">
        <el-button @click="setRightVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRightCommit">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rolesData: [],
      rightsTree: [],
      rightProps: {
        label: 'authName',
        children: 'children'
      },
      defalutChecked: [],
      editeDialog: false,
      addRoleDialog: false,
      setRightVisible: false,
      roleID: '',
      editeForm: {
      },
      addRoleForm: {
      },
      editeFormRules: {
        roleDesc: [
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]
      },
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  /* 生命周期函数在组件生成后立刻获取表单数据 */
  created () {
    this.getrolesData()
  },
  methods: {
    /* 获取角色列表表单数据 */
    async getrolesData () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message({ type: 'error', message: res.meta.msg })
      this.rolesData = res.data
    },
    /* 编辑弹窗填充功能实现 */
    async showEditeDialog (id) {
      this.editeDialog = true
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message({ type: 'error', message: res.meta.msg })
      this.editeForm = res.data
    },
    /* 编辑dialog关闭后内容自动重置 */
    editeDialogClose () {
      this.$refs.editeRef.resetFields()
    },
    /* 编辑功能提交实现 */
    editeFormChange () {
      this.$refs.editeRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`roles/${this.editeForm.roleId}`, {
          roleName: this.editeForm.roleName,
          roleDesc: this.editeForm.roleDesc
        })
        if (res.meta.status !== 200) return this.$message({ type: 'error', message: res.meta.msg })
        this.$message({ type: 'success', message: res.meta.msg })
        this.editeDialog = false
        this.getrolesData()
      })
    },
    /* 删除角色功能实现 */
    async removeRole (id) {
      const confirm = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {})
      if (confirm !== 'confirm') return
      const { data: res } = await this.$http.delete(`roles/${id}`)
      if (res.meta.status !== 200) return this.$message({ type: 'error', message: res.meta.msg })
      this.getrolesData()
    },
    /* 角色添加dialog */
    addRole () {
      this.addRoleDialog = true
    },
    /* 添加角色dialog关闭后自动重置表单 */
    addRoleClose () {
      this.$refs.addRoleRef.resetFields()
    },
    /* 角色添加功能实现 */
    addRoles () {
      this.$refs.addRoleRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', {
          roleName: this.addRoleForm.roleName,
          roleDesc: this.addRoleForm.roleDesc
        })
        if (res.meta.status !== 201) return this.$message({ type: 'error', message: res.meta.msg })
        this.$message({ type: 'success', message: res.meta.msg })
        this.addRoleDialog = false
        this.getrolesData()
      })
    },
    /* 指定删除角色权限功能实现 */
    async removeRoleRight (role, rightId) {
      const confirm = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirm !== 'confirm') return this.$message({ type: 'info', message: '删除已取消' })
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message({ type: 'error', message: res.meta.msg })
      role.children = res.data
    },
    /* 分配权限diglog */
    async showSetRights (role) {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message({ type: 'error', message: res.meta.msg })
      this.rightsTree = res.data
      this.getDefaultChecked(role)
      this.roleID = role.id
      this.setRightVisible = true
    },
    /* 使用递归循环添加id至设置树状组件中默认选中项的数组中 */
    getDefaultChecked (node) {
      if (!node.children) {
        return this.defalutChecked.push(node.id)
      } else {
        node.children.forEach(item => {
          this.getDefaultChecked(item)
        })
      }
    },
    /* 关闭分配权限dialog后重置数据 */
    setRightClose () {
      this.defalutChecked = []
    },
    /* 权限分配功能实现 */
    async setRightCommit () {
      const keys = [
        ...this.$refs.rightTreeRef.getCheckedKeys(),
        ...this.$refs.rightTreeRef.getHalfCheckedKeys()
      ]
      const keyStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleID}/rights`, {
        rids: keyStr
      })
      if (res.meta.status !== 200) return this.$message({ type: 'error', message: res.meta.msg })
      this.$message.success('更新成功')
      this.getrolesData()
      this.setRightVisible = false
    }
  }
}
</script>

<style scoped>
  .el-tag{
    margin: 10px;
  }
  .bd_top{
    border-top: solid 1px #f0f0f0;
  }
  .bd_bottom{
    border-bottom: solid 1px #f0f0f0;
  }
  .center_item{
    display: flex;
    align-items: center;
  }
</style>
