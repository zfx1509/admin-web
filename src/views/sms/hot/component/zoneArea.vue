<template>
  <div class="zoneArea-container">
    <el-dialog :title="zones.title" :visible.sync="dialogZoneVisible" width="700px">
      <el-tabs v-model="activeName"  tab-position="left" style="height: 320px;" class="zoneArea-tab">
        <el-tab-pane label="Zone 1" name="zone1">
          <span class="el-icon-map-location"></span>
          <span>{{ citys.city }} {{ citys.province }}</span>
        </el-tab-pane>
        <el-tab-pane label="Zone 2" name="zone2">
          <el-tree
            ref="zoneTwoTree"
            class="zoneArea-tree"
            node-key="areaId"
            :data="areas"
            :props="defaultProps"
            accordion
            show-checkbox>
          </el-tree>
        </el-tab-pane>
        <el-tab-pane label="Zone 3" name="zone3">
          <el-tree
            ref="zoneThreeTree"
            class="zoneArea-tree"
            node-key="areaId"
            :data="areas"
            :props="defaultProps"
            accordion
            show-checkbox>
          </el-tree>
        </el-tab-pane>
        <el-tab-pane label="Zone 4" name="zone4">
          <el-tree
            ref="zoneFourTree"
            class="zoneArea-tree"
            node-key="areaId"
            :data="areas"
            :props="defaultProps"
            accordion
            show-checkbox>
          </el-tree>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogZoneVisible = false">cancel</el-button>
        <el-button type="primary" :loading="loading" @click="confirmOpreateZone">confirm</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { addZone, updateZone } from '@/api/branch.js'
  export default{
    props:["areas","citys","zones"],
    data(){
      return{
        dialogZoneVisible: false,
        activeName: "zone1",
        defaultProps: {
          children: 'children',
          label: 'areaName'
        },
        loading: false,
        zoneList:{
          id:'',
          zoneOne:'',
          zoneTwo:'',
          zoneThree: '',
          zoneFour: ''
        }
      }
    },
    watch:{
      dialogZoneVisible(val){
        if(val){
          this.$nextTick(()=>{
            this.$refs.zoneTwoTree.setCheckedKeys(this.zones.zoneTwo.split(','))
            this.$refs.zoneThreeTree.setCheckedKeys(this.zones.zoneThree.split(','))
            this.$refs.zoneFourTree.setCheckedKeys(this.zones.zoneFour.split(','))
          })
        }
      }
    },
    methods:{
      confirmOpreateZone(){
        this.zoneList.id = this.zones.id
        this.zoneList.zoneOne = this.citys.cityId

        this.loading = true
        // checked zone 2
        let twoZone = []
        let threeZone = []
        let fourZone = []

        this.$refs.zoneTwoTree.getCheckedNodes().forEach(item=>{
          if(item.level===2){
            twoZone.push(item.areaId)
          }
        })
        this.zoneList.zoneTwo = twoZone.join()


        // checked zone 3
        this.$refs.zoneThreeTree.getCheckedNodes().forEach(item=>{
          if(item.level===2){
            threeZone.push(item.areaId)
          }
        })
        this.zoneList.zoneThree = threeZone.join()


        // checked zone 4
        this.$refs.zoneFourTree.getCheckedNodes().forEach(item=>{
          if(item.level===2){
            fourZone.push(item.areaId)
          }
        })
        this.zoneList.zoneFour = fourZone.join()

        if(this.zones.title === "Add Zone"){
          // 添加
          addZone(this.zoneList).then(res=>{
            if(res.code === 200){
              this.loading = false
              this.$message.success('set success!');
            }else{
              this.$message.fail(res.message);
            }
            this.dialogZoneVisible = false
          })
        }else if(this.zones.title === "Edit Zone"){
          updateZone(this.zoneList).then(res=>{
            console.log(res.data)
            if(res.code === 200){
              this.loading = false
              this.$message.success('set success!');
            }else{
              this.$message.fail(res.message);
            }
            this.dialogZoneVisible = false
          })
        }

      }
    }
  }
</script>

<style lang="scss">
  .zoneArea-container{
    .zoneArea-tab{

      .el-tabs__content{
        height: 100%;
        overflow-y: auto;
      }
    }
    .zoneArea-tree{

    }
  }
</style>
