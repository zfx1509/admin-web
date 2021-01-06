<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <!-- <i class="el-icon-search"></i>
        <span>query</span> -->
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          search
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          reset
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="Email：">
            <el-input v-model="listQuery.email" class="input-width" placeholder="email"></el-input>
          </el-form-item>
          <el-form-item label="userType：">
            <el-select v-model="listQuery.category" placeholder="user type" class="input-width">
              <el-option v-for="item in userTypeTOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>users</span>
    </el-card>
    <div class="table-container">
      <el-table ref="newSubjectTable"
                :data="list"
                style="width: 100%;"
                border>
        <el-table-column type="index" width="50" align="center"></el-table-column>
        <el-table-column label="Name" prop="username" align="left"></el-table-column>
        <el-table-column label="Phone" width="200" prop="phone" align="left"></el-table-column>
        <el-table-column label="Email" prop="email" align="left"></el-table-column>
        <el-table-column label="Balance" prop="balance" align="left"></el-table-column>
        <el-table-column label="Type" width="140" prop="category" align="left">
          <template slot-scope="scope">
            <el-tag v-show="scope.row.category===0" size="medium" type="danger" effect="plain" style="margin: 3px 0;">
              {{ userTypeArr[scope.row.category] }}
            </el-tag>
            <el-tag v-show="scope.row.category===1" size="medium" type="warning" effect="plain" style="margin: 3px 0;">
              {{ userTypeArr[scope.row.category] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Accout Operation" width="150" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleEditAccount(scope.row)">Edit Account
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="User Operation" width="160" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleEditUser(scope.row)">Edit
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleRestUserPass(scope.row)">Reset Password
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="Delete" width="100" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="danger"
                       plain
                       @click="handleDeleteUser(scope.row)">Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[10,30,100]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
    <!-- account pop-->
    <el-dialog title="charge" :visible.sync="dialogAccountVisible" width="600px">
      <el-form :model="accountForm" label-width="90px" label-position="left">
        <el-form-item label="account">
          <el-input v-model="accountForm.number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">cancel</el-button>
        <el-button type="primary" @click="charge">confirm</el-button>
      </div>
    </el-dialog>
    <!-- user pop -->
    <el-dialog title="Edit User" :visible.sync="dialogUserVisible" width="600px">
      <el-form ref="userForm" :model="userForm" :rules="userFormRule" label-width="90px" label-position="left">
        <!--        <el-form-item label="ABN" prop="aba" v-if="userForm.category===0">-->
        <!--          <el-input v-model="userForm.aba" ></el-input>-->
        <!--        </el-form-item>-->
        <el-form-item label="Name" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="Phone" prop="phone">
          <el-input v-model="userForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="Name" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="userType" prop="category">
          <el-select v-model="userForm.category" placeholder="user type" class="input-width">
            <el-option v-for="item in userTypeTOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUserVisible = false">cancel</el-button>
        <el-button type="primary" @click="confirmOpreateUser('userForm')">confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {getUserList, updateUser, deleteUser, alterAccount} from '@/api/users.js';

export default {
  name: 'homeSubjectList',
  data() {
    return {
      listQuery: {pageNum: 1, pageSize: 10, email: '', category: ""},
      list: null,
      total: null,
      userTypeArr: ["Ordinary User", "Business User"],
      userTypeTOptions: [{
        value: 0,
        label: "Ordinary User"
      }, {
        value: 1,
        label: "Business User"
      }],
      dialogAccountVisible: false,
      accountForm: {number: ''},
      selectId: "",
      dialogUserVisible: false,
      userForm: {
        aba: '',
        username: '',
        phone: '',
        email: '',
        category: 0
      },
      userFormRule: {
        aba: [
          {required: true, message: 'ABN is required', trigger: 'blur'}
        ],
        username: [
          {required: true, message: 'Name is required', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: 'Phone is required', trigger: 'blur'}
        ],
        email: [
          {required: true, message: 'Email is required', trigger: 'blur'}
        ],
        category: [
          {required: true, message: 'User Type is required', trigger: 'change'}
        ]
      }
    }
  },
  created() {
    this.getUsers(this.listQuery);
  },
  methods: {
    charge() {
      alterAccount(this.selectId, {status: parseInt(this.accountForm.number)})
      this.dialogAccountVisible = false
      this.selectId = ""
    },
    getUsers(data) {
      getUserList(data).then(res => {
        this.list = res.data.list
        console.log(res)
        this.total = res.data.total
      })
    },
    handleResetSearch() {
      this.listQuery = {pageNum: 1, pageSize: 10, email: '', category: ""}
      this.getUsers(this.listQuery)
    },
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getUsers(this.listQuery);
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getUsers(this.listQuery)
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getUsers(this.listQuery)
    },
    // 修改余额
    handleEditAccount(row) {
      this.dialogAccountVisible = true
      this.selectId = row.id
    },

    handleDeleteUser(row) {
      this.$confirm('This operation will permanently delete this user. Do you want to continue ?', 'tips', {
        confirmButtonText: 'confirm',
        cancelButtonText: 'cancel',
        type: 'warning'
      }).then(() => {
        deleteUser(row.id).then(res => {
          if (res.code === 200) {
            this.$message.success('delete user success')
            this.getUsers(this.listQuery)
          } else {
            this.$message.error(res.message)
          }
        })
      }).catch(() => {
      });
    },
    handleRestUserPass(row) {
      updateUser({password: 'StarX123456', id: row.id}).then(res => {
        this.$message.success('password is reset as StarX123456 !');
      })
    },
    handleEditUser(row) {
      this.userForm = {
        id: row.id,
        aba: row.aba,
        username: row.username,
        phone: row.phone,
        email: row.email,
        category: row.category
      }
      this.dialogUserVisible = true
    },
    confirmOpreateUser(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateUser(this.userForm).then(res => {
            this.dialogUserVisible = false
            this.$message.success('edit user success!');
            // 重新获取所有zone fee列表
            this.getUsers(this.listQuery)
          })
        }
      })
    }
  }
}
</script>
<style></style>
