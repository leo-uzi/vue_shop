<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <el-row :gutter="20">
        <!--搜索框-->
        <el-col :span="6">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryIfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <!--添加按钮-->
        <el-col :span="3">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!--表格区域-->
        <el-table
          :data="tableData"
          style="width: 100%"
          border stripe>
          <el-table-column type="index" label="#">
          </el-table-column>
          <el-table-column
            prop="goods_name"
            label="商品名称"
          width="500px">
          </el-table-column>
          <el-table-column
            prop="goods_price"
            label="商品价格">
          </el-table-column>
          <el-table-column
            prop="goods_weight"
            label="商品重量">
          </el-table-column>
          <el-table-column
            prop="add_time"
            label="商品时间" width="150px">
            <template slot-scope="scope">
              {{scope.row.add_time|format}}
            </template>
          </el-table-column>
          <el-table-column
            label="商品操作" width="200px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editList(scope.row)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeList(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      <!--编辑功能dialog-->
      <el-dialog
        title="编辑商品"
        :visible.sync="goodListDialogVisible"
        width="50%">
        <el-form :model="listForm" :rules="listRules" ref="listRef" label-width="100px">
          <el-form-item label="商品id">
            <el-input v-model="list_id" disabled></el-input>
          </el-form-item>
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="listForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="listForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="listForm.goods_weight"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="goodListDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCommit">确 定</el-button>
        </span>
      </el-dialog>
      <!--分页器-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryIfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryIfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  /* 数据 */
  data () {
    return {
      tableData: [],
      queryIfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      /* dialog显示 */
      goodListDialogVisible: false,
      /* 表单数据 */
      listForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      /* 表单ID值 */
      list_id: '',
      /* dialog表单验证规则 */
      listRules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  /* 生命周期函数在组件加载完成便执行 */
  created () {
    this.getGoodsList()
  },
  methods: {
    /* 获取商品列表数据 */
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryIfo })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.tableData = res.data.goods
      this.total = res.data.total
      console.log(new Date(
        1514259448))
    },
    /* 显示页面数量改变时触发 */
    handleSizeChange (newSize) {
      this.queryIfo.pagesize = newSize
      this.getGoodsList()
    },
    /* 当前页面改变时触发 */
    handleCurrentChange (newPage) {
      this.queryIfo.pagenum = newPage
      this.getGoodsList()
    },
    /* 添加商品监听跳转页面 */
    addGoods () {
      this.$router.push('/goods/add')
    },
    /* 删除列表 */
    async removeList (row) {
      const confirm = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirm !== 'confirm') return this.$message.info('去删删除操作')
      const { data: res } = await this.$http.delete(`goods/${row.goods_id}`)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.getGoodsList()
      this.$message.success('删除成功')
    },
    /* 编辑商品列表dialog */
    async editList (row) {
      const { data: res } = await this.$http.get(`goods/${row.goods_id}`)
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.list_id = row.goods_id
      this.listForm = res.data
      this.goodListDialogVisible = true
    },
    /* 编辑确定提交 */
    editCommit () {
      this.$refs.listRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`goods/${this.list_id}`, this.listForm)
        if (res.meta.status !== 200) return this.$message.error('修改数据失败')
        this.getGoodsList()
        this.goodListDialogVisible = false
        this.$message.success('修改成功')
      })
    }
  }
}
</script>

<style scoped>

</style>
