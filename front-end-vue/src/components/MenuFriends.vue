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
            <td v-if="is_auth">
              <span>{{ friend[0].friendStatus }}</span>
              <img
                v-if="friend[0].friendStatus == 'offline'"
                src="/assets/offline.svg"
                alt="offline"
                style="width:15px;margin-left:5px;"
              />
              <img
                v-else-if="friend[0].friendStatus == 'online'"
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
      console.log("not implemented");
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
