<template>
  <div class="message">
    <el-table :data="tableData" class="table">
      <el-table-column label="Type">
        <template slot-scope="scope">
          {{ type[scope.row.type] }}
        </template>
      </el-table-column>
      <el-table-column label="Name">
        <template slot-scope="scope">
          {{ scope.row.firstname + " " + scope.row.secondname }}
        </template>
      </el-table-column>
      <el-table-column label="Business Name" prop="company"></el-table-column>
      <el-table-column label="Shipments per month" prop="spm"></el-table-column>
      <el-table-column label="Track Number" prop="easyId"></el-table-column>
      <el-table-column label="Email" prop="email"></el-table-column>
      <el-table-column label="Phone" prop="phone"></el-table-column>
      <el-table-column label="Address" prop="address"></el-table-column>
      <el-table-column label="Comments" prop="opinion"></el-table-column>
      <el-table-column label="Create Time" prop="createTime"></el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next, total"
      :current-page.sync="pager.current"
      :page-size.sync="pager.size"
      :total="pager.total"
      @current-change="getList"
    >
    </el-pagination>
  </div>
</template>

<script>
const type = {
  "1": "sales",
  "2": "Customer Service",
  "3": "Franchise Enquiry"
}

import {fetchMessageList} from '@/api/message'

export default {
  name: "index",
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      fetchMessageList({
        pageNum: this.pager.current,
        pageSize: this.pager.size
      }).then(res => {
        this.tableData = res.data.list
        this.pager.total = res.data.total
      })
    }
  },
  data() {
    return {
      tableData: [],
      type,
      pager: {
        size: 10,
        current: 1,
        total: 10
      }
    }
  }
}
</script>

<style scoped lang="scss">
.table {
  width: 90%;
  margin: 0 auto;
}
</style>
