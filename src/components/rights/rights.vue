<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table
        :data="rightsData"
        style="width: 100%"
        :border="true"
        :stripe="true">
        <el-table-column
          type="index"
          label="#" width="50px">
        </el-table-column>
        <el-table-column
          prop="authName"
          label="权限名称">
        </el-table-column>
        <el-table-column
          prop="path"
          label="路径">
        </el-table-column>
        <el-table-column
          prop="level"
          label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag type="success" v-if="scope.row.level==='1'">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.level==='2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsData: []
    }
  },
  created () {
    this.getRightsData()
  },
  methods: {
    async getRightsData () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message({ type: 'error', message: res.meta.msg })
      this.rightsData = res.data
    }
  }
}
</script>

<style scoped>
</style>
