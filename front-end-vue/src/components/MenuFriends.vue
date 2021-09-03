<template>
  <div id="body">
    <div id="title">
      <span>Friends</span>
    </div>
    <div id="table">
    <table>
      <template v-for="(friend, index) in friends">
        <template v-if="friend[0].requestStatus == 'accepted'">
          <tr class="row" :key="index">
            <td>
              <span>{{ friend[0].friendName }}</span>
            </td>
            <td>
              <span>{{ friend[0].friendStatus }}</span>
              <img
                v-if="friend[0].friendStatus == 'offline'"
                src="/assets/offline.svg"
                alt="offline"
                style="width:15px;"
              />
              <img
                v-else-if="friend[0].friendStatus == 'online'"
                src="/assets/online.svg"
                alt="online"
                style="width:15px;"
              />
            </td>
          </tr>
        </template>
      </template>
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
      friends: null
    };
  },
  mounted() {
    axios({
      url: "http://localhost:3000/friend/index",
      method: "get",
      withCredentials: true,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000"
      }
    }).then(res => {
      this.friends = res.data;
      console.log(this.friends);
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
  overflow-y: auto;
}

#title {
  width: 100%;
  font-weight: bold;
  background-color: #00286e;
}

#title span {
  color: white;
  font-size: 1.4rem;
}

#table {
  overflow-y: auto;
  height:100%;
  width:100%;
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