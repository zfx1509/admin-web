<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <!-- <i class="el-icon-tickets" style="margin-top: 5px"></i> -->
      <span style="margin-top: 5px">Zone List</span>
      <el-select v-model="selectArea" filterable @change="getList">
        <el-option
          v-for="item in citiesList"
          :key="item.areaId"
          :label="item.areaName"
          :value="item.areaId">
        </el-option>
      </el-select>
      <el-button
        :disabled="selectArea === ''"
        class="btn-add"
        @click="handleAddFee"
        size="mini">
        Add
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="menuTable"
                style="width: 100%"
                :data="list"
                border>
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column label="condition" align="left">
          <template slot-scope="scope">{{ scope.row.comment }}</template>
        </el-table-column>
        <el-table-column label="Zone 1" width="140" prop="zoneOneFee" align="left">
          <template slot-scope="scope">${{ scope.row.zoneOneFee }}</template>
        </el-table-column>
        <el-table-column label="Zone 2" width="140" prop="zoneTwoFee" align="left">
          <template slot-scope="scope">${{ scope.row.zoneTwoFee }}</template>
        </el-table-column>
        <el-table-column label="Zone 3" width="140" prop="zoneThreeFee" align="left">
          <template slot-scope="scope">${{ scope.row.zoneThreeFee }}</template>
        </el-table-column>
        <el-table-column label="Zone 4" width="140" prop="zoneFourFee" align="left">
          <template slot-scope="scope">${{ scope.row.zoneFourFee }}</template>
        </el-table-column>
        <el-table-column label="Operation" width="140" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)">Edit
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.row)">Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- feePop -->
    <el-dialog  :title="feeTitle" :visible.sync="dialogFeeVisible" width="700px">
      <el-form :model="feeForm" :rules="rules" label-width="90px" label-position="left" ref="feeForm">
        <el-form-item label="condition" prop="comment">
          <el-input v-model.trim="feeForm.comment"></el-input>
        </el-form-item>
        <el-form-item label="Zone1 Fee" prop="zoneOneFee">
          <el-input v-model.trim="feeForm.zoneOneFee"></el-input>
        </el-form-item>
        <el-form-item label="Zone2 Fee" prop="zoneTwoFee">
          <el-input v-model.trim="feeForm.zoneTwoFee"></el-input>
        </el-form-item>
        <el-form-item label="Zone3 Fee" prop="zoneThreeFee">
          <el-input v-model.trim="feeForm.zoneThreeFee"></el-input>
        </el-form-item>
        <el-form-item label="Zone4 Fee" prop="zoneFourFee">
          <el-input v-model.trim="feeForm.zoneFourFee"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">cancel</el-button>
        <el-button type="primary" @click="confirmOpreateZoneFee('feeForm')">confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {fetchFeeList, addZoneFee, updateZoneFee, deleteZoneFee, getListByAreaId, getListByAreaLevel} from '@/api/branch'

export default {
  name: "menuList",
  data() {
    return {
      dialogFeeVisible: false,
      feeTitle: "Add Fee",
      feeForm: {
        "areaId": '',
        "comment": "",
        "id": '',
        "ladderId": '',
        "zoneFourFee": '',
        "zoneOneFee": '',
        "zoneThreeFee": '',
        "zoneTwoFee": ''
      },
      selectArea: "",
      rules: {
        comment: [
          {required: true, message: 'comment is required', trigger: 'blur'}
        ],
        zoneOneFee: [
          {required: true, message: 'zoneOneFee is required', trigger: 'blur'}
        ],
        zoneTwoFee: [
          {required: true, message: 'zoneTwoFee is required', trigger: 'blur'}
        ],
        zoneThreeFee: [
          {required: true, message: 'zoneThreeFee is required', trigger: 'blur'}
        ],
        zoneFourFee: [
          {required: true, message: 'zoneFourFee is required', trigger: 'blur'}
        ]
      },
      list: [],
      citiesList: []
    }
  },
  created() {
    this.getCities();
  },
  watch: {
    $route(route) {
    }
  },
  methods: {
    getList() {
      getListByAreaId({areaId: this.selectArea}).then(res => {
        this.list = res.data
      })
    },
    getCities() {
      getListByAreaLevel({areaLevel: 2}).then(res => {
        this.citiesList = res.data
      })
    },
    // add
    handleAddFee() {
      this.feeForm = {
        "areaId": this.selectArea,
        "comment": "",
        "id": '',
        "ladderId": '',
        "zoneFourFee": '',
        "zoneOneFee": '',
        "zoneThreeFee": '',
        "zoneTwoFee": ''
      }
      this.feeTitle = "Add Fee"
      this.dialogFeeVisible = true
    },
    // update
    handleUpdate(row) {
      this.feeForm = {
        "areaId": row.areaId,
        "comment": row.comment,
        "id": row.id,
        "ladderId": row.ladderId,
        "zoneFourFee": row.zoneFourFee,
        "zoneOneFee": row.zoneOneFee,
        "zoneThreeFee": row.zoneThreeFee,
        "zoneTwoFee": row.zoneTwoFee
      }
      this.feeTitle = "Edit Fee"
      this.dialogFeeVisible = true
    },
    handleDelete(row) {
      this.$confirm('Do you want to delete this condition ?', 'tips', {
        confirmButtonText: 'confirm',
        cancelButtonText: 'cancel',
        type: 'warning'
      }).then(() => {
        deleteZoneFee(row.id).then(res => {
          if (res.code === 200) {
            this.$message.success('delete success')
            this.getList()
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(() => {
      });
    },
    //add / update zoneFee
    confirmOpreateZoneFee(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.feeTitle === "Add Fee") {
            addZoneFee(this.feeForm).then(res => {
              this.dialogFeeVisible = false
              this.$message.success('edit success!');
              // 重新获取所有zone fee列表
              this.getList()
            })
          } else if (this.feeTitle === "Edit Fee") {
            updateZoneFee(this.feeForm).then(res => {
              this.dialogFeeVisible = false
              this.$message.success('edit success!');
              // 重新获取所有zone fee列表
              this.getList()
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
