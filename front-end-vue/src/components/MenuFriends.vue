<template>
  <div id="body">
    <div id="title">
      <span>Friends</span>
    </div>
    <div id="table">
      <table>
        <template v-for="(friend, index) in friends">
          <template v-if="friend.requestStatus == 'accepted'">
            <tr class="row" :key="index">
              <td>
                <span>{{ friend.friendName }}</span>
              </td>
              <td v-if="is_auth">
                <span>{{ friend.friendStatus }}</span>
                <img
                  v-if="friend.friendStatus == 'offline'"
                  src="/assets/offline.svg"
                  alt="offline"
                  style="width:15px;margin-left:5px;"
                />
                <img
                  v-else-if="friend.friendStatus == 'online'"
                  src="/assets/online.svg"
                  alt="online"
                  style="width:15px;margin-left:5px;"
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
/* eslint-disable */
import Vue from "vue";
import axios from "axios";
export default Vue.extend({
  name: "MenuFriends",
  props: ['id'],
  data() {
    return {
      friends: null,
      is_auth: false
    };
  },
  mounted() {
    if (this.id == this.$store.state.user.id)
    this.is_auth = true;
    axios({
      url: `${ process.env.VUE_APP_API_URL }/friend/index`,
      method: "get",
      withCredentials: true
    }).then(res => {
      this.friends = res.data;
    }).catch(() => {
      console.log("");
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
  align-content: center;
  border-radius: 15px;
  width: 80%;
  height: 40%;
  overflow-y: auto;
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
  width: 100%;
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
  overflow: hidden;
  text-overflow: ellipsis;
}

.row {
  height: 10%;
  width: 100%;
  display: flex;
  justify-content: center;
}

table td {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45%;
  margin: 0 5px;
}

.row td:first-child {
  width: 45%;
}

.row td:last-child {
  min-width: 85px;
  width: fit-content;
}

@media (max-width: 770px) {
  #body {
    height: 90%;
    margin: 10px;
    max-height: 200px;
  }

  table {
    min-height: 15px;
  }
}

</style>
