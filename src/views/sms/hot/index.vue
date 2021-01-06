<template>
  <div class="app-container city-setting-container">
    <el-tabs v-model="activeName" @tab-click="handleClick" class="tab-container">
      <el-tab-pane label="City" name="first" style="height: 100%;">
        <cityBranch v-if="activeName==='first'"></cityBranch>
      </el-tab-pane>
      <el-tab-pane label="Zone" name="second">
        <cityZone v-if="activeName==='second'"></cityZone>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  // import { getAreaList, addArea, updateArea, deleteArea, getTheDepot, addDepot, updateDepot, deleteDepot } from '@/api/branch'
  import cityBranch from './cityBranch.vue'
  import cityZone from './cityZone.vue'
  export default {
    name: "menuList",
    components:{ cityBranch,cityZone },
    data() {
      return {
        activeName: 'first'
      }
    },
    methods: {
      handleClick(tab, event) {
        console.log(this.activeName)
        console.log(tab, event);
      }
    }

  }
</script>

<style lang="scss">
  .city-setting-container{
    height: calc(100vh - 50px);
    .tab-container{
      height: 100%;
      .el-tabs__content{
        height: calc(100% - 55px);
      }
    }
  }
</style>
