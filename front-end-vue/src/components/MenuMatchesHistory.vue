<template>
  <div id="body">
    <div id="title">
      <span>Matches History</span>
    </div>
    <div id="table">
      <table>
        <tr class="row" v-for="(match, index) in matchesHistory" :key="index">
          <td>
            <span v-if="($route.params.id == undefined && $store.state.user.name != match.winnerName) || ($route.params.id != undefined && data.name != match.winnerName)"> {{ match.winnerName }} </span>
            <span v-else> {{ match.loserName }} </span>
          </td>
          <td>
            <span>{{match.winnerPoint}} - {{match.loserPoint}} </span>
          </td>
          <td>
            <span v-if="($route.params.id == undefined && $store.state.user.name == match.winnerName) || ($route.params.id != undefined && data.name == match.winnerName)"> Win </span>
            <span v-else> Lose </span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import Vue from "vue";
import axios from "axios";
export default Vue.extend({
  name: "MenuMatchesHistory",
  props: ['data'],
  data() {
    return {
      matchesHistory: null,
    };
  },
  mounted() {
    axios({
      url: `${ process.env.VUE_APP_API_URL }/game/history`,
      method: "get",
      withCredentials: true
    }).then(res => {
      this.matchesHistory = res.data;
    }).catch(() => console.log(""));
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
  height: 60%;
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
  overflow-y: auto;
  height: 100%;
  width: 100%;
}

table {
  width: 100%;
  table-layout: fixed;
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
  width: 28%;
}

@media (max-width: 600px) {
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
