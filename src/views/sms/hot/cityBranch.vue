<template>
  <div class="app-container branch-container">
    <div class="tree-container">
      <el-input
        placeholder="search state"
        v-model="areaText">
      </el-input>
      <div class="tree-list">
        <div style="text-align: right;">
          <el-button plain type="danger" size="mini" @click="handleAddState">Add State</el-button>
        </div>
        <el-tree
          style="margin-top: 10px;"
          :data="areaList"
          :props="defaultProps"
          accordion
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
          :filter-node-method="filterNode"
          ref="tree">
          <span class="custom-tree-node" style="width: 100%;line-height: 28px;" slot-scope="{ node, data }">
            <span style="font-size: 14px;">{{ node.label }}</span>
            <span style="float: right;">
              <el-button
                v-if="node.level===1"
                type="text"
                size="mini"
                @click="() => appendCity(data)">
                Add City
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => EditCity(data)">
                Edit
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => removeCity(data)">
                Delete
              </el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <div class="table-pane">
      <div class="table-container">
        <el-table ref="menuTable"
                  style="width: 100%"
                  :data="list"
                  border>
          <el-table-column type="index" width="50" align="center"></el-table-column>
          <el-table-column label="State" width="140" prop="province" align="left"></el-table-column>
          <el-table-column label="City" width="140" prop="city" align="left"></el-table-column>
          <el-table-column label="Depot" align="left">
            <template slot-scope="scope">
              <span v-show="scope.row.depotName" style="display: block;">
                <el-tag size="medium" type="warning" effect="plain" style="margin: 3px 0;">
                  {{ scope.row.depotName }}
                </el-tag>
                <i class="el-icon-delete"
                  @click="deleteCityDepot(scope.row.depotId)"
                  style="color:#F56C6C;margin-right: 8px;cursor: pointer;">
                </i>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="Depot Operation" width="140" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="addCityDepot(scope.row)">Add
              </el-button>
              <el-button
                size="mini"
                type="text"
                @click="editCityDepot(scope.row)">Edit
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="Zone Operation" width="140" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-setting"
                @click="setZonePop(scope.row)">setting
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- state/city pop -->
    <el-dialog :title="stateTitle" :visible.sync="dialogFormVisible" width="600px">
      <el-form :model="stateForm" label-width="90px" label-position="left">
        <el-form-item :label="addLabelName">
          <el-input v-model="stateForm.areaName" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">cancel</el-button>
        <el-button type="primary" @click="confirmOpreateArea">confirm</el-button>
      </div>
    </el-dialog>
    <!-- depot pop -->
    <el-dialog :title="depotTitle" :visible.sync="dialogDepotVisible" width="600px">
      <el-form :model="depotForm" label-width="80px" label-position="left">
        <el-form-item label="Depot">
          <el-input v-model="depotForm.depotName" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDepotVisible = false">cancel</el-button>
        <el-button type="primary" @click="confirmOpreateDepot">confirm</el-button>
      </div>
    </el-dialog>
    <!-- zone setting -->
    <cityBranch ref="zoneAreaDialog" :areas="dialogArea" :citys="cityObj" :zones="zoneList"></cityBranch>
  </div>
</template>

<script>
  import {
    getAreaList,
    addArea,
    updateArea,
    deleteArea,
    getTheDepot,
    addDepot,
    updateDepot,
    deleteDepot,
    queryZoneList
  } from '@/api/branch'
  import cityBranch from "./component/zoneArea.vue"
  export default {
    name: "menuList",
    components:{ cityBranch },
    data() {
      return {
        areaText:'',
        areaList:[],
        defaultProps: {
          children: 'children',
          label: 'areaName'
        },
        dialogFormVisible:false,
        isAdd: true,
        stateTitle:'Add State',
        addLabelName:'State Name',
        stateForm:{
          "areaId": '',
          "areaName": "",
          "level": 0,
          "parentId": 0
        },
        list: [],
        depotTitle:'Add State',
        dialogDepotVisible:false,
        depotForm:{
          "city": "",
          "cityId": "",
          "depotId": "",
          "depotName": "",
          "province": "",
          "provinceId": ""
        },
        dialogArea: [],
        cityObj: {},
        zoneList:{}
      }
    },
    created() {
      // this.resetParentId();
      // this.getList();
      this.getAllAreaTreeList()
    },
    watch: {
      $route(route) {
        // this.resetParentId();
      },
      areaText(val) {
        this.$refs.tree.filter(val);
      }
    },
    methods: {
      // 过滤节点
      filterNode(value, data) {
        if (!value) return true;
        return data.areaName.indexOf(value) !== -1;
      },
      // 获取所有地区树形列表
      getAllAreaTreeList(){
        getAreaList().then(res=>{
          this.areaList = res.data
        })
      },
      // add state
      handleAddState() {
        this.stateForm = {
          "areaId": '',
          "areaName": "",
          "level": 1,
          "parentId": 0
        }
        this.stateTitle = "add State"
        this.addLabelName = 'State Name'
        this.dialogFormVisible = true
      },
      // 新增state/city
      appendCity(data) {
        this.stateForm = {
          "areaId": '',
          "areaName": "",
          "level": 2,
          "parentId": data.areaId
        }
        this.isAdd = true
        this.stateTitle = "Add City"
        this.addLabelName = 'City Name'
        this.dialogFormVisible = true
      },
      // 修改state/city
      EditCity(data){
        this.stateForm = {
          "areaId": data.areaId,
          "areaName": data.areaName,
          "level": 1,
          "parentId": data.parentId
        }
        if(data.level===1){
          this.stateTitle = "Edit State"
          this.addLabelName = 'State Name'
          this.stateForm.level = 1
        }else if(data.level === 2){
          this.stateTitle = "Edit City"
          this.addLabelName = 'City Name'
          this.stateForm.level = 2
        }
        this.isAdd = false
        this.dialogFormVisible = true
      },
      // 新增state
      confirmOpreateArea(){
        if(this.isAdd){
          addArea(this.stateForm).then(res=>{
            this.dialogFormVisible = false
            this.$message.success('add success!');
            // 重新获取所有地址列表
            this.getAllAreaTreeList()
          })
        }else{
          updateArea(this.stateForm).then(res=>{
            this.dialogFormVisible = false
            this.$message.success('edit success!');
            // 重新获取所有地址列表
            this.getAllAreaTreeList()
          })
        }

      },
      // 删除state/city
      removeCity(data) {
        this.$confirm('This operation will permanently delete this node. Do you want to continue ?', 'tips', {
          confirmButtonText: 'confirm',
          cancelButtonText: 'cancel',
          type: 'warning'
        }).then(() => {
          let areaId = data.areaId
          deleteArea(areaId).then(res=>{
            if(res.code===200){
              this.$message.success('delete success')
              this.getAllAreaTreeList()
            }else{
              this.$message.error(res.message)
            }
          })
        }).catch(() => {});
      },
      // 点击节点
      handleNodeClick(data,node){
        if(data.level===2){
          this.list = [{
            "city": data.areaName,
            "cityId": data.areaId,
            "depotId": '',
            "depotName": "",
            "province": node.parent.data.areaName,
            "provinceId": node.parent.data.areaId
          }]
          this.fetchCityDepot(data.areaId)
        }
      },
      // 获取某个城市下的depot
      fetchCityDepot(id){
        getTheDepot(id).then(res=>{
          if(res.data.length && res.data[0].cityId===this.list[0].cityId){
            this.list = res.data
          }
        })
      },
      addCityDepot(data){
        this.depotForm = {
          "city": data.city,
          "cityId": data.cityId,
          "depotId": "",
          "depotName": "",
          "province": data.province,
          "provinceId": data.provinceId
        }
        this.depotTitle = "Add Depot"
        this.dialogDepotVisible = true
      },
      editCityDepot(data){
        this.depotForm = {
          "city": data.city,
          "cityId": data.cityId,
          "depotId": data.depotId,
          "depotName": data.depotName,
          "province": data.province,
          "provinceId": data.provinceId
        }
        this.depotTitle = "Edit Depot"
        this.dialogDepotVisible = true
      },
      // 确定新增/修改depot
      confirmOpreateDepot(){
        if(this.depotTitle === 'Add Depot'){
          addDepot(this.depotForm).then(res=>{
            this.dialogDepotVisible = false
            this.$message.success('add depot success!');
            // 重新获取城市depot信息
            this.fetchCityDepot(this.depotForm.cityId)
          })
        }else if(this.depotTitle === 'Edit Depot'){
          updateDepot(this.depotForm).then(res=>{
            this.dialogDepotVisible = false
            this.$message.success('edit depot success!');
            // 重新获取城市depot信息
            this.fetchCityDepot(this.depotForm.cityId)
          })
        }
      },
      // 删除城市的depot
      deleteCityDepot(id){
        this.$confirm('This operation will permanently delete this depot. Do you want to continue ?', 'tips', {
          confirmButtonText: 'confirm',
          cancelButtonText: 'cancel',
          type: 'warning'
        }).then(() => {
          deleteDepot(id).then(res=>{
            if(res.code===200){
              this.$message.success('delete depot success')
              this.fetchCityDepot()
            }else{
              this.$message.error(res.message)
            }
          })
        }).catch(() => {});

      },
      // 显示zone配置弹窗
      setZonePop(data){
        queryZoneList(data.cityId).then(res=>{
          if(res.data.length){
            this.zoneList = res.data[0]
            this.zoneList.title = "Edit Zone"
          }else{
            this.zoneList = {
              id:'',
              zoneOne: data.cityId,
              zoneTwo: '',
              zoneThree: '',
              zoneFour: '',
              title: 'Add Zone'
            }
          }
          this.dialogArea = this.areaList
          this.cityObj = data
          this.$refs.zoneAreaDialog.dialogZoneVisible = true
        })
      },
      updateZonePop(data){

      }
    }
  }
</script>

<style lang="scss" scoped>
  .branch-container{
    padding-top: 0;
    position: relative;
    .tree-container{
      position: absolute;
      left: 20px;
      top: 0px;
      width: 300px;
      height: calc(100vh - 145px);
      // border-right: 1px solid #999;
      flex:none;
      margin-right:5px;
      .tree-list{
        height: calc(100% - 40px);
        width: 100%;
        padding-right: 10px;
        padding-top: 10px;
        box-sizing: border-box;
        overflow: auto;
      }
    }
    .table-pane{
      padding-left: 305px;
    }
  }
</style>
