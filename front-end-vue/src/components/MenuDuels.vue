<template>
  <div id="body">
    <div id="title">
      <span>Menu Duels</span>
    </div>
    <div id="table">
      <table>
        <tr class="row">
          <!--<tr class="row" v-for="(block, index) in blocks" class="row" :key="index">-->
          <td>
            <span>Clement</span>
          </td>
          <td>
            <button style="cursor:pointer;">V</button>
            <button style="cursor:pointer;">X</button>
          </td>
        </tr>
        <tr class="row">
          <!--<tr class="row" v-for="(block, index) in blocks" class="row" :key="index">-->
          <td>
            <span>Clement</span>
          </td>
          <td>
            <button style="cursor:pointer;">V</button>
            <button style="cursor:pointer;">X</button>
          </td>
        </tr>
        <tr class="row">
          <!--<tr class="row" v-for="(block, index) in blocks" class="row" :key="index">-->
          <td>
            <span>Clement</span>
          </td>
          <td>
            <button style="cursor:pointer;">V</button>
            <button style="cursor:pointer;">X</button>
          </td>
        </tr>
        <tr class="row">
          <!--<tr class="row" v-for="(block, index) in blocks" class="row" :key="index">-->
          <td>
            <span>Clement</span>
          </td>
          <td>
            <button style="cursor:pointer;">V</button>
            <button style="cursor:pointer;">X</button>
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
  name: "MenuDuels",
  data() {
    return {
      duels: null
    };
  },
  mounted() {
    axios({
      url: `${ process.env.VUE_APP_API_URL }/block/index`,
      method: "get",
      withCredentials: true,
      headers: {
        "Access-Control-Allow-Origin": `${ process.env.VUE_APP_API_URL }`
      }
    }).then(res => {
      this.duels = res.data;
    });
  }
});
</script>

<style scoped>
#body {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 15px;
  width: 80%;
  max-height: 45%;
}

#title {
  width: 100%;
  font-weight: bold;
  background-color: #00286e;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

#title span {
  color: white;
  font-size: 1.4rem;
}

#table {
  overflow-y: auto;
  height: 100%;
  width: 100%;
}

table {
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
  font-size:1rem;
  text-align:center;
  width: 100%;
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
  width: 45%;
}
</style>
