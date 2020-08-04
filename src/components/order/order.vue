<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <!--搜索框-->
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--表格-->
      <el-table :data="orderList" stripe border>
        <el-table-column type="index" label="#" width="50px"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="700px"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="120px"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="120px">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status==='0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="120px"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="200px">
          <template slot-scope="scope">
            {{scope.row.create_time|format}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog"></el-button>
            <el-button type="success" icon="el-icon-location-outline" size="mini" @click="showLogistic"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--修改地址dialog-->
      <el-dialog
        title="修改地址"
        :visible.sync="addressDialogVisible"
        width="50%" @close="addressDialogClose">
        <el-form :model="addressForm" :rules="addressRules" ref="addressRef" label-width="100px">
          <el-form-item label="省市区/县" prop="location">
            <!--级联选择-->
            <el-cascader
              v-model="selectAddress"
              :options="cityOption"
              :props="{ expandTrigger: 'hover' }"
              @change="handleAddressChange">
            </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="addressForm.address"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addressDialogVisible= false">取 消</el-button>
          <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!--物流信息dialog-->
      <el-dialog
        title="物流信息"
        :visible.sync="logisticDialogVisible"
        width="50%">
        <el-timeline>
          <el-timeline-item :timestamp="item.time" placement="top" v-for="(item,index) in logisticList" :key="index">
            <el-card>
              <h4>{{item.context}}</h4>
              <p>{{item.ftime}}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <span slot="footer" class="dialog-footer">
          <el-button @click="logisticDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="logisticDialogVisible = false">确 定</el-button>
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
import cityOption from './city_data2017_element'
export default {
  data () {
    return {
      /* 请求参数 */
      queryIfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      /* 订单列表 */
      orderList: [],
      total: 0,
      /* 修改地址dialog显示 */
      addressDialogVisible: false,
      logisticDialogVisible: false,
      addressForm: {
        address: ''
      },
      cityOption,
      selectAddress: '',
      logisticList: [],
      addressRules: {
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        location: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      }
    }
  },
  /* 生命周期函数 */
  created () {
    this.getOrderList()
  },
  methods: {
    /* 获取订单列表 */
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryIfo })
      if (res.meta.status !== 200) return this.$message.error('获取数据出错')
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    // 页码大小改变触发
    handleSizeChange (newSize) {
      this.queryIfo.pagesize = newSize
      this.getOrderList()
    },
    // /*当前页改变触发*/
    handleCurrentChange (newPage) {
      this.queryIfo.pagenum = newPage
      this.getOrderList()
    },
    // 修改地址dialog
    showEditDialog () {
      this.addressDialogVisible = true
    },
    /* 级联选择器选中项改变时触发 */
    handleAddressChange () {
    },
    /* 修改地址dialog关闭后重置 */
    addressDialogClose () {
      this.$refs.addressRef.resetFields()
      this.selectAddress = []
    },
    /* 物流信息dialog */
    async showLogistic () {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) return this.$message.error('获得物流数据失败')
      this.logisticList = res.data
      this.logisticDialogVisible = true
    }
  }
}
</script>

<style scoped lang="less">

</style>
