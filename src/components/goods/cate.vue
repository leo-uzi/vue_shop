<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card>
      <!--添加按钮区域-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddClass">添加分类</el-button>
        </el-col>
      </el-row>
      <!--树状表格-->
      <table-tree class="tableTree" :data="goodsList" :columns="columns" show-index index-text="#"
      :show-row-hover="false" :selection-type="false" :expand-type="false" border>
        <!--是否有效列-->
        <template slot="isEffective" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color: #3a8ee6"></i>
          <i class="el-icon-error" v-else style="color: #c20011"></i>
        </template>
        <!--排序列-->
        <template slot="sort" slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!--操作列-->
        <template slot="operation" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoodsClass(scope.row)">删除</el-button>
        </template>
      </table-tree>
      <!--添加分类dialog-->
      <el-dialog
        title="添加分类"
        :visible.sync="addClassDialogVisible"
        width="50%" @close="addClassDialogClose">
        <el-form :model="addClassForm" :rules="addClassRules" ref="addClassRef" label-width="100px">
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addClassForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <!--联级表-->
            <el-cascader
              v-model="parentClass"
              :options="parentClassList"
              :props="{ expandTrigger: 'hover',value: 'cat_id',label: 'cat_name',children: 'children'}"
              @change="addParentClassChange"
              clearable change-on-select>
            </el-cascader>
          </el-form-item>
        </el-form>
        <!--按钮区域-->
        <span slot="footer" class="dialog-footer">
        <el-button @click="addClassDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClassCommit">确 定</el-button>
        </span>
      </el-dialog>
      <!--分页器-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsIfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="goodsIfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      goodsList: [],
      goodsIfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      addClassDialogVisible: false,
      addClassForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      parentClassList: [],
      parentClass: [],
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'isEffective' },
        { label: '排序', type: 'template', template: 'sort' },
        { label: '操作', type: 'template', template: 'operation' }
      ],
      addClassRules: {
        cat_name: [
          { required: true, message: '请输入类名名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6个字符', trigger: 'blur' }
        ]
      }
    }
  },
  /* 生命周期函数来生成组件后立刻获取数据 */
  created () {
    this.getGoodsList()
  },
  methods: {
    /* 获取商品分列数据列表数据 */
    async getGoodsList () {
      const { data: res } = await this.$http.get('categories', { params: this.goodsIfo })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.goodsList = res.data.result
      this.total = res.data.total
    },
    /* 显示页变化时触发 */
    handleSizeChange (newPage) {
      this.goodsIfo.pagesize = newPage
      this.getGoodsList()
    },
    /* 当前页变化时触发 */
    handleCurrentChange (newPage) {
      this.goodsIfo.pagenum = newPage
      this.getGoodsList()
    },
    /* 添加分类dialog */
    showAddClass () {
      this.getParentClass()
      this.addClassDialogVisible = true
    },
    /* 获取父级分类数据 */
    async getParentClass () {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.parentClassList = res.data
    },
    /* 分类选中项切换时触发 */
    addParentClassChange () {
      if (this.parentClass.length !== 0) {
        this.addClassForm.cat_pid = this.parentClass[this.parentClass.length - 1]
        this.addClassForm.cat_level = this.parentClass.length
      } else {
        this.addClassForm.cat_pid = 0
        this.addClassForm.cat_level = 0
      }
    },
    /* 添加分类功能实现 */
    addClassCommit () {
      this.$refs.addClassRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addClassForm)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败')
        this.$message.success('添加分类成功')
        this.getGoodsList()
        this.addClassDialogVisible = false
      })
    },
    /* 添加分类dialog关闭时内容重置 */
    addClassDialogClose () {
      this.$refs.addClassRef.resetFields()
      this.parentClass = []
      this.addClassForm.cat_level = 0
      this.addClassForm.cat_pid = 0
    },
    async removeGoodsClass (value) {
      const confirm = await this.$confirm('此操作将永久删除该商品分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirm === 'confirm') {
        const { data: res } = await this.$http.delete(`categories/${value.cat_id}`)
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功')
        this.goodsIfo.pagenum = 1
        this.getGoodsList()
      }
    }
  }
}
</script>

<style scoped>
  .tableTree{
    margin-top: 15px;
  }
  .el-cascader{
    width: 100%;
  }
</style>
