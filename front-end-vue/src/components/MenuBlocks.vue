<template>
  <div id="body">
    <div id="title">
      <span>Blocks</span>
    </div>
    <div id="table">
      <table>
        <tr v-for="(block, index) in blocks" class="row" :key="index">
          <td>
            <span>{{ block.blockName }}</span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
export default Vue.extend({
  name: "MenuFriends",
  data() {
    return {
      blocks: null
    };
  },
  mounted() {
    axios({
      url: `${ process.env.VUE_APP_API_URL }/block/index`,
      method: "get",
      withCredentials: true
    }).then(res => {
      this.blocks = res.data;
    });
  }
});
</script>

<style scoped>
#body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  width: 80%;
  height: 40%;
}

#title {
  width: 100%;
  font-weight: bold;
  background-color: #3040F0;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

#title span {
  color: white;
  font-size: 1.4rem;
}

#table {
  width: 100%;
  overflow-y: auto;
}

table {
  table-layout: fixed;
  width: 100%;
  background-color: white;
  padding-bottom: 2%;
  padding-top: 2%;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}

table tr:nth-child(odd) td {
  background-color: #ebebeb;
}

tr {
  width: 100%;
}

td span {
  padding: 3%;
  text-align: left;
  /*overflow: hidden;
   text-overflow: ellipsis; */
}

.row {
  height: 10%;
  width: 100%;
  display: flex;
  justify-content: space-around;
}

table td {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 75%;
}

@media (max-width: 770px) {
  #body {
    height: 90%;
    max-height: 200px;
    margin: 10px;
  }

  table {
    min-height: 15px;
  }
}

</style>
