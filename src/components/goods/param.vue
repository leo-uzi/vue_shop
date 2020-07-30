<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--alert警告-->
      <el-row>
        <el-col>
          <el-alert
            title="注意：只允许为第三级分类设置相关参数"
            type="warning" show-icon>
          </el-alert>
        </el-col>
      </el-row>
      <!--商品分类集联选择-->
      <el-row class="goodSelect">
        <el-col>
          <span style="margin-right: 10px">选择商品分类</span>
          <el-cascader
            v-model="goodClassKey"
            :options="goodList"
            :props="{ expandTrigger: 'hover' ,value:'cat_id',label:'cat_name',children:'children'}"
            @change="goodClassChange">
          </el-cascader>
        </el-col>
      </el-row>
      <!--标签页区域-->
      <el-tabs v-model="activeTab" @tab-click="tabClick">
        <!--动态参数选项卡-->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="goodClassIsThree" @click="addParamDialogVisible=true">添加参数</el-button>
          <el-table :data="manyListData" border stripe>
            <!--扩展列-->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!--标签-->
                <el-tag type="primary" v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="removeTag(index,scope.row)">{{item}}</el-tag>
                <!--动态编辑标签-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#">
            </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditParamDialog(scope.row.attr_id)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParam(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--静态属性选项卡-->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="goodClassIsThree" @click="addParamDialogVisible=true">添加属性</el-button>
          <el-table :data="onlyListData" border stripe>
            <!--展开列-->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!--标签-->
                <el-tag type="primary" v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="removeTag(index,scope.row)">{{item}}</el-tag>
                <!--动态编辑标签-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#">
            </el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditParamDialog(scope.row.attr_id)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParam(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!--添加参数/属性dialog-->
      <el-dialog
        :title="'添加'+titleText"
        :visible.sync="addParamDialogVisible"
        width="50%" @close="addParamDialogClose">
        <!--表单区域-->
        <el-form :model="addParamForm" :rules="addParamRules" ref="addParamRef" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addParamForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <!--尾部按钮-->
        <span slot="footer" class="dialog-footer">
        <el-button @click="addParamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParam">确 定</el-button>
        </span>
      </el-dialog>
      <!--修改参数/属性dialog-->
      <el-dialog
        :title="'修改'+titleText"
        :visible.sync="editParamDialogVisible"
        width="50%">
        <el-form :model="editParamForm" :rules="editParamRules" ref="editParamRef" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editParamForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <!--尾部按钮-->
        <span slot="footer" class="dialog-footer">
        <el-button @click="editParamDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamCommit">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      /* 级联选择器数据 */
      goodList: [],
      /* 级联选中项的ID */
      goodClassKey: [],
      /* 选项卡选中的选项值 */
      activeTab: 'many',
      /* 动态数据值 */
      manyListData: [],
      /* 静态属性值 */
      onlyListData: [],
      /* dialog可视状态 */
      addParamDialogVisible: false,
      editParamDialogVisible: false,
      /* 添加参数表单数据 */
      addParamForm: {
        attr_name: ''
      },
      /* 编辑参数表单数据 */
      editParamForm: {
        attr_name: ''
      },
      at_id: '',
      /* 表单验证规则 */
      addParamRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]
      },
      editParamRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  /* 生命周期函数在组件加载完成后立刻调取函数获取商品分类数据 */
  created () {
    this.getGoodsList()
  },
  methods: {
    /* 读取商品分配数据 */
    async getGoodsList () {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 3
        }
      })
      if (res.meta.status !== 200) return this.$message.error('读取数据失败')
      this.goodList = res.data
    },
    /* 当级联选择项更改时触发 */
    goodClassChange () {
      this.getClassParams()
    },
    /* 切换标签页触发 */
    tabClick () {
      this.getClassParams()
    },
    /* 获取商品分类参数数据 */
    async getClassParams () {
      /* 当未选择到三级目录时 */
      if (this.goodClassKey.length !== 3) {
        this.goodClassKey = []
        this.manyListData = []
        this.onlyListData = []
        return
      }
      const { data: res } = await this.$http.get(`categories/${this.paramsId}/attributes`, {
        params: {
          sel: this.activeTab
        }
      })
      if (res.meta.status !== 200) return this.$message.error('获取参数失败')
      /* 将attr_vals属性值转换成数组 */
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        /* 动态编辑标签使用增加独立的显示值和双向绑定值 */
        item.inputVisible = false
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeTab === 'many') {
        this.manyListData = res.data
      } else {
        this.onlyListData = res.data
      }
    },
    /* 关闭添加参数/属性dialog后重置内容 */
    addParamDialogClose () {
      this.$refs.addParamRef.resetFields()
    },
    /* 添加参数/属性功能实现 */
    addParam () {
      this.$refs.addParamRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.paramsId}/attributes`, {
          attr_name: this.addParamForm.attr_name,
          attr_sel: this.activeTab
        })
        if (res.meta.status !== 201) return this.$message.error('添加参数失败')
        this.$message.success('添加成功')
        this.getClassParams()
        this.addParamDialogVisible = false
      })
    },
    /* 添加参数/属性dialog */
    async showEditParamDialog (id) {
      this.editParamDialogVisible = true
      const { data: res } = await this.$http.get(`categories/${this.paramsId}/attributes/${id}`, {
        params: {
          attr_sel: this.activeTab
        }
      })
      this.at_id = id
      if (res.meta.status !== 200) this.$message.error('获取数据失败')
      this.editParamForm.attr_name = res.data.attr_name
    },
    /* 修改参数/属性修改提交功能实现 */
    editParamCommit () {
      this.$refs.editParamRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.paramsId}/attributes/${this.at_id}`, {
          attr_name: this.editParamForm.attr_name,
          attr_sel: this.activeTab
        })
        if (res.meta.status !== 200) return this.$message.error('修改数据失败')
        this.$message.success('修改数据成功')
        this.getClassParams()
        this.editParamDialogVisible = false
      })
    },
    /* 删除参数/属性功能实现 */
    async removeParam (id) {
      const confirm = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirm !== 'confirm') return this.$message.info('删除已取消')
      const { data: res } = await this.$http.delete(`categories/${this.paramsId}/attributes/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.getClassParams()
    },
    /* 动态编辑标签时输入框状态下的监听事件 */
    handleInputConfirm (row) {
      if (row.inputValue.trim() === '') {
        row.inputValue = ''
        row.inputVisible = false
      } else {
        row.attr_vals.push(row.inputValue.trim())
        this.saveAttrVals(row)
        row.inputVisible = false
      }
    },
    /* 动态编辑标签时按钮状态下的监听事件 */
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInputRef.$refs.input.focus()
      })
    },
    /* 删除Tag功能实现 */
    async removeTag (index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    },
    /* 动态保存最新的attr_vals至数据库 */
    async saveAttrVals (row) {
      const { data: res } = await this.$http.put(`categories/${this.paramsId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: this.activeTab,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) return this.$message.error('更新标签失败')
      this.$message.success('更新标签成功')
    }

  },
  computed: {
    /* 计算级联选中项的选项是否为三级 */
    goodClassIsThree () {
      if (this.goodClassKey.length === 3) {
        return false
      } else {
        return true
      }
    },
    /* 计算获取分类参数数据所需的get参数-id值 */
    paramsId () {
      if (this.goodClassKey.length === 3) return this.goodClassKey[2]
      return null
    },
    /* 计算添加参数/属性dialog框的title属性值 */
    titleText () {
      if (this.activeTab === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style scoped>
  .goodSelect{
    margin: 20px 0;
  }
  .el-tag{
    margin-right: 15px;
  }
  .input-new-tag{
    width: 130px;
  }
</style>
