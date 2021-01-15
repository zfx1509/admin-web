<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <!-- <i class="el-icon-tickets" style="margin-top: 5px"></i> -->
      <span style="margin-top: 5px">Ladder List</span>
      <el-button
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
        <el-table-column label="minSize(L)" align="left">
          <template slot-scope="scope">{{ scope.row.minSize }} L</template>
        </el-table-column>
        <el-table-column label="maxSize(L)" prop="maxSize" align="left">
          <template slot-scope="scope">{{ scope.row.maxSize }} L</template>
        </el-table-column>
        <el-table-column label="minWeight(KG)" prop="minWeight" align="left">
          <template slot-scope="scope">{{ scope.row.minWeight }} KG</template>
        </el-table-column>
        <el-table-column label="maxWeight(KG)" prop="maxWeight" align="left">
          <template slot-scope="scope">{{ scope.row.maxWeight }} KG</template>
        </el-table-column>
        <el-table-column label="comment" prop="comment" align="left">
          <template slot-scope="scope">{{ scope.row.comment }}</template>
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
    <el-dialog :title="feeTitle" :visible.sync="dialogFeeVisible" width="700px">
      <el-form :model="feeForm" :rules="rules" label-width="100px" label-position="left" ref="feeForm">
        <el-form-item label="comment" prop="comment">
          <el-input v-model.trim="feeForm.comment"></el-input>
        </el-form-item>
        <el-form-item label="minSize" prop="minSize">
          <el-input v-model.trim="feeForm.minSize"></el-input>
        </el-form-item>
        <el-form-item label="maxSize" prop="maxSize">
          <el-input v-model.trim="feeForm.maxSize"></el-input>
        </el-form-item>
        <el-form-item label="minWeight" prop="minWeight">
          <el-input v-model.trim="feeForm.minWeight"></el-input>
        </el-form-item>
        <el-form-item label="maxWeight" prop="maxWeight">
          <el-input v-model.trim="feeForm.maxWeight"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFeeVisible = false">cancel</el-button>
        <el-button type="primary" @click="confirmOpreateZoneFee('feeForm')">confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchFeeList,
  getLadderLevel,
  addLadder,
  updateLadderLevel,
  deleteLadder,
  getListByAreaId,
  getListByAreaLevel
} from '@/api/branch'

export default {
  name: "menuList",
  data() {
    return {
      dialogFeeVisible: false,
      feeTitle: "Add Fee",
      feeForm: {
        "comment": "",
        "id": '',
        "minSize": "",
        "maxSize": '',
        "minWeight": '',
        "maxWeight": ''
      },
      selectArea: "",
      rules: {
        comment: [
          {required: true, message: 'comment is required', trigger: 'blur'}
        ],
        minSize: [
          {required: true, message: 'minSize is required', trigger: 'blur'}
        ],
        maxSize: [
          {required: true, message: 'maxSize is required', trigger: 'blur'}
        ],
        minWeight: [
          {required: true, message: 'minWeight is required', trigger: 'blur'}
        ],
        maxWeight: [
          {required: true, message: 'maxWeight is required', trigger: 'blur'}
        ]
      },
      list: [],
      citiesList: []
    }
  },
  created() {
    this.getList()
  },
  watch: {
    $route(route) {
    }
  },
  methods: {
    getList() {
      getLadderLevel().then(res => {
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
        "comment": "",
        "minSize": '',
        "maxSize": '',
        "minWeight": '',
        "maxWeight": ''
      }
      this.feeTitle = "Add Fee"
      this.dialogFeeVisible = true
    },
    // update
    handleUpdate(row) {
      this.feeForm = {
        "comment": row.comment,
        "id": row.id,
        "minSize": row.minSize,
        "maxSize": row.maxSize,
        "minWeight": row.minWeight,
        "maxWeight": row.maxWeight
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
        deleteLadder(row.id).then(res => {
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
            addLadder(this.feeForm).then(res => {
              this.dialogFeeVisible = false
              this.$message.success('edit success!');
              // 重新获取所有zone fee列表
              this.getList()
            })
          } else if (this.feeTitle === "Edit Fee") {
            updateLadderLevel(this.feeForm).then(res => {
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
