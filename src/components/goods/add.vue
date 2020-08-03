<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
     <!-- alert警告-->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon>
      </el-alert>
      <!--步骤条-->
      <el-steps :active="activeIndex-0" align-center finish-status="success">
        <el-step title="基本信息" ></el-step>
        <el-step title="商品参数" ></el-step>
        <el-step title="商品属性" ></el-step>
        <el-step title="商品图片" ></el-step>
        <el-step title="商品内容" ></el-step>
        <el-step title="完成" ></el-step>
      </el-steps>
      <!--表单结构-->
      <el-form :model="addGoodsForm" :rules="addGoodsRules" ref="addGoodsRef" label-position="top">
      <!--选项卡-->
      <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="leaveTab" @tab-click="tabChange">
        <el-tab-pane label="基本信息" name="0">
          <!--基本信息表单区域-->
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addGoodsForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addGoodsForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addGoodsForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addGoodsForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <!--级联选择-->
            <el-cascader
              v-model="goodsClassListKey"
              :options="goodsClassList"
              :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children'}"
              @change="goodsClassChange"></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item :label="item.attr_name" v-for="(item,index) in manyParamsList" :key="index">
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox :label="items" v-for="(items,index2) in item.attr_vals" :key="index2" border></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item :label="item3.attr_name" v-for="(item3,index3) in onlyParamsList" :key="index3">
            <el-input v-model="item3.attr_vals"></el-input>
          </el-form-item>
          </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            class="upload-demo"
            action="http://api.zreai.com:606/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            :headers="uploadHeader" :on-success="uploadSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor v-model="addGoodsForm.goods_introduce">
          </quill-editor>
          <el-button type="primary" class="addBtn" @click="addGoods">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
      </el-form>
      <el-dialog
        title="缩略图"
        :visible.sync="dialogVisible"
        width="50%">
        <img :src="src" alt="" class="picUpload">
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      /* 步骤进行到的index */
      activeIndex: 0,
      /* 添加商品信息列表 */
      addGoodsForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        goods_cat: '',
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      /* 商品分类列表 */
      goodsClassList: [],
      /* 级联选择器选中项的id值数组 */
      goodsClassListKey: [],
      /* 动态参数列表 */
      manyParamsList: [],
      /* 静态属性列表 */
      onlyParamsList: [],
      /* 设置上传请求头中的token */
      uploadHeader: {
        authorization: window.sessionStorage.getItem('token')
      },
      /* 缩略图dialog显示 */
      dialogVisible: false,
      /* 缩略图dialog图片url地址 */
      src: '',
      /* 表单验证 */
      addGoodsRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
        // goods_cat: [
        //   { required: true, message: '请选择商品分类', trigger: 'blur' }
        // ]
      }
    }
  },
  created () {
    this.getGoodsClass()
  },
  methods: {
    /* 获取商品分类列表 */
    async getGoodsClass () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('获取商品分类数据失败')
      this.goodsClassList = res.data
    },
    /* 级联选择器选中项改变时触发 */
    goodsClassChange () {
      if (this.goodsClassListKey.length !== 3) {
        this.goodsClassListKey = []
      }
    },
    /* 选项卡切换条件禁止监听 */
    leaveTab (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.goodsClassListKey.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    /* 选项卡切换事件 */
    async tabChange () {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.paramsId}/attributes`, {
          params: { sel: 'many' }
        })
        if (res.meta.status !== 200) return this.$message.error('获取数据失败')
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.manyParamsList = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.paramsId}/attributes`, {
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) return this.$message.error('获取数据失败')
        this.onlyParamsList = res.data
      }
    },
    /* 上传图片操作查看缩略图 */
    handlePreview (file) {
      this.src = file.response.data.url
      this.dialogVisible = true
    },
    /* 上传图片操作删除图片 */
    handleRemove (file) {
      console.log(file)
      const filePath = file.response.data.tmp_path
      const index = this.addGoodsForm.pics.findIndex(item => item === filePath)
      this.addGoodsForm.pics.splice(index, 1)
    },
    /* 图片上传成功后触发 */
    uploadSuccess (response) {
      const picsPath = { pic: response.data.tmp_path }
      this.addGoodsForm.pics.push(picsPath)
    },
    /* 添加商品提交 */
    addGoods () {
      this.$refs.addGoodsRef.validate(async valid => {
        if (!valid) return this.$message.error('请先填完必填项')
        this.addGoodsForm.goods_cat = this.goodsClassListKey.join(',')
        let manyIfo = {}
        this.manyParamsList.forEach(item => {
          manyIfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addGoodsForm.attrs.push(manyIfo)
        })
        let onlyIfo = {}
        this.onlyParamsList.forEach(item => {
          onlyIfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addGoodsForm.attrs.push(onlyIfo)
        })
        const { data: res } = await this.$http.post('goods', this.addGoodsForm)
        if (res.meta.status !== 201) this.$message.error('产品添加失败')
        this.$message.success('产品添加成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    /* 计算级联选择器选中项的ID值 */
    paramsId () {
      if (this.goodsClassListKey.length === 3) {
        return this.goodsClassListKey[2]
      }
      return null
    }
  }
}
</script>

<style scoped lang="less">
  .el-steps{
    margin: 25px 0;
  }
  .el-tabs--left .el-tabs__header.is-left{
    margin-right: 30px!important;
  }
  .el-checkbox{
    margin: 0 10px 0 0;
  }
  .picUpload{
    width: 750px;
  }
  .addBtn{
    margin-top: 20px;
  }
</style>
